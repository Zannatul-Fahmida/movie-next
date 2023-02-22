import Image from "next/image";
import Link from "next/link";
import Rating from "react-rating";
import withAuth from "../../../hoc/withAuth";
import { connectToDatabase } from "../../../lib/mongodb";
import { AiFillStar } from "react-icons/ai";
import RelatedMovie from "../../../components/RelatedMovie";

const MovieDetail = ({ movies, reviews, relatedMovies, query }) => {
  const imagePath = "https://image.tmdb.org/t/p/original";

  return (
    <div className="mx-4 my-4 md:mx-32 md:my-12">
      <h2 className="text-3xl text-rose-700 font-bold">
        {movies.title ? movies.title : movies.name}
      </h2>
      {movies.release_date ? (
        <h2 className="text-lg">Release Date: {movies.release_date}</h2>
      ) : (
        <h2 className="text-lg">First Air Date: {movies.first_air_date}</h2>
      )}
      {movies.number_of_episodes && (
        <h2>Total Episodes: {movies.number_of_episodes} episodes</h2>
      )}
      {movies.runtime && <h2>Runtime: {movies.runtime} minutes</h2>}
      <h2 className="bg-green-600 inline-block my-2 py-2 px-4 text-white rounded-md text-sm">
        {movies.status}
      </h2>
      <Image
        className="my-6 w-full"
        width={1000}
        height={1000}
        src={imagePath + movies.backdrop_path}
        alt={movies.title ? movies.title : movies.name}
        priority
      />
      <p className="mb-6">{movies.overview}</p>
      {reviews.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Reviews:</h3>
          <div className="grid md:grid-cols-5 gap-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <p className="text-lg">{review.description}</p>
                <Rating
                  initialRating={review.rating}
                  emptySymbol={<AiFillStar className="icon text-slate-300" />}
                  fullSymbol={<AiFillStar className="icon text-yellow-500" />}
                  readonly
                />
                <p className="text-sm">{review.name}</p>
                <p className="text-xs">
                  {new Date(review.created).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Link className="bg-rose-700 text-white px-4 py-2 rounded-md" href="/">
        <button>Back To Home</button>
      </Link>
      <RelatedMovie relatedMovies={relatedMovies} query={query} />
    </div>
  );
};

export default withAuth(MovieDetail);

export async function getServerSideProps(context) {
  const { params, query } = context;
  const movie = params.movie;
  const category = query.category;
  let apiURL;
  if (category === "popularMovies" || category === "topRatedMovies") {
    apiURL = `https://api.themoviedb.org/3/movie/${movie}?api_key=${process.env.API_KEY}`;
  } else if (category === "popularShows" || category === "topRatedShows") {
    apiURL = `https://api.themoviedb.org/3/tv/${movie}?api_key=${process.env.API_KEY}`;
  }
  const res = await fetch(apiURL);
  const data = await res.json();

  const client = await connectToDatabase();
  const db = client.db();
  const reviews = await db
    .collection("reviews")
    .find({ movieName: data.title })
    .toArray();
  let relatedURL;
  if (category === "popularMovies") {
    relatedURL = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&with_genres=${data?.genres[0]?.name}`;
  } else if (category === "topRatedMovies") {
    relatedURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}&with_genres=${data?.genres[0]?.name}`;
  } else if (category === "popularShows") {
    relatedURL = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}&with_genres=${data?.genres[0]?.name}`;
  } else if (category === "topRatedShows") {
    relatedURL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.API_KEY}&with_genres=${data?.genres[0]?.name}`;
  }
  const related = await fetch(relatedURL);
  const relatedMovies = await related.json();

  return {
    props: {
      movies: data,
      reviews: JSON.parse(JSON.stringify(reviews)),
      relatedMovies: relatedMovies,
      query: query.category,
    },
  };
}
