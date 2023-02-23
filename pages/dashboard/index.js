import { useSession } from "next-auth/react";
import DashboardLayout from "./DashboardLayout";

const Dashboard = () => {
  const {data: session} = useSession();
  console.log(session);
  return (
    <DashboardLayout>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
