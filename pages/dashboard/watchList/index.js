import clientPromise from "../../../lib/mongodb";
import DashboardLayout from "../DashboardLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiBookmark, FiTrash2, FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const WatchList = ({ initialLists }) => {
  const router = useRouter();
  const [lists, setLists] = useState(initialLists);
  const [deletingId, setDeletingId] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(lists.length / ITEMS_PER_PAGE);

  useEffect(() => {
    // If items are deleted and current page is now out of bounds, go to last valid page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [lists.length, totalPages, currentPage]);

  const currentLists = lists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const imagePath = "https://image.tmdb.org/t/p/original";

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to remove from watchlist");

      toast.success("Movie removed from watchlist");
      setLists(lists.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleReviewClick = (movie) => {
    router.push(`/dashboard/review?movieName=${encodeURIComponent(movie.movieName)}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <Toaster />

        {/* ── Header ── */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <FiBookmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                My Watchlist
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Keep track of movies and shows you want to watch.
              </p>
            </div>
          </div>
        </div>

        {/* ── Watchlist Grid ── */}
        {lists?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm animate-in fade-in duration-700">
            <FiBookmark className="w-16 h-16 text-gray-300 dark:text-stone-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your watchlist is empty</h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              Discover popular movies and add them to your watchlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {currentLists.map((list) => (
              <div
                key={list._id}
                className="relative group aspect-[2/3] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-stone-900"
              >
                {/* Poster Image */}
                <Image
                  src={imagePath + list.poster}
                  alt={list.movieName}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Delete Button (Top Right) */}
                <button
                  onClick={() => handleDelete(list._id)}
                  disabled={deletingId === list._id}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white/80 hover:bg-red-600 hover:text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-100"
                  title="Remove from Watchlist"
                >
                  {deletingId === list._id ? (
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiTrash2 className="w-4 h-4" />
                  )}
                </button>

                {/* Movie Details (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">
                    {list.movieName}
                  </h3>
                  <p className="text-gray-300 text-xs font-medium mb-3 mt-1 drop-shadow-sm">
                    {list.releaseDate || "Unknown Release"}
                  </p>

                  {/* Review Action */}
                  <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                    {list.hasReviewed ? (
                      <div className="flex items-center justify-center gap-1.5 w-full bg-emerald-500/20 text-emerald-400 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm border border-emerald-500/30">
                        <FiCheckCircle className="w-4 h-4" /> Reviewed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReviewClick(list)}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-1"
                      >
                        Review Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12 pb-8 animate-in fade-in duration-500">
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
    </DashboardLayout>
  );
};

export default WatchList;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const client = await clientPromise;
  const db = client.db("movieNext");

  const lists = await db
    .collection("watchlist")
    .find({ email: session.user.email })
    .sort({ created: -1 })
    .toArray();
  const list = lists.map((list) => list);

  const reviews = await db
    .collection("reviews")
    .find({ email: session.user.email })
    .toArray();

  const updatedLists = lists.map((list) => {
    const reviewedMovie = reviews.find(
      (review) => review.movieName === list.movieName
    );
    return {
      ...list,
      hasReviewed: reviewedMovie ? true : false,
    };
  });

  return {
    props: {
      initialLists: JSON.parse(JSON.stringify(updatedLists)),
    },
  };
}
