import { useState } from "react";
import Movie from "../../components/Movie";
import Search from "../../components/Search";

const PopularMovies = ({movies}) => {
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
  return (
    <main className="mx-8 md:mx-32 my-12">
      <h1 className="text-3xl text-center text-rose-700 font-bold mb-6">
        Popular Movies
      </h1>
      <Search onSearch={handleSearch} />
      <div className="grid gap-16 grid-cols-fluid mt-6">
        {filteredMovies?.map((movie) => (
          <Movie
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            release_date={movie.release_date}
          />
        ))}
      </div>
    </main>
  );
};
export default PopularMovies;

export async function getServerSideProps() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`);
  const data = await res.json();

  return {
    props: {
      movies: data,
    },
  };
}
