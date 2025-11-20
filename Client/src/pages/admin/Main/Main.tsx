import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";

const AdminMain = () => {
  return (
    <div className="flex" >
      <Sidebar />
      <main style={{
        background: "linear-gradient(90deg, #F7FFF7 0%, #E8FDE8 35%, #E6FFEF 100%)",
      }} className="ml-64 flex-1 min-h-screen  p-6 text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminMain;