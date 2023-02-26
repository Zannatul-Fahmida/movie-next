import { getSession } from "next-auth/react";
import Loading from "../components/Loading";
import { useSession } from "next-auth/react";
import Login from "../pages/login";
import { useRouter } from "next/router";

export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    const { data: session, loading } = useSession();
    const router = useRouter();

    if (loading) {
      return <Loading />;
    } else if (!session) {
      return <Login />;
    }

    return <WrappedComponent {...props} />;
  };
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
