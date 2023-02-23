import clientPromise from "../../../lib/mongodb";
import DashboardLayout from "../DashboardLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { useState } from "react";

const WatchList = ({ initialLists }) => {
  const imagePath = "https://image.tmdb.org/t/p/original";
  const [lists, setLists] = useState(initialLists);
  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();
      toast.success("Movie removed from watchlist");

      setLists(lists.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10">
        <Toaster />
        <h2 className="text-2xl font-bold text-rose-700 mb-2">
          My Watch Lists Are Here
        </h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-stone-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Poster
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Release Date
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
              {lists?.map((list) => (
                <tr
                  key={list._id}
                  className="bg-white border-b dark:bg-stone-800 dark:border-stone-700 hover:bg-gray-50 dark:hover:bg-stone-600"
                >
                  <td className="px-6 py-4">
                    <Image
                      width={40}
                      height={40}
                      src={imagePath + list.poster}
                      alt={list.movieName}
                      priority
                    />
                  </td>
                  <td className="px-6 py-4">{list.movieName}</td>
                  <td className="px-6 py-4">{list.releaseDate}</td>
                  <td className="px-6 py-4">
                    {new Date(list.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded shadow"
                      onClick={() => handleDelete(list._id)}
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

export default WatchList;

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
  const lists = await db
    .collection("watchlist")
    .find({ email: session.user.email })
    .sort({ created: -1 })
    .toArray();

  return {
    props: {
      initialLists: JSON.parse(JSON.stringify(lists)),
    },
  };
}
