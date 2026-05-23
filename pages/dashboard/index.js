import DashboardLayout from "./DashboardLayout";
import { getSession } from "next-auth/react";
import clientPromise from "../../lib/mongodb";
import { AiOutlineHeart, AiOutlineStar, AiOutlineVideoCamera, AiOutlineCalendar, AiOutlineCompass } from "react-icons/ai";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from "chart.js";
import { Bar, Doughnut, Line, Radar, Bubble } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

const Dashboard = ({ stats, ratingDistribution, watchlistActivity, reviewsActivity, weeklyEngagement, reviewDepthData }) => {
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

  // Config for Bubble Chart (Review Depth Analysis)
  const getBubbleColor = (rating) => {
    if (rating === 1) return "rgba(239, 68, 68, 0.75)";   // red-500
    if (rating === 2) return "rgba(249, 115, 22, 0.75)";  // orange-500
    if (rating === 3) return "rgba(234, 179, 8, 0.75)";   // yellow-500
    if (rating === 4) return "rgba(132, 204, 22, 0.75)";  // lime-500
    if (rating === 5) return "rgba(34, 197, 94, 0.75)";   // green-500
    return "rgba(156, 163, 175, 0.75)";
  };

  const getBubbleBorder = (rating) => {
    if (rating === 1) return "#ef4444";
    if (rating === 2) return "#f97316";
    if (rating === 3) return "#eab308";
    if (rating === 4) return "#84cc16";
    if (rating === 5) return "#22c55e";
    return "#9ca3af";
  };

  const maxCount = reviewDepthData?.length > 0 ? Math.max(...reviewDepthData.map(d => d.reviewCount)) : 1;

  const bubbleChartData = {
    datasets: reviewDepthData?.map((data) => ({
      label: `${data.rating} Star Reviews`,
      data: [{
        x: data.rating,
        y: data.avgWords,
        r: Math.max(12, (data.reviewCount / maxCount) * 35), // Scale radius
        rawCount: data.reviewCount,
      }],
      backgroundColor: getBubbleColor(data.rating),
      borderColor: getBubbleBorder(data.rating),
      borderWidth: 2,
    })) || [],
  };

  const bubbleChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 17, 17, 0.85)",
        titleColor: "#f9fafb",
        bodyColor: "#d1d5db",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const data = context.raw;
            return ` ${data.rawCount} review(s) | Avg ${data.y} words`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Avg Word Count",
          color: "#9ca3af",
          font: { size: 11, weight: "500" }
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(156, 163, 175, 0.08)",
        },
        border: { dash: [4, 4] },
      },
      x: {
        min: 0.5,
        max: 5.5,
        title: {
          display: true,
          text: "Star Rating",
          color: "#9ca3af",
          font: { size: 11, weight: "500" }
        },
        ticks: {
          stepSize: 1,
          color: "#9ca3af",
          font: { size: 12, weight: "500" },
          callback: (value) => value >= 1 && value <= 5 ? `★ ${value}` : ''
        },
        grid: { display: false },
      },
    },
  };

  // Config for Radar Chart (Weekly Engagement Pattern)
  const radarChartData = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Watchlist Adds",
        data: weeklyEngagement.watchlistData,
        backgroundColor: "rgba(225, 29, 72, 0.2)", // Rose-600 with opacity
        borderColor: "rgba(225, 29, 72, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(225, 29, 72, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(225, 29, 72, 1)",
      },
      {
        label: "Reviews Written",
        data: weeklyEngagement.reviewsData,
        backgroundColor: "rgba(139, 92, 246, 0.2)", // Violet-500 with opacity
        borderColor: "rgba(139, 92, 246, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(139, 92, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(139, 92, 246, 1)",
      },
    ],
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: "rgba(156, 163, 175, 0.15)",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.15)",
        },
        pointLabels: {
          color: "#9ca3af",
          font: {
            size: 13,
            weight: "600",
          },
        },
        ticks: {
          backdropColor: "transparent",
          color: "#9ca3af",
          stepSize: 1,
          showLabelBackdrop: false,
          font: { size: 11 },
        },
      },
    },
  };

  // Config for Dual-Area Chart (Watchlist vs Reviews Over Time)
  const activityComparisonData = {
    labels: watchlistActivity.labels,
    datasets: [
      {
        label: "Watchlist Additions",
        data: watchlistActivity.data,
        borderColor: "#e11d48",              // Rose-600
        backgroundColor: "rgba(225, 29, 72, 0.12)",
        fill: true,
        tension: 0.45,
        pointBackgroundColor: "#e11d48",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#e11d48",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
      {
        label: "Reviews Written",
        data: reviewsActivity.data,
        borderColor: "#8b5cf6",              // Violet-500
        backgroundColor: "rgba(139, 92, 246, 0.12)",
        fill: true,
        tension: 0.45,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#8b5cf6",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
    ],
  };

  const activityComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#9ca3af",
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 17, 17, 0.85)",
        titleColor: "#f9fafb",
        bodyColor: "#d1d5db",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#9ca3af",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(156, 163, 175, 0.08)",
        },
        border: { dash: [4, 4] },
      },
      x: {
        ticks: {
          color: "#9ca3af",
          font: { size: 12, weight: "500" },
        },
        grid: { display: false },
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
            Welcome back! Here&apos;s what&apos;s happening with your account today.
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

        {/* ── Row 2: Review Depth + Activity Comparison ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Bubble Chart: Review Depth Analysis */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Review Depth Analysis
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Compare star ratings vs. how much you write (bubble size = review count)</p>
            {stats.totalReviews > 0 && reviewDepthData?.length > 0 ? (
              <div className="h-96 relative flex-1">
                <Bubble data={bubbleChartData} options={bubbleChartOptions} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-96">
                <AiOutlineStar className="text-5xl mb-3 opacity-20" />
                <p>No text reviews to analyze yet.</p>
              </div>
            )}
          </div>

          {/* Dual-Area Chart: Watchlist vs Reviews Over Time */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Watchlist vs Reviews Over Time
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Compare how often you add movies vs write reviews each month</p>
            {stats.totalWatchlist > 0 || stats.totalReviews > 0 ? (
              <div className="h-96 relative flex-1">
                <Line data={activityComparisonData} options={activityComparisonOptions} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-96">
                <AiOutlineCalendar className="text-5xl mb-3 opacity-20" />
                <p>No activity data to show.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Row 3: Radar – Full Width ── */}
        <div className="mt-6">
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Weekly Engagement Pattern
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Watchlist additions vs reviews written by day of the week</p>
            {stats.totalWatchlist > 0 || stats.totalReviews > 0 ? (
              <div className="h-96 relative flex justify-center items-center">
                <Radar data={radarChartData} options={radarChartOptions} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-96">
                <AiOutlineCompass className="text-5xl mb-3 opacity-20" />
                <p>No engagement data available.</p>
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
      if (item.created) {
        const date = new Date(item.created);
        const monthName = date.toLocaleString("default", { month: "short" });
        // Only count if it's within the last 6 months keys
        if (monthCounts[monthName] !== undefined) {
          monthCounts[monthName]++;
        }
      }
    });

    // 4. Reviews by Month (Last 6 Months)
    const reviewMonthCounts = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      reviewMonthCounts[monthName] = 0;
    }

    reviews.forEach((item) => {
      if (item.created) {
        const date = new Date(item.created);
        const monthName = date.toLocaleString("default", { month: "short" });
        if (reviewMonthCounts[monthName] !== undefined) {
          reviewMonthCounts[monthName]++;
        }
      }
    });

    // 5. Weekly Engagement Activity (Day of the Week: Sunday - Saturday)
    const watchlistDayCounts = Array(7).fill(0);
    const reviewDayCounts = Array(7).fill(0);

    watchlist.forEach((item) => {
      if (item.created) {
        const date = new Date(item.created);
        const day = date.getDay();
        watchlistDayCounts[day]++;
      }
    });

    reviews.forEach((item) => {
      if (item.created) {
        const date = new Date(item.created);
        const day = date.getDay();
        reviewDayCounts[day]++;
      }
    });

    // 6. Review Depth Analysis (Bubble Chart)
    const ratingWordCount = { 1: { words: 0, count: 0 }, 2: { words: 0, count: 0 }, 3: { words: 0, count: 0 }, 4: { words: 0, count: 0 }, 5: { words: 0, count: 0 } };
    
    reviews.forEach((item) => {
      if (item.rating && ratingWordCount[item.rating]) {
        const words = item.description ? item.description.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
        ratingWordCount[item.rating].words += words;
        ratingWordCount[item.rating].count += 1;
      }
    });

    const reviewDepthData = [];
    for (let i = 1; i <= 5; i++) {
      if (ratingWordCount[i].count > 0) {
        reviewDepthData.push({
          rating: i,
          avgWords: Math.round(ratingWordCount[i].words / ratingWordCount[i].count),
          reviewCount: ratingWordCount[i].count
        });
      }
    }

    return {
      props: {
        stats: {
          totalWatchlist,
          totalReviews,
          avgRating,
        },
        ratingDistribution: Object.values(ratingCounts),
        watchlistActivity: {
          labels: Object.keys(monthCounts),
          data: Object.values(monthCounts),
        },
        reviewsActivity: {
          labels: Object.keys(reviewMonthCounts),
          data: Object.values(reviewMonthCounts),
        },
        weeklyEngagement: {
          watchlistData: watchlistDayCounts,
          reviewsData: reviewDayCounts,
        },
        reviewDepthData,
      },
    };
  } catch (error) {
    console.error("Dashboard ServerSideProps error:", error);
    return {
      props: {
        stats: { totalWatchlist: 0, totalReviews: 0, avgRating: 0 },
        ratingDistribution: [0, 0, 0, 0, 0],
        watchlistActivity: { labels: [], data: [] },
        reviewsActivity: { labels: [], data: [] },
        weeklyEngagement: { watchlistData: [0, 0, 0, 0, 0, 0, 0], reviewsData: [0, 0, 0, 0, 0, 0, 0] },
        reviewDepthData: [],
      },
    };
  }
}
