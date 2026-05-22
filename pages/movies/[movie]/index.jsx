import Image from "next/image";
import Link from "next/link";
import Rating from "react-rating";
import withAuth from "../../../hoc/withAuth";
import { AiFillStar } from "react-icons/ai";
import { FiPlayCircle, FiClock, FiCalendar, FiActivity, FiGlobe, FiChevronLeft, FiStar, FiTv } from "react-icons/fi";
import RelatedMovie from "../../../components/RelatedMovie";
import clientPromise from "../../../lib/mongodb";

const MovieDetail = ({ movies, reviews, relatedMovies, query }) => {
  const imagePath = "https://image.tmdb.org/t/p/original";
  const posterPath = "https://image.tmdb.org/t/p/w500";

  const isShow = movies.name ? true : false;
  const title = movies.title || movies.name;
  const releaseDate = movies.release_date || movies.first_air_date;
  const runtime = movies.runtime || (movies.episode_run_time ? movies.episode_run_time[0] : null);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      
      {/* ── Cinematic Hero Section ── */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-stone-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={imagePath + movies.backdrop_path}
            alt={title}
            fill
            className="object-cover opacity-50 dark:opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent dark:from-stone-900 dark:via-stone-900/60 dark:to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-transparent dark:from-stone-900 dark:via-transparent dark:to-transparent z-10"></div>
        </div>

        {/* Back Button */}
        <div className="absolute top-28 left-6 md:left-12 z-20 animate-in fade-in slide-in-from-left-4 duration-700">
          <Link
            href={isShow ? "/shows" : "/movies"}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-xl border border-white/20 hover:border-white/40 rounded-full text-white font-bold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]"
          >
            <div className="bg-white/20 rounded-full p-1 group-hover:-translate-x-1 transition-transform">
              <FiChevronLeft className="w-4 h-4" />
            </div>
            <span className="tracking-wide text-sm uppercase">Back to browse</span>
          </Link>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 -mt-32 md:-mt-64 pb-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Poster (Left Column) */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-80 group">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 dark:border-white/5 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-15px_rgba(225,29,72,0.3)] bg-stone-900">
              <Image
                src={posterPath + movies.poster_path}
                alt={title}
                fill
                sizes="(max-width: 768px) 256px, 320px"
                className="object-cover"
                priority
              />
              {movies.homepage && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <a
                    href={movies.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-white hover:text-rose-400 transition-colors"
                  >
                    <FiPlayCircle className="w-16 h-16" />
                    <span className="font-bold tracking-wider uppercase text-sm">Watch Trailer</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Details (Right Column) */}
          <div className="flex-1 pt-4 md:pt-16 text-center md:text-left">
            
            {/* Title & Tagline */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-2 leading-tight">
              {title}
            </h1>
            {movies.tagline && (
              <p className="text-xl italic text-gray-500 dark:text-stone-400 mb-6 font-medium">
                "{movies.tagline}"
              </p>
            )}

            {/* Quick Stats Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
              {movies.vote_average > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-500 font-bold text-sm">
                  <FiStar className="fill-current w-4 h-4" />
                  {movies.vote_average.toFixed(1)} / 10
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-stone-800 text-gray-800 dark:text-stone-300 font-semibold text-sm">
                <FiCalendar className="w-4 h-4 text-gray-500 dark:text-stone-400" />
                {releaseDate?.slice(0, 4)}
              </span>
              {runtime && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-stone-800 text-gray-800 dark:text-stone-300 font-semibold text-sm">
                  <FiClock className="w-4 h-4 text-gray-500 dark:text-stone-400" />
                  {runtime} min
                </span>
              )}
              {isShow && movies.number_of_episodes && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-stone-800 text-gray-800 dark:text-stone-300 font-semibold text-sm">
                  <FiTv className="w-4 h-4 text-gray-500 dark:text-stone-400" />
                  {movies.number_of_episodes} Episodes
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-stone-800 text-gray-800 dark:text-stone-300 font-semibold text-sm uppercase tracking-wider">
                <FiGlobe className="w-4 h-4 text-gray-500 dark:text-stone-400" />
                {movies.original_language}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm uppercase tracking-wider ${
                movies.status === 'Released' || movies.status === 'Ended' || movies.status === 'Returning Series'
                  ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'
              }`}>
                <FiActivity className="w-4 h-4" />
                {movies.status}
              </span>
            </div>

            {/* Genres */}
            {movies.genres && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8">
                {movies.genres.map(genre => (
                  <span key={genre.id} className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-stone-700 text-gray-600 dark:text-stone-300 text-sm font-semibold hover:border-rose-500 hover:text-rose-500 transition-colors cursor-default">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h3>
              <p className="text-gray-600 dark:text-stone-300 text-lg leading-relaxed max-w-3xl">
                {movies.overview || "No overview available."}
              </p>
            </div>
            
          </div>
        </div>

        {/* ── Reviews Section ── */}
        {reviews.length > 0 && (
          <div className="mt-16 md:mt-24">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-200 dark:border-stone-800 pb-4">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">User Reviews</h2>
              <span className="px-3 py-1 bg-gray-200 dark:bg-stone-800 text-gray-700 dark:text-stone-300 font-bold rounded-full text-sm">
                {reviews.length}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white dark:bg-stone-900/50 backdrop-blur-sm border border-gray-100 dark:border-stone-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</p>
                        <p className="text-xs text-gray-500 dark:text-stone-500">
                          {new Date(review.created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-stone-800 rounded-lg">
                      <Rating
                        initialRating={review.rating}
                        emptySymbol={<AiFillStar className="w-3.5 h-3.5 text-gray-300 dark:text-stone-700" />}
                        fullSymbol={<AiFillStar className="w-3.5 h-3.5 text-yellow-400" />}
                        readonly
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-stone-300 text-sm leading-relaxed">
                    "{review.description}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Movies Section ── */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-gray-200 dark:border-stone-800">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-8">More Like This</h2>
          <RelatedMovie relatedMovies={relatedMovies} query={query} />
        </div>

      </div>
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

  const client = await clientPromise;
  const db = client.db("movieNext");
  const reviews = await db
    .collection("reviews")
    .find({ movieName: data.title || data.name })
    .toArray();
    
  let relatedURL;
  if (category === "popularMovies") {
    relatedURL = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&with_genres=${data?.genres?.[0]?.id}`;
  } else if (category === "topRatedMovies") {
    relatedURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}&with_genres=${data?.genres?.[0]?.id}`;
  } else if (category === "popularShows") {
    relatedURL = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}&with_genres=${data?.genres?.[0]?.id}`;
  } else if (category === "topRatedShows") {
    relatedURL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.API_KEY}&with_genres=${data?.genres?.[0]?.id}`;
  }
  
  let relatedMovies = [];
  if (relatedURL) {
      const related = await fetch(relatedURL);
      relatedMovies = await related.json();
  }

  return {
    props: {
      movies: data,
      reviews: JSON.parse(JSON.stringify(reviews)),
      relatedMovies: relatedMovies,
      query: query.category || "",
    },
  };
}
