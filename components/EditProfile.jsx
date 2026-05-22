import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Compressor from "compressorjs";
import { FiUploadCloud, FiSave } from "react-icons/fi";

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
      image: "",
      name: `${session?.user?.name || ""}`,
      email: `${session?.user?.email || ""}`,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let imageLink = session.user.image;

      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        const compressedImage = await new Promise((resolve, reject) => {
          new Compressor(imageFile, {
            quality: 0.6,
            success: (result) => resolve(result),
            error: (error) => reject(error),
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
        imageLink = json.data.url;
      }

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
        image: "",
      });
      toast.success("Your profile updated successfully!");
      signOut({ callbackUrl: "/login" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Toaster />
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Image Upload Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Profile Photo
          </label>
          <div className="relative group flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-50 dark:bg-stone-800/50 border-2 border-gray-300 dark:border-stone-700 border-dashed rounded-2xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 cursor-pointer overflow-hidden">
            <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-rose-500 mb-2 transition-colors" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Drop a new image, or click to browse
            </span>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              {...register("image")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              className="block w-full px-4 py-3 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm shadow-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              type="text"
              placeholder="Your name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-2 block font-medium">
                This field is required
              </span>
            )}
          </div>

          {/* Email Field (Disabled) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              className="block w-full px-4 py-3 bg-gray-100 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-800 rounded-xl text-sm shadow-inner text-gray-500 dark:text-gray-500 cursor-not-allowed"
              type="email"
              {...register("email")}
              disabled
            />
            <p className="text-xs text-gray-400 mt-2">
              Email cannot be changed.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2 flex justify-end">
          <button
            className="flex items-center justify-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all shadow-md shadow-rose-200 dark:shadow-rose-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <FiSave /> Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
