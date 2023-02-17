import DashboardLayout from "../DashboardLayout";
import { connectToDatabase } from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

const MyReviews = ({ reviews }) => {
  return (
    <DashboardLayout>
      <div className="p-10">
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

  const client = await connectToDatabase();
  const db = client.db();
  const reviews = await db
    .collection("reviews")
    .find({ email: session.user.email })
    .sort({ created: -1 })
    .toArray();

  return {
    props: {
      reviews: JSON.parse(JSON.stringify(reviews)),
    },
  };
}
