import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineStar,
  AiOutlineOrderedList,
  AiOutlineHeart,
  AiOutlineRobot,
} from "react-icons/ai";
import { MdMovieFilter } from "react-icons/md";

const NAV_ITEMS = [
  { href: "/dashboard",              label: "Overview",     icon: AiOutlineHome,        exact: true },
  { href: "/dashboard/profile",      label: "Profile",      icon: AiOutlineUser },
  { href: "/dashboard/review",       label: "Write Review", icon: AiOutlineStar },
  { href: "/dashboard/myReviews",    label: "My Reviews",   icon: AiOutlineOrderedList },
  { href: "/dashboard/watchList",    label: "Watch List",   icon: AiOutlineHeart },
  { href: "/dashboard/recommendations", label: "AI Picks",  icon: AiOutlineRobot, badge: "AI" },
];

const DashboardSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname === item.href;

  return (
    <>
      {/* ══════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════ */}
      <aside
        className="
          hidden md:flex flex-col w-64 h-screen sticky top-0 overflow-y-auto shrink-0
          bg-white border-r border-gray-200
          dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 dark:border-zinc-700
        "
      >
        {/* Brand */}
        <Link
          href="/"
          className="
            flex items-center gap-2 px-6 py-5
            border-b border-gray-200 dark:border-zinc-700
          "
        >
          <MdMovieFilter className="text-rose-600 text-2xl" />
          <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
            Movie<span className="text-rose-600">Next</span>
          </span>
        </Link>

        {/* User card */}
        {session && (
          <div
            className="
              flex items-center gap-3 px-6 py-4
              border-b border-gray-200 dark:border-zinc-700
            "
          >
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-rose-500 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                {session.user?.name ?? "User"}
              </p>
              <p className="text-xs truncate text-gray-500 dark:text-stone-400">
                {session.user?.email ?? ""}
              </p>
            </div>
          </div>
        )}

        {/* Section label */}
        <p className="px-6 pt-5 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-stone-500">
          Menu
        </p>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? "bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/40"
                    : "text-gray-600 hover:bg-rose-50 hover:text-rose-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`
                    text-lg shrink-0 transition-transform duration-200 group-hover:scale-110
                    ${active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-rose-500 dark:text-stone-500 dark:group-hover:text-rose-400"
                    }
                  `}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`
                      text-[9px] font-bold px-1.5 py-0.5 rounded-full
                      ${active
                        ? "bg-white/25 text-white"
                        : "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Desktop Logout Button */}
          <div className="mt-auto pt-6 pb-2">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-stone-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <FiLogOut className="text-lg shrink-0 transition-transform duration-200 group-hover:scale-110 text-gray-400 group-hover:text-red-500 dark:text-stone-500 dark:group-hover:text-red-400" />
              <span className="flex-1 text-left">Log Out</span>
            </button>
          </div>
        </nav>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-[10px] text-center text-gray-400 dark:text-stone-600">
            Powered by Groq &amp; TMDB
          </p>
        </div>
      </aside>

      {/* ══════════════════════════════
          MOBILE TOP BAR
      ══════════════════════════════ */}
      <div
        className="
          md:hidden flex items-center justify-between px-4 py-3
          bg-white border-b border-gray-200
          dark:bg-stone-900 dark:border-stone-800
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <MdMovieFilter className="text-rose-600 text-xl" />
          <span className="font-bold tracking-tight text-gray-900 dark:text-white">
            Movie<span className="text-rose-600">Next</span>
          </span>
        </div>

        {/* Icon-only nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${active
                    ? "bg-rose-600 text-white"
                    : "text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                  }
                `}
              >
                <Icon className="text-lg" />
              </Link>
            );
          })}
          
          {/* Mobile Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Log Out"
            className="p-2 ml-1 rounded-lg transition-colors duration-200 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-stone-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <FiLogOut className="text-lg" />
          </button>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;
