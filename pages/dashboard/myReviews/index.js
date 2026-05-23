import DashboardLayout from "../../../components/DashboardLayout";
import { getSession } from "next-auth/react";
import clientPromise from "../../../lib/mongodb";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { FiTrash2, FiMessageSquare } from "react-icons/fi";

const MyReviews = ({ initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch("/api/review", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete review");

      toast.success("Review removed successfully");
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <Toaster />

        {/* ── Header ── */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-2">
            <div className="shrink-0 w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              <FiMessageSquare className="size-8" />
            </div>
            <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              My Reviews
            </h1>
            
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Manage your personal thoughts and ratings on movies and shows.
          </p>
          </div>
          </div>
        </div>

        {/* ── Reviews Grid ── */}
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm animate-in fade-in duration-700">
            <FiMessageSquare className="w-16 h-16 text-gray-300 dark:text-stone-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No reviews yet</h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              You haven&apos;t written any reviews. Go to your watchlist to start reviewing!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="group flex flex-col bg-white dark:bg-stone-900 rounded-3xl p-6 border border-gray-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 pr-8">
                    {review.movieName}
                  </h3>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={deletingId === review._id}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors disabled:opacity-50"
                    title="Delete Review"
                  >
                    {deletingId === review._id ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Stars Rating */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-200 dark:text-stone-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Description snippet */}
                <div className="flex-1 mb-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed line-clamp-4 relative">
                    <span className="text-3xl text-gray-200 dark:text-stone-700 absolute -top-3 -left-2 select-none">&quot;</span>
                    &nbsp;&nbsp;&nbsp;{review.description}
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-gray-100 dark:border-stone-800 flex justify-between items-center text-xs font-medium text-gray-400 dark:text-stone-500">
                  <span>
                    {new Date(review.created).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    {new Date(review.created).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyReviews;

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
  const reviews = await db
    .collection("reviews")
    .find({ email: session.user.email })
    .sort({ created: -1 })
    .toArray();

  return {
    props: {
      initialReviews: JSON.parse(JSON.stringify(reviews)),
    },
  };
}
