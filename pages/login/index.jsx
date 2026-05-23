import Link from "next/link";
import { useForm } from "react-hook-form";
import Social from "../../components/Social";
import { signIn, useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { MdMovieFilter } from "react-icons/md";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session) {
      const callbackUrl = router.query.callbackUrl || router.query.redirect || "/dashboard";
      router.push(callbackUrl);
    }
  }, [session, router]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const login = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!login?.error) {
        reset();
        toast.success("Successfully logged in");
        const callbackUrl = router.query.callbackUrl || router.query.redirect || "/dashboard";
        router.push(callbackUrl);
      } else {
        toast.error("Invalid credentials, please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-stone-950 p-4 relative overflow-hidden">
      <Toaster />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/20 dark:bg-rose-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/20 dark:bg-orange-900/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Left Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h3>
            <p className="text-gray-500 dark:text-stone-400 text-sm mb-8">
              Please enter your details to sign in to your account.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                    placeholder="you@example.com"
                    {...register("email", { required: true })}
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500 mt-1 block">Email is required</span>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                  />
                </div>
                {errors.password && <span className="text-xs text-red-500 mt-1 block">Password is required</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center before:flex-1 before:border-t before:border-gray-200 dark:before:border-stone-700 after:flex-1 after:border-t after:border-gray-200 dark:after:border-stone-700">
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            <div className="mt-6 flex justify-center">
              <Social />
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-stone-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-rose-600 hover:text-rose-500 transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Branding & Graphic */}
        <div className="md:w-5/12 bg-gradient-to-br from-rose-700 via-rose-600 to-orange-500 p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

          <div className="relative z-10 flex flex-col h-full justify-center">
            <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
              <MdMovieFilter className="text-5xl" />
              <span className="font-extrabold text-4xl tracking-tight">
                MovieNext
              </span>
            </Link>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Your personal theater awaits.
            </h2>
            <p className="text-rose-100 font-medium text-lg mb-12">
              Log in to see your latest AI recommendations, manage your watchlists, and share your reviews.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex gap-1 mb-2 text-yellow-400">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-sm italic text-rose-50 font-medium">
                &quot;The cleanest way to organize my binge-watching. The dashboard is absolutely stunning.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
