import { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { AiOutlineSmile, AiOutlineSend, AiOutlineLoading3Quarters } from "react-icons/ai";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

const MoodDetector = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const res = await fetch("/api/ai/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen p-6 md:p-10 flex flex-col items-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-rose-500/20 dark:bg-rose-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-violet-500/20 dark:bg-violet-600/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-400 rounded-2xl shadow-lg">
              <AiOutlineSmile className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-500 text-center mb-4">
            AI Mood Matcher
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg max-w-2xl mb-10">
            Tell me how you&apos;re feeling or what you&apos;re craving. 
            <br className="hidden md:block"/> &quot;I&apos;m heartbroken,&quot; &quot;Need a mind-bending sci-fi,&quot; or &quot;Just want to laugh.&quot;
          </p>

          {/* Input Area (Glassmorphism) */}
          <form 
            onSubmit={handleSubmit}
            className="w-full relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-2 rounded-2xl shadow-2xl">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="How are you feeling today?"
                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white p-4 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
                ) : (
                  <AiOutlineSend className="text-2xl" />
                )}
              </button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-20 flex flex-col items-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-rose-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-rose-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-6 text-rose-600 dark:text-rose-400 font-medium animate-pulse">
                Analyzing your mood...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-10 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Recommendations Grid */}
          {!loading && recommendations.length > 0 && (
            <div className="mt-16 w-full animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pl-2 border-l-4 border-rose-500">
                Perfect matches for your mood
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.tmdbId || index}
                    className="group relative rounded-2xl overflow-hidden bg-white/50 dark:bg-stone-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden">
                      {rec.poster_path ? (
                        <Image
                          src={TMDB_IMAGE + rec.poster_path}
                          alt={rec.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                          <span className="text-stone-400">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {rec.genre && (
                        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                          {rec.genre}
                        </span>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-lg text-white leading-tight mb-1 drop-shadow-md">
                          {rec.title}
                        </h3>
                        <p className="text-xs text-gray-300 mb-2 font-medium">
                          {rec.year}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-stone-900/80">
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                        &quot;{rec.reason}&quot;
                      </p>
                    </div>

                    {rec.tmdbId && (
                      <a
                        href={`https://www.themoviedb.org/${rec.media_type === "tv" ? "tv" : "movie"}/${rec.tmdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-20"
                        aria-label={`View ${rec.title} on TMDB`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Global styles for animations if not in tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </DashboardLayout>
  );
};

export default MoodDetector;

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

  return {
    props: {},
  };
}
