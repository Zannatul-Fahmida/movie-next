import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiSearch, FiX, FiStar, FiTrendingUp, FiAward, FiBookmark, FiChevronLeft, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import { MdLiveTv } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import HeroHeader from "../../components/HeroHeader";

const Toaster = dynamic(() => import("react-hot-toast").then((m) => m.Toaster), { ssr: false });

const CATEGORIES = [
  { label: "Popular Shows", shortLabel: "Popular", value: "popular", icon: FiTrendingUp, desc: "Trending worldwide" },
  { label: "Top Rated", shortLabel: "Top", value: "top_rated", icon: FiAward, desc: "All-time greats" },
];

const imagePath = "https://image.tmdb.org/t/p/w500";

export default function ShowsPage({ initialShows, initialWatchlist = [] }) {
  const { data: session } = useSession();
  const [category, setCategory] = useState("popular");
  const [shows, setShows] = useState(initialShows);
  const [filteredShows, setFilteredShows] = useState(initialShows);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  // Track watchlist locally for instant UI updates
  const [localWatchlist, setLocalWatchlist] = useState(
    new Set(initialWatchlist.map(w => w.movieName))
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredShows]);

  const totalPages = Math.ceil(filteredShows.length / ITEMS_PER_PAGE);
  const currentShows = filteredShows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

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

  const handleVoiceSearch = async (transcript) => {
    setLoading(true);
    setCategory("ai_search");
    
    try {
      const res = await fetch("/api/ai/voice-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, type: "shows" }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Voice search failed");
      
      setShows(data.results || []);
      setFilteredShows(data.results || []);
      setSearchQuery("");
      toast.success("Found some great matches!");
    } catch (err) {
      toast.error(err.message);
      setCategory("popular");
      fetchShows("popular");
    } finally {
      setLoading(false);
    }
  };

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

    if (!session) {
      toast.error("Please login to add to watchlist!");
      return;
    }

    setAddingId(show.id);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: show.name,
          poster: show.poster_path,
          releaseDate: show.first_air_date,
        }),
      });
      if (res.status === 409) {
        setLocalWatchlist(prev => new Set(prev).add(show.name));
        toast.error("Already in your watchlist!");
        return;
      }
      if (!res.ok) throw new Error("Failed to add to watchlist.");
      setLocalWatchlist(prev => new Set(prev).add(show.name));
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
      <HeroHeader
        type="shows"
        categories={CATEGORIES}
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
        titleSuffix="Shows"
        itemCount={filteredShows.length}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchClear={() => setSearchQuery("")}
        onVoiceSearchComplete={handleVoiceSearch}
      />

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
          /* Show Grid */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
              {currentShows.map((show) => (
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
                    {localWatchlist.has(show.name) ? (
                      <div className="w-full flex items-center justify-center gap-2 bg-emerald-600/90 text-white text-xs font-black py-2.5 rounded-xl backdrop-blur-sm shadow-lg shadow-emerald-900/50">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        In Watchlist
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleAddToWatchlist(e, show)}
                        disabled={addingId === show.id}
                        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/50"
                      >
                        <FiBookmark className="w-3.5 h-3.5" />
                        {addingId === show.id ? "Adding…" : "Watchlist"}
                      </button>
                    )}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 pb-8 animate-in fade-in duration-500 col-span-full">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/30 dark:hover:border-rose-900/50 dark:hover:text-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all shadow-sm ${
                          currentPage === page
                            ? "bg-rose-600 text-white border border-rose-600"
                            : "bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-stone-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/30 dark:hover:border-rose-900/50 dark:hover:text-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { getSession } from "next-auth/react";
import clientPromise from "../../lib/mongodb";

export async function getServerSideProps(context) {
  const fetchPage = async (page) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}&page=${page}`
    );
    const data = await res.json();
    return data.results || [];
  };

  const [page1, page2, page3] = await Promise.all([
    fetchPage(1),
    fetchPage(2),
    fetchPage(3),
  ]);

  let userWatchlist = [];
  const session = await getSession(context);
  if (session) {
    const client = await clientPromise;
    const db = client.db("movieNext");
    userWatchlist = await db.collection("watchlist")
      .find({ email: session.user.email })
      .project({ movieName: 1, _id: 0 })
      .toArray();
  }

  return {
    props: {
      initialShows: [...page1, ...page2, ...page3],
      initialWatchlist: JSON.parse(JSON.stringify(userWatchlist)),
    },
  };
}
