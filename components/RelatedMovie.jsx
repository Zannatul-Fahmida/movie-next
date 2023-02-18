import Image from 'next/image'
import Link from 'next/link';

const RelatedMovie = ({ relatedMovies }) => {
  const imagePath = "https://image.tmdb.org/t/p/original";
  const relatedMovie = relatedMovies.results.slice(0, 5);
  return (
    <div className="grid gap-2 md:grid-cols-5 mt-8">
      {relatedMovie.map((movie) => (
        <div key={movie.id}>
        <Link href={`${movie.id}`}>
        <Image
        className='w-full'
          width={200}
          height={200}
          src={imagePath + movie.poster_path}
          alt={movie.title}
          priority
        />
        <div className="bg-rose-700 text-white px-2 py-2 h-28">
          <h1 className="font-semibold">{movie.title}</h1>
          <h2>{movie.release_date}</h2>
        </div>
        </Link>
        </div>
      ))}
    </div>
  );
};

export default RelatedMovie;
