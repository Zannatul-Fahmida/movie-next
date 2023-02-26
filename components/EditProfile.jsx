import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Compressor from "compressorjs";

const EditProfile = () => {
  const { data: session } = useSession();
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
      const compressedImage = await new Promise((resolve, reject) => {
        new Compressor(imageFile, {
          quality: 0.6, 
          success: (result) => {
            resolve(result);
          },
          error: (error) => {
            reject(error);
          },
        });
      });
      const formData = new FormData();
      formData.append("image", compressedImage);
      const imgBbUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;

      const res = await fetch(imgBbUrl, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      const imageLink = json.data.url;

      const res2 = await fetch(`/api/user/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          image: imageLink,
        }),
      });
      const updatedUser = await res2.json();
      reset({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      toast.success("Your profile updated");
      signOut({ callbackUrl: "/login" });
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
