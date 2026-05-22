import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiSearch, FiX, FiStar, FiTrendingUp, FiAward, FiBookmark } from "react-icons/fi";
import { MdLiveTv } from "react-icons/md";
import { toast } from "react-hot-toast";

const Toaster = dynamic(() => import("react-hot-toast").then((m) => m.Toaster), { ssr: false });

const CATEGORIES = [
  { label: "Popular Shows", shortLabel: "Popular", value: "popular", icon: FiTrendingUp, desc: "Trending worldwide" },
  { label: "Top Rated", shortLabel: "Top", value: "top_rated", icon: FiAward, desc: "All-time greats" },
];

const imagePath = "https://image.tmdb.org/t/p/w500";

export default function ShowsPage({ initialShows }) {
  const [category, setCategory] = useState("popular");
  const [shows, setShows] = useState(initialShows);
  const [filteredShows, setFilteredShows] = useState(initialShows);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const fetchShows = useCallback(async (cat) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shows?category=${cat}`);
      const data = await res.json();
      setShows(data.results || []);
      setFilteredShows(data.results || []);
      setSearchQuery("");
    } catch {
      toast.error("Failed to fetch shows.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = (val) => {
    if (val === category) return;
    setCategory(val);
    if (val !== "popular") fetchShows(val);
    else {
      setShows(initialShows);
      setFilteredShows(initialShows);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredShows(shows);
    } else {
      setFilteredShows(
        shows.filter((s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.first_air_date?.includes(searchQuery)
        )
      );
    }
  }, [searchQuery, shows]);

  const handleAddToWatchlist = async (e, show) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(show.id);
    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: show.name,
          poster: show.poster_path,
          releaseDate: show.first_air_date,
        }),
      });
      toast.success(`"${show.name}" added to watchlist!`);
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

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
                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30"
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-400">Popular</span>{" "}
                Shows
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-500 to-indigo-400">Top Rated</span>{" "}
                Shows
              </>
            )}
          </h1>
          <p className="text-gray-400 dark:text-stone-400 text-lg mb-10">
            {CATEGORIES.find((c) => c.value === category)?.desc} · {filteredShows.length} titles
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or year…"
              className="w-full pl-14 pr-12 py-4 bg-white dark:bg-white/10 dark:backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm font-medium shadow-sm"
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
        ) : filteredShows.length === 0 ? (

          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-stone-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-200 dark:border-stone-800">
              <MdLiveTv className="w-10 h-10 text-gray-300 dark:text-stone-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No results</h3>
            <p className="text-gray-500 dark:text-stone-400 mb-6">Nothing matched &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (

          /* Shows Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
            {filteredShows.map((show) => (
              <Link
                key={show.id}
                href={`/movies/${show.id}?category=${category === "popular" ? "popularShows" : "topRatedShows"}`}
                className="group flex flex-col"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-stone-800 shadow-md group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:-translate-y-2">
                  {show.poster_path ? (
                    <Image
                      src={imagePath + show.poster_path}
                      alt={show.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-800">
                      <MdLiveTv className="w-16 h-16 text-stone-600" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Rating */}
                  {show.vote_average > 0 && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-black px-2.5 py-1 rounded-full border border-yellow-400/20">
                      <FiStar className="fill-current w-3 h-3" />
                      <span>{show.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                    <button
                      onClick={(e) => handleAddToWatchlist(e, show)}
                      disabled={addingId === show.id}
                      className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/50"
                    >
                      <FiBookmark className="w-3.5 h-3.5" />
                      {addingId === show.id ? "Adding…" : "Watchlist"}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 px-0.5">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">
                    {show.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 dark:text-stone-500 font-medium">
                      {show.first_air_date?.slice(0, 4) || "—"}
                    </span>
                    {show.vote_count > 0 && (
                      <>
                        <span className="text-xs text-gray-300 dark:text-stone-600">·</span>
                        <span className="text-xs text-gray-400 dark:text-stone-500 font-medium">
                          {(show.vote_count / 1000).toFixed(0)}k votes
                        </span>
                      </>
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
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      initialShows: data.results || [],
    },
  };
}
