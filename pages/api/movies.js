export default async function handler(req, res) {
  const { category = "popular" } = req.query;

  const allowed = ["popular", "top_rated"];
  if (!allowed.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    const fetchPage = async (page) => {
      const apiRes = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?api_key=${process.env.API_KEY}&page=${page}`
      );
      const data = await apiRes.json();
      return data.results || [];
    };

    const [page1, page2, page3] = await Promise.all([
      fetchPage(1),
      fetchPage(2),
      fetchPage(3),
    ]);

    res.status(200).json({ results: [...page1, ...page2, ...page3] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
