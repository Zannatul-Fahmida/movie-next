import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col md:flex-row overflow-y-hidden">
      <div className="bg-slate-100 h-16 md:h-screen w-full md:w-1/5">
        <nav className="flex flex-row md:flex-col justify-between items-center md:justify-start h-full px-4 md:px-0 md:my-2">
          <Link
            href="/dashboard"
            className={
              pathname === "/dashboard"
                ? "px-2 py-2 w-full text-gray-700 text-rose-700 font-bold"
                : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100"
            }
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className={
                pathname === "/dashboard/profile"
                  ? "px-2 py-2 w-full text-gray-700 text-rose-700 font-bold"
                  : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100"
              }
          >
            Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className={
                pathname === "/dashboard/settings"
                  ? "px-2 py-2 w-full text-gray-700 text-rose-700 font-bold"
                  : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100"
              }
          >
            Settings
          </Link>
        </nav>
      </div>
      <div className="w-full md:w-4/5">{children}</div>
    </div>
  );
};

export default DashboardLayout;
