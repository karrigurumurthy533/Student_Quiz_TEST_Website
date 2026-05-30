import { useEffect, useState } from "react";
import userService from "../services/userService";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await userService.getAllUsers();
      setUsers(data?.users || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await userService.deleteUser(id);

      setUsers((prev) => prev.filter((user) => user._id !== id));

      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Delete failed"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Users</h1>

      <div className="overflow-x-auto bg-white border border-slate-200 shadow-sm rounded-xl">
        <table className="w-full text-left border-collapse">
          
          {/* HEADER */}
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">Id</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-t border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Users;