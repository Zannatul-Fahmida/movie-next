import Image from "next/image";
import Link from "next/link";
import Rating from "react-rating";
import withAuth from "../../hoc/withAuth";
import { connectToDatabase } from "../../lib/mongodb";
import {AiFillStar} from "react-icons/ai"

const MovieDetail = ({ movies, reviews }) => {
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
        className="my-6 w-full"
        width={1000}
        height={1000}
        src={imagePath + movies.backdrop_path}
        alt={movies.title}
        priority
      />
      <p className="mb-6">{movies.overview}</p>
      {reviews.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Reviews:</h3>
          <div className="grid grid-cols-5 gap-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
              <p className="text-lg">{review.description}</p>
                <Rating
                initialRating={review.rating}
                  emptySymbol={
                    <AiFillStar className="icon text-slate-300" />
                  }
                  fullSymbol={
                    <AiFillStar className="icon text-yellow-500" />
                  }
                  readonly
                />
                <p className="text-sm">{review.name}</p>
                <p className="text-xs">{new Date(review.created).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Link className="bg-rose-700 text-white px-4 py-2 rounded-md" href="/">
        <button>Back To Home</button>
      </Link>
    </div>
  );
};

export default withAuth(MovieDetail);

export async function getServerSideProps(context) {
  const { params } = context;
  const movie = params.movie;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movie}?api_key=${process.env.API_KEY}`
  );
  const data = await res.json();

  const client = await connectToDatabase();
  const db = client.db();
  const reviews = await db
    .collection("reviews")
    .find({ movieName: data.title })
    .toArray();

  return {
    props: {
      movies: data,
      reviews: JSON.parse(JSON.stringify(reviews)),
    },
  };
}
