export default async function handler(req, res) {
  const { category = "popular" } = req.query;

  const allowed = ["popular", "top_rated"];
  if (!allowed.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    const apiRes = await fetch(
      `https://api.themoviedb.org/3/tv/${category}?api_key=${process.env.API_KEY}`
    );
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shows" });
  }
}
