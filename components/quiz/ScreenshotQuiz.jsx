import { useState, useEffect } from "react";
import DashboardLayout from "../DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineReload, AiOutlineLoading3Quarters } from "react-icons/ai";

const TMDB_BACKDROP = "https://image.tmdb.org/t/p/original";

const ScreenshotQuiz = ({ movies }) => {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const maxRounds = 5;

  const generateRound = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setImageLoaded(false);

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
      <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
        <div className="relative z-10 w-full max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard/quiz" className="flex items-center gap-2 text-stone-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
              <AiOutlineArrowLeft /> Back to Quizzes
            </Link>
            <div className="bg-white dark:bg-stone-800 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm transition-colors duration-300">
              <span className="text-stone-500 dark:text-gray-400 font-medium mr-2">Score:</span>
              <span className="text-blue-600 dark:text-blue-500 font-bold text-lg">{score} / {maxRounds}</span>
            </div>
          </div>

          {!gameOver && currentMovie ? (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up transition-colors duration-300">
              <div className="relative w-full h-64 md:h-[400px] bg-stone-100 dark:bg-stone-900">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
                  </div>
                )}
                <Image 
                  key={currentMovie.id}
                  src={TMDB_BACKDROP + currentMovie.backdrop_path} 
                  alt="Guess the movie" 
                  fill 
                  className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-blue-200/40 dark:from-stone-900 to-transparent transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Round {round} of {maxRounds}
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 text-center">Which movie is this?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!imageLoaded ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-xl border-2 border-transparent bg-stone-100 dark:bg-stone-700/50 animate-pulse h-[68px]" />
                    ))
                  ) : (
                    options.map((opt) => {
                      let btnClass = "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 dark:border-stone-600 dark:text-white";
                      let Icon = null;

                      if (selectedAnswer) {
                        if (opt.id === currentMovie.id) {
                          btnClass = "bg-green-600 border-green-500 text-white"; // Correct answer is always green
                          Icon = AiOutlineCheckCircle;
                        } else if (selectedAnswer.id === opt.id) {
                          btnClass = "bg-red-600 border-red-500 text-white"; // Wrong picked answer is red
                          Icon = AiOutlineCloseCircle;
                        } else {
                          btnClass = "bg-stone-50 border-stone-100 text-stone-400 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-500 opacity-50"; // Others fade out
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
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-12 text-center shadow-2xl animate-fade-in-up transition-colors duration-300">
              <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-4">Quiz Complete!</h2>
              <p className="text-stone-600 dark:text-gray-400 text-xl mb-8">You scored <span className="text-blue-600 dark:text-blue-500 font-bold text-2xl">{score}</span> out of {maxRounds}</p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={restart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 text-lg shadow-lg shadow-blue-600/30 dark:shadow-blue-900/50"
                >
                  <AiOutlineReload /> Play Again
                </button>
                <Link 
                  href="/dashboard/quiz"
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 dark:text-white px-8 py-4 rounded-xl font-bold transition-colors text-lg"
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
