import { useForm } from "react-hook-form";
import DashboardLayout from "../DashboardLayout";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

const Review = () => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const review = await res.json();

      reset();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-10">
        <Toaster />
        <h2 className="text-2xl font-bold text-rose-700 mb-2">
          Give Review Here
        </h2>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder={session.user.name}
            type="text"
            {...register("name")}
            disabled
          />
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder={session.user.email}
            type="email"
            {...register("email")}
            disabled
          />
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Movie / TV Show Name"
            type="text"
            {...register("movieName", { required: true })}
          />
          {errors.movieName && <span>This field is required</span>}
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Description"
            type="text"
            {...register("description")}
          />
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Rating"
            type="number"
            {...register("rating", {
              min: 1,
              max: 10,
              required: true,
            })}
          />
          {errors.rating && <span>This field is required</span>}
          <button
            className="bg-rose-700 mt-1 rounded-md text-white py-2"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Review;
