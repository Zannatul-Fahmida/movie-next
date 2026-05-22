import DashboardLayout from "./DashboardLayout";
import { getSession } from "next-auth/react";
import clientPromise from "../../lib/mongodb";
import { AiOutlineHeart, AiOutlineStar, AiOutlineVideoCamera } from "react-icons/ai";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = ({ stats, ratingDistribution, watchlistActivity }) => {
  // Config for Bar Chart (Watchlist Activity)
  const barChartData = {
    labels: watchlistActivity.labels,
    datasets: [
      {
        label: "Watchlist Additions",
        data: watchlistActivity.data,
        backgroundColor: "rgba(225, 29, 72, 0.8)", // Rose-600
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Config for Doughnut Chart (Ratings Distribution)
  const doughnutChartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Reviews",
        data: ratingDistribution,
        backgroundColor: [
          "#ef4444", // red-500
          "#f97316", // orange-500
          "#eab308", // yellow-500
          "#84cc16", // lime-500
          "#22c55e", // green-500
        ],
        borderWidth: 2,
        borderColor: "transparent",
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your account today.
          </p>
        </div>

        {/* ── Quick Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Stat 1 */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Watchlist
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalWatchlist}
              </h3>
            </div>
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-2xl">
              <AiOutlineHeart />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Reviews
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalReviews}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl">
              <AiOutlineVideoCamera />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Average Rating
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.avgRating} <span className="text-lg text-gray-400">/ 5</span>
              </h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-2xl">
              <AiOutlineStar />
            </div>
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: Watchlist Activity */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Watchlist Activity (Last 6 Months)
            </h3>
            <div className="h-64 relative">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Doughnut Chart: Ratings Distribution */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Reviews Rating Distribution
            </h3>
            {stats.totalReviews > 0 ? (
              <div className="h-64 relative flex-1 flex justify-center items-center">
                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-64">
                <AiOutlineStar className="text-5xl mb-3 opacity-20" />
                <p>No reviews written yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db("movieNext");

    // Fetch user's data
    const watchlist = await db
      .collection("watchlist")
      .find({ email: session.user.email })
      .toArray();

    const reviews = await db
      .collection("reviews")
      .find({ email: session.user.email })
      .toArray();

    // 1. Calculate Quick Stats
    const totalWatchlist = watchlist.length;
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : 0;

    // 2. Ratings Distribution (1-5 stars)
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (ratingCounts[review.rating] !== undefined) {
        ratingCounts[review.rating]++;
      }
    });

    // 3. Watchlist Additions by Month (Last 6 Months)
    const monthCounts = {};
    const today = new Date();

    // Initialize last 6 months to 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      monthCounts[monthName] = 0;
    }

    // Populate counts
    watchlist.forEach((item) => {
      const date = new Date(item.created);
      const monthName = date.toLocaleString("default", { month: "short" });
      // Only count if it's within the last 6 months keys
      if (monthCounts[monthName] !== undefined) {
        monthCounts[monthName]++;
      }
    });

    return {
      props: {
        stats: {
          totalWatchlist,
          totalReviews,
          avgRating,
        },
        ratingDistribution: Object.values(ratingCounts), // Array [1*, 2*, 3*, 4*, 5*]
        watchlistActivity: {
          labels: Object.keys(monthCounts),
          data: Object.values(monthCounts),
        },
      },
    };
  } catch (error) {
    console.error("Dashboard ServerSideProps error:", error);
    return {
      props: {
        stats: { totalWatchlist: 0, totalReviews: 0, avgRating: 0 },
        ratingDistribution: [0, 0, 0, 0, 0],
        watchlistActivity: { labels: [], data: [] },
      },
    };
  }
}
