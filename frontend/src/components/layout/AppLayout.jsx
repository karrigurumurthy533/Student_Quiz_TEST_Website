import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4">
          <Outlet /> {/* 🔥 THIS FIXES YOUR ISSUE */}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;