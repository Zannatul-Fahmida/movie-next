import { useSession } from "next-auth/react";
import Loading from "../components/Loading";

export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    const { data: session, loading } = useSession();
  
    if (loading) {
      return <Loading />;
    }
    else if (!session) {
      if (process.browser) {
        const router = require("next/router").default;
        router.push("/login");
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
