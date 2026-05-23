import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are a highly empathetic and expert movie matchmaker. 
The user is expressing their mood or what they want to watch. 
User says: "${prompt}"

Analyze their emotion and request. Recommend exactly 5 movies or TV shows that perfectly match this mood.
Reply ONLY with a valid JSON array. No markdown, no explanation, no extra text.
Format:
[
  { "title": "Movie Title", "year": 2021, "reason": "One short, compelling sentence why this matches their mood.", "genre": "Sci-Fi" }
]`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation assistant. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rawText = chatCompletion.choices[0]?.message?.content?.trim() ?? "";

    // Strip markdown code fences if the model wraps the JSON
    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let aiRecommendations;
    try {
      aiRecommendations = JSON.parse(jsonText);
    } catch {
      console.error("[mood-api] Groq parse error. Raw response:", rawText);
      return res.status(500).json({ message: "AI returned an unexpected format. Please try again." });
    }

    if (!Array.isArray(aiRecommendations)) {
      return res.status(500).json({ message: "AI response was not a list. Please try again." });
    }

    // Enrich with TMDB poster data
    const TMDB_KEY = process.env.API_KEY;
    const enriched = await Promise.all(
      aiRecommendations.map(async (rec) => {
        try {
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(
              rec.title
            )}&page=1`
          );
          const searchData = await searchRes.json();
          const match = searchData.results?.[0];

          if (!match) {
            return {
              ...rec,
              tmdbId: null,
              poster_path: null,
              release_date: null,
              media_type: null,
            };
          }

          return {
            title: match.title || match.name || rec.title,
            year: rec.year,
            reason: rec.reason,
            genre: rec.genre,
            tmdbId: match.id,
            poster_path: match.poster_path,
            release_date: match.release_date || match.first_air_date || null,
            media_type: match.media_type,
          };
        } catch {
          return {
            ...rec,
            tmdbId: null,
            poster_path: null,
            release_date: null,
            media_type: null,
          };
        }
      })
    );

    // Filter to those with posters and tmdb ids to look premium
    const withPosters = enriched.filter((r) => r.poster_path);

    res.status(200).json({ recommendations: withPosters });
  } catch (error) {
    console.error("[mood-api] Error:", error);
    res.status(500).json({ message: "Failed to generate recommendations", error: error.message });
  }
}
