import { FiSearch, FiX, FiMic } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function HeroHeader({
  type = "movies",
  categories,
  activeCategory,
  onCategoryChange,
  titleSuffix,
  itemCount,
  searchQuery,
  onSearchChange,
  onSearchClear,
  onVoiceSearchComplete,
}) {
  const [isListening, setIsListening] = useState(false);
  const isMovies = type === "movies";

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange({ target: { value: transcript } }); 

      if (onVoiceSearchComplete) {
        onVoiceSearchComplete(transcript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error !== 'aborted') {
        toast.error("Voice search failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Theme configuration based on type
  const theme = {
    orb1: isMovies ? "bg-rose-500/10 dark:bg-rose-600/20" : "bg-rose-500/10 dark:bg-rose-600/20",
    orb2: isMovies ? "bg-orange-500/10 dark:bg-orange-600/15" : "bg-pink-500/10 dark:bg-pink-600/15",
    activeTab: isMovies ? "from-rose-600 to-orange-500 shadow-rose-500/30" : "from-rose-600 to-pink-500 shadow-rose-500/30",
    headingPopular: isMovies ? "from-rose-500 to-orange-400" : "from-rose-500 to-pink-400",
    headingTopRated: isMovies ? "bg-gradient-to-r from-yellow-500 to-orange-400" : "bg-gradient-to-l from-rose-500 to-pink-400",
    inputFocus: isMovies ? "focus:border-rose-500 focus:ring-rose-500/20" : "focus:border-violet-500 focus:ring-violet-500/20",
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-stone-900 pt-28 pb-16 border-b border-gray-100 dark:border-stone-800">
      {/* Background glow orbs */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${theme.orb1}`} />
      <div className={`absolute top-10 right-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none ${theme.orb2}`} />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Category Toggle Tabs */}
        <div className="inline-flex items-center bg-gray-100 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl p-1.5 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  active
                    ? `bg-gradient-to-r text-white shadow-lg ${theme.activeTab}`
                    : "text-gray-500 hover:text-gray-900 dark:text-stone-400 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-none">
          {activeCategory === "ai_search" ? (
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">AI Matches</span>{" "}
            </>
          ) : activeCategory === "popular" ? (
            <>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.headingPopular}`}>Popular</span>{" "}
              {titleSuffix}
            </>
          ) : (
            <>
              <span className={`text-transparent bg-clip-text ${theme.headingTopRated}`}>Top Rated</span>{" "}
              {titleSuffix}
            </>
          )}
        </h1>
        <p className="text-gray-400 dark:text-stone-400 text-lg mb-10">
          {activeCategory === "ai_search" ? "Powered by Voice AI" : categories.find((c) => c.value === activeCategory)?.desc} · {itemCount} titles
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto group">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by title or year…"
            className={`w-full pl-14 pr-24 py-4 bg-white dark:bg-white/10 dark:backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-400 focus:outline-none focus:ring-2 transition-all text-sm font-medium shadow-sm ${theme.inputFocus}`}
          />
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-stone-200 group-focus-within:!text-violet-500 dark:group-focus-within:!text-violet-400 transition-colors" />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={onSearchClear}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:text-stone-400 dark:hover:text-white transition-colors"
                title="Clear Search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={startVoiceSearch}
              className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-gray-100 dark:bg-stone-800/50 text-gray-500 hover:bg-gray-200 dark:hover:bg-stone-700 dark:text-stone-300'}`}
              title="Voice Search (AI)"
            >
              <FiMic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
