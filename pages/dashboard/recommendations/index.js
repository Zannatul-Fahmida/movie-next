import { getSession } from "next-auth/react";
import DashboardLayout from "../../../components/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineRobot } from "react-icons/ai";
import { getRecommendations } from "../../../lib/recommendations";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

const RecommendationsPage = ({ recommendations, empty, error }) => {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <AiOutlineRobot className="text-rose-600 text-3xl" />
          <h2 className="text-2xl font-bold text-rose-700">AI Picks For You</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Powered by Google Gemini — based on your watchlist
        </p>

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AiOutlineRobot className="text-5xl text-rose-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">{error}</p>
          </div>
        )}

        {/* Empty watchlist state */}
        {!error && empty && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AiOutlineRobot className="text-6xl text-rose-200 mb-5" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Your watchlist is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Browse movies and add some to your watchlist first. The AI will then recommend
              titles tailored to your taste.
            </p>
            <Link
              href="/popularMovies"
              className="bg-rose-700 hover:bg-rose-800 transition-colors text-white px-6 py-2 rounded-md font-medium"
            >
              Browse Popular Movies
            </Link>
          </div>
        )}

        {/* Recommendations grid */}
        {!error && !empty && recommendations.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={rec.tmdbId || index}
                className="group relative rounded-xl overflow-hidden shadow-md bg-white dark:bg-stone-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  {rec.poster_path ? (
                    <Image
                      src={TMDB_IMAGE + rec.poster_path}
                      alt={rec.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      priority={index < 3}
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                      <AiOutlineRobot className="text-4xl text-stone-400" />
                    </div>
                  )}

                  {/* AI badge */}
                  <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    AI Pick
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2">
                    {rec.title}
                  </h3>
                  {rec.release_date && (
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(rec.release_date).getFullYear()}
                    </p>
                  )}
                  {/* Reason tooltip-style */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-3">
                    {rec.reason}
                  </p>
                </div>

                {/* TMDB link overlay */}
                {rec.tmdbId && (
                  <a
                    href={`https://www.themoviedb.org/${rec.media_type === "tv" ? "tv" : "movie"}/${rec.tmdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                    aria-label={`View ${rec.title} on TMDB`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Refresh hint */}
        {!error && !empty && recommendations.length > 0 && (
          <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-10">
            Recommendations refresh every time you visit this page.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Redirect unauthenticated users
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    // Call the logic directly — no internal HTTP round-trip
    const data = await getRecommendations(session.user.email);

    return {
      props: {
        recommendations: data.recommendations || [],
        empty: data.empty || false,
        error: null,
      },
    };
  } catch (err) {
    console.error("[recommendations page] getServerSideProps error:", err.message);

    // Surface a helpful message when the API key is missing
    const errorMsg = err.message?.includes("GROQ_API_KEY")
      ? "GROQ_API_KEY is not set in .env.local. Please add it and restart the dev server."
      : "Failed to load recommendations. Please try again."

    return {
      props: {
        recommendations: [],
        empty: false,
        error: errorMsg,
      },
    };
  }
}
