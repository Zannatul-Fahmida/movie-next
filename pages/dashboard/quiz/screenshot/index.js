import ScreenshotQuiz from "../../../../components/quiz/ScreenshotQuiz";
import { getSession } from "next-auth/react";

export default function ScreenshotQuizPage({ movies }) {
  return <ScreenshotQuiz movies={movies} />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  try {
    const TMDB_KEY = process.env.API_KEY;
    // Fetch 2 pages of popular movies to get a good pool (40 movies)
    const [res1, res2] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=1`),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=2`)
    ]);
    
    const data1 = await res1.json();
    const data2 = await res2.json();

    const movies = [...(data1.results || []), ...(data2.results || [])].filter(m => m.backdrop_path);

    return {
      props: { movies },
    };
  } catch (err) {
    console.error("Screenshot quiz error:", err);
    return { props: { movies: [] } };
  }
}
