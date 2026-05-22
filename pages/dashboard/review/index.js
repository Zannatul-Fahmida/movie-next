import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import DashboardLayout from "../DashboardLayout";
import { toast, Toaster } from "react-hot-toast";
import { FiFilm, FiAlignLeft, FiSend, FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const Review = () => {
  const router = useRouter();
  const { movieName } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      movieName: "",
    },
  });

  useEffect(() => {
    if (movieName) {
      setValue("movieName", movieName, { shouldValidate: true });
    }
  }, [movieName, setValue]);

  const ratingValue = watch("rating");
  const [hoverRating, setHoverRating] = useState(0);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      
      if (!res.ok) throw new Error("Failed to submit review");

      reset({ rating: 0, movieName: "", description: "" });
      toast.success("Review published successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto w-full">
        <Toaster />

        {/* Header */}
        <div className="mb-10 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 shadow-sm">
            <FiStar className="w-8 h-8" />
          </div>
          <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Write a Review
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Share your thoughts and rate a movie or TV show.
          </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-gray-100 dark:border-stone-800 p-6 md:p-10 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-700 via-rose-500 to-orange-400"></div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Movie Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Movie / TV Show Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                  <FiFilm className="w-5 h-5" />
                </div>
                <input
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                  placeholder="e.g. Inception, Breaking Bad..."
                  type="text"
                  {...register("movieName", { required: true })}
                />
              </div>
              {errors.movieName && (
                <span className="text-xs text-red-500 mt-2 block font-medium">
                  Please enter a title
                </span>
              )}
            </div>

            {/* Interactive Star Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                  >
                    <FaStar
                      className={`w-10 h-10 ${
                        star <= (hoverRating || ratingValue)
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-gray-200 dark:text-stone-700"
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
              </div>
              <input
                type="hidden"
                {...register("rating", { required: true, min: 1 })}
              />
              {errors.rating && (
                <span className="text-xs text-red-500 mt-2 block font-medium">
                  Please select a rating
                </span>
              )}
            </div>

            {/* Review Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Review Details
              </label>
              <div className="relative group">
                <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                  <FiAlignLeft className="w-5 h-5" />
                </div>
                <textarea
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm resize-none"
                  placeholder="What did you think about it?"
                  rows="4"
                  {...register("description")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                         className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <FiSend className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    Publish Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Review;
