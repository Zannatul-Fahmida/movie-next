import DashboardLayout from "../DashboardLayout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EditProfile from "../../../components/EditProfile";

const Profile = () => {
  const { data: session } = useSession();
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(session?.user?.image); // Add state for the current image URL
  console.log(session);
  const handleEditSubmitSuccess = (updatedUser) => {
    // Update the image state with the new image URL
    setImage(updatedUser.image);
    // Close the edit form
    setEdit(false);
  };
  return (
    <DashboardLayout>
      <div className="p-10 flex flex-col items-center justify-center">
        <img
          className="w-full md:w-52 rounded-full"
          src={image} // Use the image state as the src for the img element
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
          <EditProfile
            onSubmitSuccess={handleEditSubmitSuccess} // Pass the handleEditSubmitSuccess function as a prop
            defaultImage={image} // Pass the current image URL as a prop
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
