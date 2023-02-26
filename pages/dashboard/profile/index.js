import DashboardLayout from "../DashboardLayout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EditProfile from "../../../components/EditProfile";

const Profile = () => {
  const { data: session } = useSession();
  console.log(session);
  const [edit, setEdit] = useState(false);
  return (
    <DashboardLayout>
      <div className="p-10 flex flex-col items-center justify-center">
        <img
          className="w-full md:w-52 rounded-full"
          src={session?.user?.image} 
          alt="Profile Image"
        />
        <h2 className="font-bold text-3xl my-2">{session?.user?.name}</h2>
        <p>{session?.user?.email}</p>
        {!edit && (
          <button
            onClick={() => setEdit(true)}
            className="bg-rose-700 rounded-md px-4 py-2 text-white my-2"
          >
            Edit Profile
          </button>
        )}
        {edit && (
          <EditProfile />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
