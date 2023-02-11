import Image from "next/image";
import Link from "next/link";

const MovieDetail = ({ movies }) => {
  const imagePath = "https://image.tmdb.org/t/p/original";
  return (
    <div className=" mx-32 my-12">
      <h2 className="text-3xl text-rose-700 font-bold">{movies.title}</h2>
      <h2 className="text-lg">{movies.release_date}</h2>
      <h2>Runtime: {movies.runtime} minutes</h2>
      <h2 className="bg-green-600 inline-block my-2 py-2 px-4 text-white rounded-md text-sm">
        {movies.status}
      </h2>
      <Image
        className="my-10 w-full"
        width={1000}
        height={1000}
        src={imagePath + movies.backdrop_path}
        alt={movies.title}
        priority
      />
      <p className="mb-6">{movies.overview}</p>
      <Link className="bg-rose-700 text-white px-4 py-2 rounded-md" href="/">
        <button>Back To Home</button>
      </Link>
    </div>
  );
};

export default MovieDetail;

export async function getServerSideProps(context) {
  const { params } = context;
  const movie = params.movie;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movie}?api_key=${process.env.API_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      movies: data,
    },
  };
}
