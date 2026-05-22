import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowRight, FiPlayCircle, FiStar } from "react-icons/fi";
import { MdMovieFilter } from "react-icons/md";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Banner() {
  const { data: session } = useSession();
  const { resolvedTheme } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    if (resolvedTheme != null) {
      setThemeLoaded(true);
    }
  }, [resolvedTheme]);

  if (!themeLoaded) return null;

  return (
    <div className="relative w-full overflow-hidden bg-black min-h-[100vh] flex items-center justify-center pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/40 via-black to-black z-10 dark:from-rose-900/40 dark:via-stone-950 dark:to-stone-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent z-10"></div>
        <Image
          src="https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg"
          alt="Cinematic Background"
          fill
          unoptimized
          className="object-cover opacity-40 dark:opacity-30 scale-105 animate-pulse-slow"
        />
        {/* Abstract floating orbs */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-rose-600/30 rounded-full blur-[120px] mix-blend-screen animate-blob z-20"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000 z-20"></div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content Area */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/50 border border-white/20 backdrop-blur-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-white font-bold tracking-wide text-sm uppercase">Next Generation Streaming</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Unlock The <br />
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-rose-600 to-orange-500 blur-2xl opacity-50"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                Cinematic
              </span>
            </span> <br /> Universe.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 dark:text-stone-400 mb-10 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Immerse yourself in a beautifully crafted dashboard. Track movies, explore personalized AI recommendations, and curate your ultimate watchlist.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            {!session ? (
              <>
                <Link href="/signup" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-extrabold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.8)] overflow-hidden">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative">Start Your Journey</span>
                  <FiArrowRight className="relative group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg backdrop-blur-xl transition-all border border-white/20 hover:border-white/40">
                  <FiPlayCircle className="text-xl text-rose-400 group-hover:scale-110 transition-transform" />
                  Sign In
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-10 py-4 rounded-full font-extrabold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(225,29,72,0.8)]">
                <span className="relative">Enter Dashboard</span>
                <FiArrowRight className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Side 3D Visual Collage */}
        <div className="hidden lg:block relative h-[600px] w-full [perspective:1000px] animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d] [transform:rotateY(-10deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-transform duration-700 ease-out">
            
            {/* Main Poster */}
            <div className="absolute z-30 w-64 h-96 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden bg-stone-900 [transform:translateZ(50px)] hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <Image src="https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg" className="object-cover" fill unoptimized alt="Movie Poster" />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="flex text-yellow-400 text-sm mb-1">
                  <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                </div>
                <p className="text-white font-bold text-lg">Deadpool & Wolverine</p>
              </div>
            </div>

            {/* Poster Behind Left */}
            <div className="absolute z-20 w-56 h-80 rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-stone-900 [transform:translateX(-120px)_translateY(-40px)_translateZ(-50px)_rotate(-5deg)] opacity-80 blur-[2px] hover:blur-none hover:opacity-100 transition-all duration-500">
              <Image src="https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg" className="object-cover" fill unoptimized alt="Movie Poster" />
            </div>

            {/* Poster Behind Right */}
            <div className="absolute z-10 w-56 h-80 rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-stone-900 [transform:translateX(120px)_translateY(40px)_translateZ(-100px)_rotate(5deg)] opacity-60 blur-[3px] hover:blur-none hover:opacity-100 hover:z-40 transition-all duration-500">
              <Image src="https://image.tmdb.org/t/p/w500/m2zXTuNPkywu4HUNO9B3zC9sCS.jpg" className="object-cover" fill unoptimized alt="Movie Poster" />
            </div>

            {/* Floating Glass Data Card */}
            <div className="absolute z-40 bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-2xl [transform:translateZ(100px)] hover:scale-110 transition-transform duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  98%
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm">Match Score</p>
                  <p className="text-stone-300 text-xs">AI Prediction</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
