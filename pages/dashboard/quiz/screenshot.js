import { useState, useEffect } from "react";
import DashboardLayout from "../DashboardLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineReload } from "react-icons/ai";

const TMDB_BACKDROP = "https://image.tmdb.org/t/p/original";

const ScreenshotQuiz = ({ movies }) => {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const maxRounds = 5;

  const generateRound = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (round > maxRounds) {
      setGameOver(true);
      return;
    }

    // Pick a random target movie
    const availableMovies = movies.filter(m => m.backdrop_path);
    const target = availableMovies[Math.floor(Math.random() * availableMovies.length)];

    // Pick 3 other random titles for options
    const others = [];
    while (others.length < 3) {
      const rnd = availableMovies[Math.floor(Math.random() * availableMovies.length)];
      if (rnd.id !== target.id && !others.find(o => o.id === rnd.id)) {
        others.push(rnd);
      }
    }

    const roundOptions = [...others, target].sort(() => Math.random() - 0.5);
    
    setCurrentMovie(target);
    setOptions(roundOptions);
  };

  useEffect(() => {
    if (movies && movies.length > 0) {
      generateRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (option) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(option);

    const correct = option.id === currentMovie.id;
    setIsCorrect(correct);

    if (correct) setScore(score + 1);

    setTimeout(() => {
      setRound(prev => prev + 1);
    }, 1500); // Wait 1.5s before next round
  };

  useEffect(() => {
    if (round > 1 && round <= maxRounds + 1 && !gameOver) {
      generateRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const restart = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
  };

  if (!movies || movies.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Failed to load movies.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-stone-900">
        <div className="relative z-10 w-full max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard/quiz" className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
              <AiOutlineArrowLeft /> Back to Quizzes
            </Link>
            <div className="bg-stone-800 px-4 py-2 rounded-full border border-stone-700">
              <span className="text-gray-400 font-medium mr-2">Score:</span>
              <span className="text-blue-500 font-bold text-lg">{score} / {maxRounds}</span>
            </div>
          </div>

          {!gameOver && currentMovie ? (
            <div className="bg-stone-800 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="relative w-full h-64 md:h-[400px]">
                <Image 
                  src={TMDB_BACKDROP + currentMovie.backdrop_path} 
                  alt="Guess the movie" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Round {round} of {maxRounds}
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Which movie is this?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.map((opt) => {
                    let btnClass = "bg-stone-700 hover:bg-stone-600 border-stone-600 text-white";
                    let Icon = null;

                    if (selectedAnswer) {
                      if (opt.id === currentMovie.id) {
                        btnClass = "bg-green-600 border-green-500 text-white"; // Correct answer is always green
                        Icon = AiOutlineCheckCircle;
                      } else if (selectedAnswer.id === opt.id) {
                        btnClass = "bg-red-600 border-red-500 text-white"; // Wrong picked answer is red
                        Icon = AiOutlineCloseCircle;
                      } else {
                        btnClass = "bg-stone-800 border-stone-700 text-stone-500 opacity-50"; // Others fade out
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt)}
                        disabled={!!selectedAnswer}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 font-semibold text-lg flex items-center justify-between ${btnClass}`}
                      >
                        {opt.title}
                        {Icon && <Icon className="text-2xl animate-bounce" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-800 border border-stone-700 rounded-3xl p-12 text-center shadow-2xl animate-fade-in-up">
              <h2 className="text-4xl font-black text-white mb-4">Quiz Complete!</h2>
              <p className="text-gray-400 text-xl mb-8">You scored <span className="text-blue-500 font-bold text-2xl">{score}</span> out of {maxRounds}</p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={restart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 text-lg shadow-lg shadow-blue-900/50"
                >
                  <AiOutlineReload /> Play Again
                </button>
                <Link 
                  href="/dashboard/quiz"
                  className="bg-stone-700 hover:bg-stone-600 text-white px-8 py-4 rounded-xl font-bold transition-colors text-lg"
                >
                  More Quizzes
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScreenshotQuiz;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  try {
    const TMDB_KEY = process.env.API_KEY;
    // Fetch 2 pages of popular movies to get a good pool (40 movies)
    const [res1, res2] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=1`),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=2`)
    ]);
    
    const data1 = await res1.json();
    const data2 = await res2.json();

    const movies = [...(data1.results || []), ...(data2.results || [])].filter(m => m.backdrop_path);

    return {
      props: { movies },
    };
  } catch (err) {
    console.error("Screenshot quiz error:", err);
    return { props: { movies: [] } };
  }
}
