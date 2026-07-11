import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, BookOpen, FileText } from "lucide-react";

import userService from "../services/userService";
import testService from "../services/testService";
import fileService from "../services/fileService";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalFiles: 0,
    enrolledCourses: 0,
    completedCourses: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === "admin") {
        const usersRes = await userService.getAllUsers();
        const testsRes = await testService.getAllTests();
        const filesRes = await fileService.getAllFiles();

        setStats({
          totalUsers: usersRes?.users?.length || 0,
          totalTests: testsRes?.tests?.length || 0,
          totalFiles: filesRes?.files?.length || 0,
        });
      } else {
        // User Dashboard
        setStats({
          enrolledCourses: 5,
          completedCourses: 2,
        });
      }
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return <div className="p-4">Please login</div>;
  }

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {user.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
      </h1>

      <div
        className={`grid gap-6 ${
          user.role === "admin"
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {user.role === "admin" ? (
          <>
            <Card
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users />}
            />

            <Card
              title="Total Tests"
              value={stats.totalTests}
              icon={<BookOpen />}
            />

            <Card
              title="Total Files"
              value={stats.totalFiles}
              icon={<FileText />}
            />
          </>
        ) : (
          <>
            <Card
              title="Courses"
              value={stats.enrolledCourses}
              icon={<Users />}
            />

            <Card
              title="Completed"
              value={stats.completedCourses}
              icon={<BookOpen />}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
      <div className="p-3 bg-gray-100 rounded-full text-emerald-600">
        {icon}
      </div>

      <div>
        <h2 className="text-gray-500 text-sm">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;