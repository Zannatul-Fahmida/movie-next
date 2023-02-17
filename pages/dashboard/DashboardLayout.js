import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "../../components/Loading";
import withAuth from "../../hoc/withAuth";
import { useSession } from "next-auth/react";

const DashboardLayout = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  if (!session) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col md:flex-row overflow-y-hidden">
      <div className="bg-slate-100 h-16 md:h-screen w-full md:w-1/5 dark:bg-zinc-900">
        <nav className="flex flex-row md:flex-col justify-between items-center md:justify-start h-full px-4 md:px-0 md:my-2">
          <Link
            href="/dashboard"
            className={
              pathname === "/dashboard"
                ? "px-2 py-2 w-full text-rose-700 font-bold"
                : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100 dark:text-gray-200 dark:hover:text-gray-700"
            }
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className={
              pathname === "/dashboard/profile"
                ? "px-2 py-2 w-full text-rose-700 font-bold"
                : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100 dark:text-gray-200 dark:hover:text-gray-700"
            }
          >
            Profile
          </Link>
          <Link
            href="/dashboard/review"
            className={
              pathname === "/dashboard/review"
                ? "px-2 py-2 w-full text-rose-700 font-bold"
                : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100 dark:text-gray-200 dark:hover:text-gray-700"
            }
          >
            Review
          </Link>
          <Link
            href="/dashboard/myReviews"
            className={
              pathname === "/dashboard/myReviews"
                ? "px-2 py-2 w-full text-rose-700 font-bold"
                : "px-2 py-2 w-full text-gray-700 hover:bg-rose-100 dark:text-gray-200 dark:hover:text-gray-700"
            }
          >
            My Reviews
          </Link>
        </nav>
      </div>
      {!session ? (
        <Loading />
      ) : (
        <div className="w-full md:w-4/5">{children}</div>
      )}
    </div>
  );
};

export default withAuth(DashboardLayout);
