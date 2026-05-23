import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn, FaDiscord } from "react-icons/fa";
import { BsGithub, BsFacebook } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Social() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || router.query.redirect || "/";

  return (
    <div>
      <button
        onClick={() => signIn("google", { redirect: true, callbackUrl })}
        className="mx-2"
      >
        <FcGoogle />
      </button>
      <button
        onClick={() => signIn("github", { redirect: true, callbackUrl })}
        className="mx-2"
      >
        <BsGithub />
      </button>
      <button
        onClick={() =>
          signIn("facebook", { redirect: true, callbackUrl })
        }
        className="mx-2 text-blue-800"
      >
        <BsFacebook />
      </button>
      <button
        onClick={() =>
          signIn("linkedin", { redirect: true, callbackUrl })
        }
        className="mx-2 text-blue-600"
      >
        <FaLinkedinIn />
      </button>
      <button
        onClick={() =>
          signIn("discord", { redirect: true, callbackUrl })
        }
        className="mx-2"
      >
        <FaDiscord />
      </button>
    </div>
  );
}
