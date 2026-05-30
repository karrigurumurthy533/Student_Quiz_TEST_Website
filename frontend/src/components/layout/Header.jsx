import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-slate-200">

      {/* 🔹 Title */}
      <h1 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* 🔹 Right Section */}
      <div className="flex items-center gap-4">

        {/* 🔹 User Info */}
        <div className="flex items-center gap-2">
          
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Name */}
          <span className="text-sm text-gray-700 font-medium">
            {user?.name || "User"}
          </span>
        </div>

        {/* 🔹 Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Header;