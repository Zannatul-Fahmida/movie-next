import Image from "next/image";

export default function Movie({ title, poster_path, release_date }) {
  const imagePath = "https://image.tmdb.org/t/p/original";
  return (
    <div>
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
    </div>
  );
}
