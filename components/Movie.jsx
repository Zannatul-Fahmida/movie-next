import Image from "next/image";
import Link from "next/link";

export default function Movie({ title, id, poster_path, release_date }) {
  const imagePath = "https://image.tmdb.org/t/p/original";
  const handleWatchList = async ({ title, poster_path, release_date }) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieName: title,
          poster: poster_path,
          releaseDate: release_date,
        }),
      });
      const list = await res.json();
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <Link
        href={`${id}`}
        onClick={() =>
          handleWatchList({
            title,
            poster_path,
            release_date,
          })
        }
      >
        <Image
          width={800}
          height={800}
          src={imagePath + poster_path}
          alt={title}
          priority
        />
        <div className="bg-rose-700 text-white px-2 py-2">
          <h1 className="font-semibold">{title}</h1>
          <h2>{release_date}</h2>
        </div>
      </Link>
    </div>
  );
}
