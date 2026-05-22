import { getSession } from "next-auth/react";
import { getRecommendations } from "../../lib/recommendations";

/**
 * GET /api/recommendations
 * Returns AI-powered movie recommendations based on the user's watchlist.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await getRecommendations(session.user.email);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[recommendations] handler error:", err.message);
    return res.status(500).json({ message: err.message || "Something went wrong." });
  }
}
