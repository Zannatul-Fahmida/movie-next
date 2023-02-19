import { useState } from "react";
import Movie from "../../components/Movie";
import Search from "../../components/Search";
import Link from "next/link";

const PopularMovies = ({ movies }) => {
  const [filteredMovies, setFilteredMovies] = useState(movies.results);

  const handleSearch = (query) => {
    setFilteredMovies(
      movies.results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.release_date.includes(query)
      )
    );
  };

  const handleWatchList = async ({ movieName, poster, releaseDate }) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieName,
          poster,
          releaseDate,
        }),
      });
      const list = await res.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="mx-8 md:mx-32 my-12">
      <h1 className="text-3xl text-center text-rose-700 font-bold mb-6">
        Popular Movies
      </h1>
      <Search onSearch={handleSearch} />
      <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
        {filteredMovies?.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}?category=popularMovies`}
            onClick={() =>
              handleWatchList({
                movieName: movie.title,
                poster: movie.poster_path,
                releaseDate: movie.release_date,
              })
            }
          >
            <Movie
              title={movie.title}
              poster_path={movie.poster_path}
              release_date={movie.release_date}
            />
          </Link>
        ))}
      </div>
    </main>
  );
};
export default PopularMovies;

export async function getServerSideProps() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      movies: data,
    },
  };
}
