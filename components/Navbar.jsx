import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const handleNav = () => {
    menu.classList.toggle("hidden");
  };
  return (
    <header>
      <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg text-gray-700 bg-white dark:bg-zinc-900">
        <div>
          <Link className="font-bold dark:text-white" href="/">
            Movie<span className="text-rose-700">Next</span>
          </Link>
        </div>
        <button
          className="h-6 w-6 cursor-pointer md:hidden block dark:text-white"
          onClick={handleNav}
        >
          <FiMenu />
        </button>

        <div
          className="hidden w-full md:flex md:items-center md:w-auto"
          id="menu"
        >
          <ul className="pt-4 text-base text-gray-700 md:flex md:justify-between md:items-center md:pt-0 dark:text-white">
            <li>
              <Link
                className={
                  pathname === "/popularMovies"
                    ? "md:p-4 py-2 block text-rose-600"
                    : "md:p-4 py-2 block hover:text-rose-600"
                }
                href="/popularMovies"
              >
                Popular Movies
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/topRatedMovies"
                    ? "md:p-4 py-2 block text-rose-600"
                    : "md:p-4 py-2 block hover:text-rose-600"
                }
                href="/topRatedMovies"
              >
                Top rated Movies
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/popularShows"
                    ? "md:p-4 py-2 block text-rose-600"
                    : "md:p-4 py-2 block hover:text-rose-600"
                }
                href="/popularShows"
              >
                Popular Shows
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/topRatedShows"
                    ? "md:p-4 py-2 block text-rose-600"
                    : "md:p-4 py-2 block hover:text-rose-600"
                }
                href="/topRatedShows"
              >
                Top rated Shows
              </Link>
            </li>
            {!session && (
              <li>
                <Link
                  className="md:p-4 py-2 block hover:text-rose-600 text-rose-700"
                  href="/signup"
                >
                  Sign Up
                </Link>
              </li>
            )}
            {session && (
              <li className="md:px-4 py-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex justify-center rounded-full border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-rose-500"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={
                      session.user.image ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="profile picture"
                  />
                </button>
                {isOpen ? (
                  <div className="origin-top-right absolute md:right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 block hover:text-rose-600 text-rose-700 text-sm hover:bg-gray-100"
                        onClick={signOut}
                        role="menuitem"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <BsMoonFill className="text-white w-5 h-5" />
              ) : (
                <BsSunFill className="text-yellow-500 w-5 h-5" />
              )}
            </button>
          </ul>
        </div>
      </nav>
    </header>
  );
}
