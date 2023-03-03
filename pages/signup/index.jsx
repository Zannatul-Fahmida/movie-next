import Social from "../../components/Social";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { SlLogin } from "react-icons/sl";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (user) => {
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    user.image = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    const userData = await res.json();

    if (!userData.userId) {
      toast.error(userData.message);
    } else {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
        url: "/signup",
      });

      if (signInRes.error) {
        toast.error(signInRes.error);
      } else {
        toast.success("Successfully registered and logged in");
        reset();
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <div className="flex flex-col md:flex-row mx-4 items-center justify-center my-12">
        <div className="bg-fuchsia-700 md:w-1/3 py-6 px-4 text-center text-white">
          <SlLogin className="w-full h-24" />
          <h2 className="my-3 text-2xl">Registration</h2>
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
              placeholder="Full Name"
              {...register("name", { required: true })}
            />
            {errors.name && <span>This field is required</span>}
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
            <input
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-500 dark:bg-zinc-300 dark:text-black
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Confirm Password"
              type="password"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && <span>This field is required</span>}
            <button
              className="bg-blue-500 mt-1 rounded-md text-white py-2"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold">
          Have an account?{" "}
          <Link
            className="bg-rose-700 text-white py-1 px-1 font-normal rounded-sm"
            href="/login"
          >
            Login
          </Link>{" "}
          now
        </p>
        <p>or</p>
        <Social />
      </div>
    </div>
  );
}
