import GenreChallenge from "../../../../components/quiz/GenreChallenge";
import { getSession } from "next-auth/react";

export default function GenreChallengePage({ movies, genres }) {
  return <GenreChallenge movies={movies} genres={genres} />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  try {
    const TMDB_KEY = process.env.API_KEY;
    
    // Fetch genres and movies
    const [genresRes, moviesRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=${Math.floor(Math.random() * 5) + 1}`) // random page 1-5 for variety
    ]);
    
    const genresData = await genresRes.json();
    const moviesData = await moviesRes.json();

    const genres = genresData.genres || [];
    const movies = (moviesData.results || []).filter(m => m.poster_path && m.genre_ids?.length > 0);

    return {
      props: { genres, movies },
    };
  } catch (err) {
    console.error("Genre challenge error:", err);
    return { props: { genres: [], movies: [] } };
  }
}
