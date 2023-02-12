import Link from "next/link";
import { useForm } from "react-hook-form";
import { SlLogin } from "react-icons/sl";
import Social from "../../components/Social";
import { signIn } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const login = signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      email: data.email,
      password: data.password,
      url: "/login",
    });
    if (login) {
      reset();
      toast.success("Successfully logged in");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <div className="flex flex-col md:flex-row mx-4 items-center justify-center my-12">
        <div className="bg-green-700 md:w-1/3 py-6 px-4 text-center text-white">
          <SlLogin className="w-full h-24" />
          <h2 className="my-3 text-2xl">Login</h2>
          <p>
            Tation argumentum et usu, dicit viderer evertitur te has. Eu dictas
            concludaturque usu, facete detracto patrioque an per, lucilius
            pertinacia eu vel.
          </p>
        </div>
        <div className="md:w-1/3 px-3">
          <h3 className="text-2xl mb-2">Please fill this correctly</h3>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <input
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && <span>This field is required</span>}
            <input
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <span>This field is required</span>}
            {errors.confirmPassword && <span>This field is required</span>}
            <button
              className="bg-rose-700 mt-1 rounded-md text-white py-2"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold">
          Don&apos;t have an account?{" "}
          <Link
            className="bg-rose-700 text-white py-1 px-1 font-normal rounded-sm"
            href="/signup"
          >
            Signup
          </Link>{" "}
          now
        </p>
        <p>or</p>
        <Social />
      </div>
    </div>
  );
}
