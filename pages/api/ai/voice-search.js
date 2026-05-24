import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { transcript, type } = req.body;

  if (!transcript) {
    return res.status(400).json({ message: "Transcript is required" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }

    const groq = new Groq({ apiKey });

    const isMovies = type === "movies";
    const mediaContext = isMovies ? "movies" : "TV shows";

    const systemPrompt = `You are a highly advanced AI movie/TV search engine.
The user is speaking a natural language query to find ${mediaContext}.
User's spoken query: "${transcript}"

Task: Understand the user's intent and recommend exactly 12 ${mediaContext} that perfectly match their request.
If they ask for movies from a specific director, genre, or year, provide accurate matches.
If their query is vague, infer the best popular matches.

Reply ONLY with a valid JSON array of objects. No markdown, no explanation, no extra text.
Format:
[
  { "title": "Exact Title of Movie/Show" }
]`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an AI search engine. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const rawText = chatCompletion.choices[0]?.message?.content?.trim() ?? "";

    // Strip markdown code fences if the model wraps the JSON
    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let aiResults;
    try {
      aiResults = JSON.parse(jsonText);
    } catch {
      console.error("[voice-search-api] Groq parse error. Raw response:", rawText);
      return res.status(500).json({ message: "AI returned an unexpected format. Please try again." });
    }

    if (!Array.isArray(aiResults)) {
      return res.status(500).json({ message: "AI response was not a list. Please try again." });
    }

    // Enrich with TMDB poster data
    const TMDB_KEY = process.env.API_KEY;
    const enriched = await Promise.all(
      aiResults.map(async (rec) => {
        try {
          // Use specific search endpoint based on type to be more accurate
          const searchEndpoint = isMovies ? "search/movie" : "search/tv";
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/${searchEndpoint}?api_key=${TMDB_KEY}&query=${encodeURIComponent(
              rec.title
            )}&page=1`
          );
          const searchData = await searchRes.json();
          const match = searchData.results?.[0];

          if (!match) return null;

          // Map it to our standard component expected format
          return {
            id: match.id,
            title: match.title || match.name,
            name: match.name || match.title,
            poster_path: match.poster_path,
            release_date: match.release_date || match.first_air_date || null,
            first_air_date: match.first_air_date || match.release_date || null,
            vote_average: match.vote_average,
            vote_count: match.vote_count,
            overview: match.overview,
          };
        } catch {
          return null;
        }
      })
    );

    // Filter out nulls and ones without posters
    const validResults = enriched.filter((r) => r !== null && r.poster_path);

    res.status(200).json({ results: validResults });
  } catch (error) {
    console.error("[voice-search-api] Error:", error);
    res.status(500).json({ message: "Failed to process voice search", error: error.message });
  }
}
