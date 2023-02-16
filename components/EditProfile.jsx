import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

const EditProfile = () => {
  const { data: session } = useSession();
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
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="my-2">
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
          {...register("name", { required: true })}
        />
        {errors.name && <span>This field is required</span>}
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
        >
          Edit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
