import DashboardLayout from "../../../components/DashboardLayout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import EditProfile from "../../../components/EditProfile";
import { FiEdit3, FiMail, FiUser } from "react-icons/fi";

const Profile = () => {
  const { data: session } = useSession();
  const [edit, setEdit] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        {/* ── Header Wrapper ── */}
        <div className="relative mb-16">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-br from-rose-700 via-rose-500 to-orange-400 overflow-hidden shadow-lg border border-rose-600/20 relative">
            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
          </div>
          
          {/* Overlapping Avatar */}
          <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-stone-950 bg-stone-200 overflow-hidden shadow-xl">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-600 text-white text-5xl font-bold">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Profile Info ── */}
        <div className="px-4 md:px-12 flex flex-col md:flex-row md:items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {session?.user?.name}
            </h1>
            <p className="flex items-center gap-2 text-gray-500 dark:text-stone-400 mt-2 font-medium">
              <FiMail className="text-rose-500" /> {session?.user?.email}
            </p>
          </div>
          
          <button
            onClick={() => setEdit(!edit)}
            className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 shadow-sm"
          >
            <FiEdit3 /> {edit ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>

        {/* ── Edit Form Section ── */}
        <div
          className={`mt-10 px-0 md:px-12 transition-all duration-500 ease-in-out origin-top ${
            edit ? "opacity-100 scale-y-100 h-auto" : "opacity-0 scale-y-0 h-0 overflow-hidden"
          }`}
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-stone-800">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <FiUser className="text-rose-500" /> Update Details
            </h3>
            <EditProfile />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
