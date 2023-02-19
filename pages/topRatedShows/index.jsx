import { useState } from "react";
import Movie from "../../components/Movie";
import Search from "../../components/Search";
import Link from "next/link";

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
        Top Rated Shows
      </h1>
      <Search onSearch={handleSearch} />
      <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
        {filteredShows?.map((show) => (
          <Link
            key={show.id}
            href={`/movies/${show.id}?category=topRatedShows`}
            onClick={() =>
              handleWatchList({
                movieName: show.name,
                poster: show.poster_path,
                releaseDate: show.first_air_date,
              })
            }
          >
            <Movie
              title={show.name}
              poster_path={show.poster_path}
              release_date={show.first_air_date}
            />
          </Link>
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
