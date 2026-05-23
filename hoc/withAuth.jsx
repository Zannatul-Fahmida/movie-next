import { getSession } from "next-auth/react";
import Loading from "../components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
      }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
