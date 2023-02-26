import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Compressor from "compressorjs";

const EditProfile = () => {
  const { data: session } = useSession({ setLoadingAfterInit: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: `${session.user.image}`,
      name: `${session.user.name}`,
      email: `${session.user.email}`,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const imageFile = data.image[0];
      const imageBase64 = await new Promise((resolve, reject) => {
        new Compressor(imageFile, {
          quality: 0.6, // adjust the quality to your liking
          success: (result) => {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          },
          error: (error) => {
            reject(error);
          },
        });
      });
      const res = await fetch(`/api/user/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          image: imageBase64,
        }),
      });
      const updatedUser = await res.json();
      reset({
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      });
      toast.success("Your profile updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-2">
      <Toaster />
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          type="file"
          accept="image/*"
          {...register("image")}
        />
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          type="text"
          {...register("name")}
        />
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          type="email"
          {...register("email")}
          disabled
        />
        <button
          className="bg-rose-700 mt-1 rounded-md text-white py-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
