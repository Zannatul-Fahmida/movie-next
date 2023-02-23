import DashboardLayout from "../DashboardLayout";
import { getSession } from "next-auth/react";
import clientPromise from "../../../lib/mongodb";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const MyReviews = ({ initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/review", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();
      toast.success("Review removed");

      setReviews(reviews.filter((review) => review._id !== id));
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-10">
        <Toaster />
        <h2 className="text-2xl font-bold text-rose-700 mb-2">
          My Reviews Are Here
        </h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-stone-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Review
                </th>
                <th scope="col" className="px-6 py-3">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="bg-white border-b dark:bg-stone-800 dark:border-stone-700 hover:bg-gray-50 dark:hover:bg-stone-600"
                >
                  <td className="px-6 py-4">{review.movieName}</td>
                  <td className="px-6 py-4">
                    {review.description.slice(0, 20)}
                  </td>
                  <td className="px-6 py-4">{review.rating}</td>
                  <td className="px-6 py-4">
                    {new Date(review.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded shadow"
                      onClick={() => handleDelete(review._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyReviews;

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

  const client = await clientPromise;
  const db = client.db("movieNext");
  const reviews = await db
    .collection("reviews")
    .find({ email: session.user.email })
    .sort({ created: -1 })
    .toArray();

  return {
    props: {
      initialReviews: JSON.parse(JSON.stringify(reviews)),
    },
  };
}
