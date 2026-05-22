import clientPromise from "./mongodb";
import Groq from "groq-sdk";

/**
 * Fetch AI-powered movie recommendations for a user based on their watchlist.
 * Server-side only — do not import this in client components.
 *
 * @param {string} email - The authenticated user's email address
 * @returns {{ recommendations: Array, empty: boolean }}
 */
export async function getRecommendations(email) {
  // 1. Read user's watchlist from MongoDB
  const client = await clientPromise;
  const db = client.db("movieNext");

  const watchlistDocs = await db
    .collection("watchlist")
    .find({ email })
    .sort({ created: -1 })
    .limit(20)
    .toArray();

  if (watchlistDocs.length === 0) {
    return { recommendations: [], empty: true };
  }

  const movieTitles = [...new Set(watchlistDocs.map((w) => w.movieName))];

  // 2. Ask Groq (Llama 3) for recommendations
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in .env.local");
  }

  const groq = new Groq({ apiKey });

  const prompt = `You are a movie recommendation engine. A user has saved these movies/shows to their watchlist:
${movieTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Based on their taste, recommend exactly 6 movies or TV shows they have NOT already saved.
Reply ONLY with a valid JSON array. No markdown, no explanation, no extra text outside the JSON.
Format:
[
  { "title": "Movie Title", "year": 2021, "reason": "One short sentence why they would enjoy it." }
]`;

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful movie recommendation assistant. Always respond with valid JSON only — no markdown, no explanation.",
      },
      {
        role: "user",
        content: prompt,
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
    console.error("[recommendations] Groq parse error. Raw response:", rawText);
    throw new Error("AI returned an unexpected format. Please try again.");
  }

  if (!Array.isArray(aiRecommendations)) {
    throw new Error("AI response was not a list. Please try again.");
  }

  // 3. Enrich each recommendation with TMDB poster data
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

  // Only keep results that have a TMDB poster
  const withPosters = enriched.filter((r) => r.poster_path);

  return { recommendations: withPosters, empty: false };
}
