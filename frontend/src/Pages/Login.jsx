import { useState } from "react";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { BrainCircuit, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Logging in...");

    try {
      setLoading(true);

      const data = await authService.login(form.email, form.password);

      const { user, token } = data;

      if (!user || !token) {
        throw new Error("Invalid response");
      }

      login(user, token);

      toast.success("Logged in successfully", {
        id: loadingToast,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || "Invalid Credentials",
        {
          id: loadingToast,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[420px] bg-white p-8 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3 rounded-xl shadow-md">
            <BrainCircuit className="text-emerald-500 w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold mt-3">Login</h1>
          <p className="text-gray-500 text-sm">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>

            <input
              type="email"
              value={form.email}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-400"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">Password</label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none focus:border-emerald-400"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;