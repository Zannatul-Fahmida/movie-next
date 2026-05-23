import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "Answers are required" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }

    const groq = new Groq({ apiKey });

    const formattedAnswers = answers.map((a, i) => `Q${i+1}: ${a.question} -> A: ${a.answer}`).join("\n");

    const systemPrompt = `You are a fun movie psychologist. 
The user has completed a personality test. Here are their answers:
${formattedAnswers}

Based exclusively on their vibe and answers, determine EXACTLY ONE movie or TV show that perfectly represents their personality.
Reply ONLY with a valid JSON object. No markdown, no explanation, no extra text.
Format:
{ 
  "title": "Movie Title", 
  "year": 2021, 
  "reason": "A fun, personalized explanation (2-3 sentences) why this movie perfectly matches their personality based on their answers.",
  "genre": "Action" 
}`;

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
      temperature: 0.8,
      max_tokens: 1024,
    });

    const rawText = chatCompletion.choices[0]?.message?.content?.trim() ?? "";

    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let aiMatch;
    try {
      aiMatch = JSON.parse(jsonText);
    } catch {
      console.error("[personality-api] Groq parse error. Raw response:", rawText);
      return res.status(500).json({ message: "AI returned an unexpected format. Please try again." });
    }

    if (!aiMatch.title) {
      return res.status(500).json({ message: "AI response was invalid. Please try again." });
    }

    // Enrich with TMDB poster data
    const TMDB_KEY = process.env.API_KEY;
    try {
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(
          aiMatch.title
        )}&page=1`
      );
      const searchData = await searchRes.json();
      const match = searchData.results?.[0];

      if (match) {
        aiMatch.tmdbId = match.id;
        aiMatch.poster_path = match.poster_path;
        aiMatch.backdrop_path = match.backdrop_path;
        aiMatch.media_type = match.media_type;
        aiMatch.title = match.title || match.name || aiMatch.title;
      }
    } catch (err) {
      console.error("[personality-api] TMDB fetch error:", err);
    }

    res.status(200).json({ match: aiMatch });
  } catch (error) {
    console.error("[personality-api] Error:", error);
    res.status(500).json({ message: "Failed to generate match", error: error.message });
  }
}
