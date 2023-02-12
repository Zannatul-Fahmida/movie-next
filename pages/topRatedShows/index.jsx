import { useState } from "react";
import Movie from "../../components/Movie";
import Search from "../../components/Search";

const TopRatedShows = ({ shows }) => {
  const [filteredShows, setFilteredShows] = useState(shows.results);

  const handleSearch = (query) => {
    setFilteredShows(
      shows.results.filter(
        (show) =>
          show.name.toLowerCase().includes(query.toLowerCase()) ||
          show.first_air_date.includes(query)
      )
    );
  };
  return (
    <main className="mx-8 md:mx-32 my-12">
      <h1 className="text-3xl text-center text-rose-700 font-bold mb-6">
        Top Rated Shows
      </h1>
      <Search onSearch={handleSearch} />
      <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
        {filteredShows?.map((show) => (
          <Movie
            key={show.id}
            id={show.id}
            title={show.name}
            poster_path={show.poster_path}
            release_date={show.first_air_date}
          />
        ))}
      </div>
    </main>
  );
};

export default TopRatedShows;

export async function getServerSideProps() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.API_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      shows: data,
    },
  };
}
