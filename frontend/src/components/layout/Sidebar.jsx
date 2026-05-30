import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Home,
  Users,
  BookOpen,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const menuItems = [
    {
      name: isAdmin ? "Dashboard" : "Home",
      path: "/dashboard",
      icon: isAdmin ? LayoutDashboard : Home,
    },

    ...(isAdmin
      ? [
          {
            name: "Users",
            path: "/users",
            icon: Users,
          },
        ]
      : []),

    {
      name: "Tests",
      path: "/tests",
      icon: BookOpen,
    },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-sm border-r border-slate-200 p-5 flex flex-col">

      {/* Admin Title */}
      {isAdmin && (
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      )}

      {/* Menu */}
      <nav className="flex flex-col gap-3 mt-10">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded font-bold transition ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "hover:bg-emerald-100 text-gray-700"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default Sidebar;