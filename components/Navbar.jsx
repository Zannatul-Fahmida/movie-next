import Link from "next/link";
import { FiMenu, FiX, FiLogOut, FiLayout, FiUser } from "react-icons/fi";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { MdMovieFilter } from "react-icons/md";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (resolvedTheme != null) setThemeLoaded(true);
  }, [resolvedTheme]);

  useEffect(() => {
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!themeLoaded) return null;

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup")
  ) {
    return null;
  }

  const NAV_LINKS = [
    { name: "Movies", href: "/movies" },
    { name: "Shows", href: "/shows" },
  ];

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  return (
    <header
      className={`fixed left-0 right-0 z-50 flex justify-center w-full pointer-events-none transition-all duration-500 ${
        scrolled ? "top-4" : "top-6"
      }`}
    >
      <div
        className={`pointer-events-auto w-full max-w-6xl mx-4 rounded-full backdrop-blur-2xl border transition-all duration-500 flex justify-between items-center ${
          !isTransparent
            ? "bg-white/70 dark:bg-stone-900/70 border-gray-200/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-6 py-3"
            : "bg-transparent border-transparent px-2 py-4"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
            <MdMovieFilter className="text-rose-600 dark:text-rose-500 text-3xl md:text-4xl relative z-10 transition-transform duration-300" />
          <span className={`font-extrabold text-2xl tracking-tight transition-colors duration-300 ${!isTransparent ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
            Movie<span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">Next</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex items-center gap-2 p-1 rounded-full border transition-colors duration-300 ${!isTransparent ? 'bg-gray-100/50 dark:bg-white/5 border-gray-200/50 dark:border-white/5' : 'bg-white/10 border-white/10'}`}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-md"
                    : !isTransparent 
                      ? "text-gray-600 hover:text-gray-900 dark:text-stone-300 dark:hover:text-white"
                      : "text-gray-200 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 rounded-full -z-10"></span>
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              !isTransparent
                ? "bg-gray-100/80 dark:bg-stone-800/80 text-gray-600 dark:text-stone-300"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            aria-label="Toggle Dark Mode"
          >
            {resolvedTheme === "dark" ? (
              <BsMoonStarsFill className="w-4 h-4 text-rose-300" />
            ) : (
              <BsSunFill className="w-4 h-4 text-orange-400" />
            )}
          </button>

          {/* Auth Area */}
          {!session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                  !isTransparent
                    ? "text-gray-700 hover:bg-gray-100 dark:text-stone-200 dark:hover:bg-stone-800"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="relative group overflow-hidden rounded-full p-[1px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity"></span>
                <div className="relative bg-white dark:bg-stone-950 rounded-full px-6 py-2.5 transition-all">
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-500">
                    Get Started
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all duration-300 ${
                  !isTransparent
                    ? "bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 hover:border-rose-400 shadow-sm text-gray-900 dark:text-white"
                    : "bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white"
                }`}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-rose-500/50">
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-bold truncate max-w-[100px]">
                  {session.user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white/90 dark:bg-stone-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-stone-700/50 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
                  {/* <div className="px-5 py-4 border-b border-gray-100 dark:border-stone-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-stone-500 mb-1">Account</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">
                      {session.user.email}
                    </p>
                  </div> */}
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className="group flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-stone-300 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <FiLayout className="text-lg opacity-50 group-hover:opacity-100" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="group flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-stone-300 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <FiUser className="text-lg opacity-50 group-hover:opacity-100" />
                      Profile
                    </Link>
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-stone-800">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="group w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FiLogOut className="text-lg opacity-50 group-hover:opacity-100" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${!isTransparent ? 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300' : 'bg-white/10 text-white'}`}
          >
            {resolvedTheme === "dark" ? <BsMoonStarsFill /> : <BsSunFill />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${!isTransparent ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-stone-800' : 'text-white bg-white/10'}`}
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto absolute top-24 left-4 right-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-3xl border border-gray-200/50 dark:border-stone-800/50 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-top-8 duration-300">
          <div className="space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-5 py-4 rounded-2xl text-lg font-bold ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white"
                    : "text-gray-800 dark:text-stone-200 hover:bg-gray-50 dark:hover:bg-stone-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-stone-800">
            {!session ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full text-center py-4 rounded-2xl text-base font-bold text-gray-800 dark:text-stone-200 bg-gray-100 dark:bg-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-stone-800/50 rounded-2xl mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-rose-500">
                    <Image src={session.user.image} alt="Profile" fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-gray-900 dark:text-white">{session.user.name}</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-stone-400">{session.user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold text-gray-800 dark:text-stone-200 hover:bg-gray-50 dark:hover:bg-stone-800"
                >
                  <FiLayout className="text-rose-500" /> Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
