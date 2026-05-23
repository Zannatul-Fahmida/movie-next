import { useState, useEffect } from "react";
import DashboardLayout from "../DashboardLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineReload } from "react-icons/ai";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

const GenreChallenge = ({ movies, genres }) => {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctGenre, setCorrectGenre] = useState(null);

  const maxRounds = 5;

  const generateRound = () => {
    setSelectedAnswer(null);
    setCorrectGenre(null);

    if (round > maxRounds) {
      setGameOver(true);
      return;
    }

    // Pick a random target movie
    const availableMovies = movies.filter(m => m.poster_path && m.genre_ids && m.genre_ids.length > 0);
    const target = availableMovies[Math.floor(Math.random() * availableMovies.length)];
    
    // Get its primary genre
    const primaryGenreId = target.genre_ids[0];
    const targetGenre = genres.find(g => g.id === primaryGenreId);

    // Pick 3 other random genres
    const others = [];
    while (others.length < 3) {
      const rnd = genres[Math.floor(Math.random() * genres.length)];
      if (rnd.id !== targetGenre.id && !others.find(o => o.id === rnd.id)) {
        others.push(rnd);
      }
    }

    const roundOptions = [...others, targetGenre].sort(() => Math.random() - 0.5);
    
    setCurrentMovie(target);
    setCorrectGenre(targetGenre);
    setOptions(roundOptions);
  };

  useEffect(() => {
    if (movies && genres && movies.length > 0) {
      generateRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (option) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(option);

    const correct = option.id === correctGenre.id;

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
        <div className="p-10 text-center">Failed to load movies or genres.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-emerald-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-600/30 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teal-600/30 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard/quiz" className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors">
              <AiOutlineArrowLeft /> Back to Quizzes
            </Link>
            <div className="bg-emerald-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-700/50">
              <span className="text-emerald-300 font-medium mr-2">Score:</span>
              <span className="text-white font-bold text-lg">{score} / {maxRounds}</span>
            </div>
          </div>

          {!gameOver && currentMovie ? (
            <div className="bg-emerald-900/40 backdrop-blur-xl border border-emerald-700/50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-96 md:h-auto bg-black flex items-center justify-center p-8">
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 shadow-md">
                  Round {round} of {maxRounds}
                </div>
                {/* Poster */}
                <div className="relative w-full max-w-[240px] aspect-[2/3] shadow-2xl rounded-xl overflow-hidden group">
                  <Image 
                    src={TMDB_IMAGE + currentMovie.poster_path} 
                    alt="Guess the genre" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Overlay to blur title slightly or just look cool */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-8">What is the primary genre?</h2>
                <div className="flex flex-col gap-4">
                  {options.map((opt) => {
                    let btnClass = "bg-emerald-950 hover:bg-emerald-800 border-emerald-800/50 text-emerald-100";
                    let Icon = null;

                    if (selectedAnswer) {
                      if (opt.id === correctGenre.id) {
                        btnClass = "bg-green-600 border-green-500 text-white"; // Correct
                        Icon = AiOutlineCheckCircle;
                      } else if (selectedAnswer.id === opt.id) {
                        btnClass = "bg-red-600 border-red-500 text-white"; // Wrong
                        Icon = AiOutlineCloseCircle;
                      } else {
                        btnClass = "bg-emerald-950 border-emerald-900 text-emerald-700 opacity-50"; // Fade
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt)}
                        disabled={!!selectedAnswer}
                        className={`p-5 rounded-2xl border-2 transition-all duration-300 font-semibold text-lg flex items-center justify-between ${btnClass}`}
                      >
                        {opt.name}
                        {Icon && <Icon className="text-2xl animate-bounce" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-900/40 backdrop-blur-xl border border-emerald-700/50 rounded-3xl p-12 text-center shadow-2xl animate-fade-in-up">
              <h2 className="text-4xl font-black text-white mb-4">Challenge Complete!</h2>
              <p className="text-emerald-200 text-xl mb-8">You scored <span className="text-white font-bold text-3xl mx-2">{score}</span> out of {maxRounds}</p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={restart}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 text-lg shadow-lg shadow-emerald-900/50"
                >
                  <AiOutlineReload /> Play Again
                </button>
                <Link 
                  href="/dashboard/quiz"
                  className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-100 px-8 py-4 rounded-xl font-bold transition-colors text-lg"
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

export default GenreChallenge;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  try {
    const TMDB_KEY = process.env.API_KEY;
    
    // Fetch genres and movies
    const [genresRes, moviesRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=${Math.floor(Math.random() * 5) + 1}`) // random page 1-5 for variety
    ]);
    
    const genresData = await genresRes.json();
    const moviesData = await moviesRes.json();

    const genres = genresData.genres || [];
    const movies = (moviesData.results || []).filter(m => m.poster_path && m.genre_ids?.length > 0);

    return {
      props: { genres, movies },
    };
  } catch (err) {
    console.error("Genre challenge error:", err);
    return { props: { genres: [], movies: [] } };
  }
}
