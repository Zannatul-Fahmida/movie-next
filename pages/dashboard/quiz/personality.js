import { useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowRight, AiOutlineLoading3Quarters, AiOutlineReload, AiOutlineArrowLeft } from "react-icons/ai";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP = "https://image.tmdb.org/t/p/original";

const QUESTIONS = [
  {
    id: 1,
    question: "What's your ideal Friday night?",
    options: [
      "Exploring the city with friends",
      "Cozying up at home with takeout",
      "Going to a loud, chaotic party",
      "Working on a passion project or reading",
    ],
  },
  {
    id: 2,
    question: "If you had to face a conflict, how do you handle it?",
    options: [
      "Charge in headfirst, ask questions later",
      "Use my intellect to outsmart the opponent",
      "Try to mediate and find peace",
      "Run away or hide until it blows over",
    ],
  },
  {
    id: 3,
    question: "Choose a setting that speaks to you:",
    options: [
      "A neon-lit cyberpunk metropolis",
      "A quiet, sun-drenched coastal town",
      "A dark, mysterious forest",
      "A bustling, historic European city",
    ],
  },
  {
    id: 4,
    question: "What's your biggest flaw?",
    options: [
      "I'm too trusting of others",
      "I let my anger get the best of me",
      "I overthink absolutely everything",
      "I struggle to commit to anything",
    ],
  },
  {
    id: 5,
    question: "Pick an object to take on an adventure:",
    options: [
      "A trusty old acoustic guitar",
      "A high-tech multi-tool",
      "A mysterious glowing amulet",
      "A loaded revolver",
    ],
  },
];

const PersonalityQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);

  const handleOptionSelect = (optionText) => {
    const newAnswers = [
      ...answers,
      { question: QUESTIONS[currentStep].question, answer: optionText },
    ];
    
    if (currentStep < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      // Finished
      setAnswers(newAnswers);
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to find match");
      
      setMatch(data.match);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setMatch(null);
    setError(null);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated BG */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard/quiz" className="flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors">
              <AiOutlineArrowLeft /> Back to Quizzes
            </Link>
          </div>

          {!loading && !match && !error && (
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
              <div className="mb-8 flex justify-between items-center">
                <span className="text-sm font-bold text-rose-500 tracking-widest uppercase">
                  Question {currentStep + 1} of {QUESTIONS.length}
                </span>
                <div className="flex gap-1">
                  {QUESTIONS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i <= currentStep ? 'bg-rose-500' : 'bg-gray-200 dark:bg-stone-700'}`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                {QUESTIONS[currentStep].question}
              </h2>

              <div className="flex flex-col gap-4">
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-rose-50 dark:bg-stone-800 dark:hover:bg-stone-700/50 hover:border-rose-400 dark:hover:border-rose-500 transition-all duration-300 text-gray-800 dark:text-gray-200 font-medium text-lg flex items-center justify-between group"
                  >
                    {opt}
                    <AiOutlineArrowRight className="text-rose-500 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in-up">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-rose-200 dark:border-rose-900/50 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-rose-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Your Vibe...</h3>
              <p className="text-gray-500 dark:text-gray-400">Consulting the cinematic universe to find your perfect match.</p>
            </div>
          )}

          {error && (
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <p className="text-red-500 mb-6">{error}</p>
              <button onClick={resetQuiz} className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700">Try Again</button>
            </div>
          )}

          {!loading && match && (
            <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
              {match.backdrop_path ? (
                <div className="relative w-full h-64 md:h-80">
                  <Image src={TMDB_BACKDROP + match.backdrop_path} alt={match.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                    <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">Your Movie Match</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{match.title} <span className="text-2xl text-gray-300 font-medium">({match.year})</span></h2>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-gradient-to-r from-rose-600 to-orange-500">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">Your Movie Match</span>
                  <h2 className="text-4xl font-black text-white">{match.title} ({match.year})</h2>
                </div>
              )}

              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 relative z-10">
                {match.poster_path && (
                  <div className="shrink-0 hidden md:block relative w-40 h-60 rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-900 bg-stone-800">
                    <Image src={TMDB_IMAGE + match.poster_path} alt={match.title} fill className="object-cover" sizes="(max-width: 768px) 0vw, 160px" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why this matches you:</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 italic border-l-4 border-rose-500 pl-4 py-1">
                    "{match.reason}"
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    {match.tmdbId && (
                      <a 
                        href={`https://www.themoviedb.org/${match.media_type === 'tv' ? 'tv' : 'movie'}/${match.tmdbId}`}
                        target="_blank" rel="noopener noreferrer"
                        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                      >
                        View on TMDB
                      </a>
                    )}
                    <button 
                      onClick={resetQuiz}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                      <AiOutlineReload /> Take Quiz Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </DashboardLayout>
  );
};

export default PersonalityQuiz;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  return { props: {} };
}
