import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";

const shuffleMovies = (movie) => {
  for (let i = movie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [movie[i], movie[j]] = [movie[j], movie[i]];
  }
  return movie;
};

const RelatedMovie = ({ relatedMovies, query }) => {
  const imagePath = "https://image.tmdb.org/t/p/w500";
  
  if (!relatedMovies?.results || relatedMovies.results.length === 0) {
    return <p className="text-gray-500 dark:text-stone-400">No related titles found.</p>;
  }

  const relatedMovie = shuffleMovies([...relatedMovies.results]).slice(0, 5);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-8">
      {relatedMovie.map((movie) => {
        const title = movie.title || movie.name;
        const releaseDate = movie.release_date || movie.first_air_date;

        return (
          <div key={movie.id}>
            <Link
              href={`/movies/${movie.id}?category=${query}`}
              className="group flex flex-col"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-stone-800 shadow-sm group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:-translate-y-2">
                {movie.poster_path ? (
                  <Image
                    src={imagePath + movie.poster_path}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                    <span className="text-stone-600 text-xs text-center px-2">No Image</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Rating */}
                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-black px-2 py-1 rounded-full">
                    <FiStar className="fill-current w-3 h-3" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Info Below Poster */}
              <div className="mt-3 px-1">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-tight">
                  {title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-stone-500 mt-0.5 font-medium">
                  {releaseDate?.slice(0, 4) || "—"}
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default RelatedMovie;
