import DashboardLayout from "../DashboardLayout";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { AiOutlineTrophy, AiOutlineUser, AiOutlineCamera, AiOutlinePlayCircle } from "react-icons/ai";

const QuizHub = () => {
  return (
    <DashboardLayout>
      <div className="relative min-h-screen p-6 md:p-10 flex flex-col">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-lg shadow-indigo-500/30">
              <AiOutlineTrophy className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Movie Quizzes
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">
            Test your knowledge and discover new movies through our interactive challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Game 1: Personality */}
            <Link href="/dashboard/quiz/personality" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative h-full bg-white dark:bg-stone-900 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center transform transition-transform duration-500 group-hover:-translate-y-2">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <AiOutlineUser className="text-4xl text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Personality Match
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 flex-1">
                  Answer a few fun questions and let our AI find the perfect movie that matches your vibe.
                </p>
                <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-6 py-2 rounded-full font-semibold group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300 w-full">
                  Start Quiz
                </div>
              </div>
            </Link>

            {/* Game 2: Screenshot */}
            <Link href="/dashboard/quiz/screenshot" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative h-full bg-white dark:bg-stone-900 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center transform transition-transform duration-500 group-hover:-translate-y-2">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <AiOutlineCamera className="text-4xl text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Guess the Movie
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 flex-1">
                  Can you identify famous movies just from a single, unbranded screenshot?
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-full font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 w-full">
                  Play Game
                </div>
              </div>
            </Link>

            {/* Game 3: Genre Challenge */}
            <Link href="/dashboard/quiz/genre" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative h-full bg-white dark:bg-stone-900 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center transform transition-transform duration-500 group-hover:-translate-y-2">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <AiOutlinePlayCircle className="text-4xl text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Genre Challenge
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 flex-1">
                  A rapid-fire test! Identify the correct genre for obscure and popular posters alike.
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-6 py-2 rounded-full font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 w-full">
                  Take Challenge
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizHub;

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
