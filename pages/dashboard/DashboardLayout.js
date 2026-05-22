import Loading from "../../components/Loading";
import DashboardSidebar from "../../components/DashboardSidebar";
import withAuth from "../../hoc/withAuth";
import { useSession } from "next-auth/react";

const DashboardLayout = ({ children }) => {
  const { data: session } = useSession();

  if (!session) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden ">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default withAuth(DashboardLayout);
