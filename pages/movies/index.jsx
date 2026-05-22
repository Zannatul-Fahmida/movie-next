import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiSearch, FiX, FiStar, FiTrendingUp, FiAward, FiBookmark } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Toaster = dynamic(() => import("react-hot-toast").then((m) => m.Toaster), { ssr: false });

const CATEGORIES = [
  { label: "Popular Movies", shortLabel: "Popular", value: "popular", icon: FiTrendingUp, desc: "Trending worldwide" },
  { label: "Top Rated", shortLabel: "Top", value: "top_rated", icon: FiAward, desc: "All-time greats" },
];

const imagePath = "https://image.tmdb.org/t/p/w500";

export default function MoviesPage({ initialMovies }) {
  const [category, setCategory] = useState("popular");
  const [movies, setMovies] = useState(initialMovies);
  const [filteredMovies, setFilteredMovies] = useState(initialMovies);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const fetchMovies = useCallback(async (cat) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?category=${cat}`);
      const data = await res.json();
      setMovies(data.results || []);
      setFilteredMovies(data.results || []);
      setSearchQuery("");
    } catch {
      toast.error("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = (val) => {
    if (val === category) return;
    setCategory(val);
    if (val !== "popular") fetchMovies(val);
    else {
      setMovies(initialMovies);
      setFilteredMovies(initialMovies);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.release_date?.includes(searchQuery)
        )
      );
    }
  }, [searchQuery, movies]);

  const handleAddToWatchlist = async (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(movie.id);
    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: movie.title,
          poster: movie.poster_path,
          releaseDate: movie.release_date,
        }),
      });
      toast.success(`"${movie.title}" added to watchlist!`);
    } catch {
      toast.error("Failed to add to watchlist.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <Toaster position="bottom-right" />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-white dark:bg-stone-900 pt-28 pb-16 border-b border-gray-100 dark:border-stone-800">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-500/10 dark:bg-orange-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Category Toggle Tabs */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl p-1.5 mb-8">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-500/30"
                      : "text-gray-500 hover:text-gray-900 dark:text-stone-400 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-none">
            {category === "popular" ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Popular</span>{" "}
                Movies
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">Top Rated</span>{" "}
                Movies
              </>
            )}
          </h1>
          <p className="text-gray-400 dark:text-stone-400 text-lg mb-10">
            {CATEGORIES.find((c) => c.value === category)?.desc} · {filteredMovies.length} titles
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or year…"
              className="w-full pl-14 pr-12 py-4 bg-white dark:bg-white/10 dark:backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all text-sm font-medium shadow-sm"
            />
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-stone-200 group-focus-within:!text-violet-500 dark:group-focus-within:!text-violet-400 transition-colors" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-700 dark:text-stone-400 dark:hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-200 dark:bg-stone-800 rounded-2xl mb-3"></div>
                <div className="h-3.5 bg-gray-200 dark:bg-stone-800 rounded-lg mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-100 dark:bg-stone-900 rounded-lg w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (

          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-stone-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-200 dark:border-stone-800">
              <FiSearch className="w-10 h-10 text-gray-300 dark:text-stone-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No results</h3>
            <p className="text-gray-500 dark:text-stone-400 mb-6">Nothing matched &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (

          /* Movie Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}?category=${category === "popular" ? "popularMovies" : "topRatedMovies"}`}
                className="group flex flex-col"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-stone-800 shadow-md group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:-translate-y-2">
                  <Image
                    src={imagePath + movie.poster_path}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient overlay always-on at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Rating */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-black px-2.5 py-1 rounded-full border border-yellow-400/20">
                      <FiStar className="fill-current w-3 h-3" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Hover overlay with Watchlist button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                    <button
                      onClick={(e) => handleAddToWatchlist(e, movie)}
                      disabled={addingId === movie.id}
                      className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-lg shadow-rose-900/50"
                    >
                      <FiBookmark className="w-3.5 h-3.5" />
                      {addingId === movie.id ? "Adding…" : "Watchlist"}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 px-0.5">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-tight">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 dark:text-stone-500 font-medium">
                      {movie.release_date?.slice(0, 4) || "—"}
                    </span>
                    {movie.vote_count > 0 && (
                      <span className="text-xs text-gray-300 dark:text-stone-600">·</span>
                    )}
                    {movie.vote_count > 0 && (
                      <span className="text-xs text-gray-400 dark:text-stone-500 font-medium">
                        {(movie.vote_count / 1000).toFixed(0)}k votes
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      initialMovies: data.results || [],
    },
  };
}
