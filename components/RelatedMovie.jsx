import Image from "next/image";
import Link from "next/link";

const shuffleMovies = (movie) => {
  for (let i = movie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [movie[i], movie[j]] = [movie[j], movie[i]];
  }
  return movie;
};

const RelatedMovie = ({ relatedMovies, query }) => {
  const imagePath = "https://image.tmdb.org/t/p/original";
  const relatedMovie = shuffleMovies(relatedMovies?.results).slice(0, 5);
  return (
    <div className="grid gap-2 md:grid-cols-5 mt-8">
      {relatedMovie?.map((movie) => (
        <div key={movie.id}>
          <Link href={`${movie.id}?category=${query}`}>
            <Image
              className="w-full"
              width={200}
              height={200}
              src={imagePath + movie.poster_path}
              alt={movie.title}
              priority
            />
            <div className="bg-rose-700 text-white px-2 py-2 h-28">
              <h1 className="font-semibold">
                {movie.title ? movie.title : movie.name}
              </h1>
              <h2>
                {movie.release_date ? movie.release_date : movie.first_air_date}
              </h2>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RelatedMovie;
