import { useState } from "react";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Input handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Creating account...");

    try {
      await register(form.name, form.email, form.password);

      toast.success("Registered successfully 🎉", {
        id: loadingToast,
      });

      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Registration failed ❌", {
        id: loadingToast,
      });

      console.log("Register Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-[420px] bg-white p-8 rounded-xl shadow-lg"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3 rounded-xl shadow-md">
            <BrainCircuit className="text-emerald-500 w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold mt-3">Register</h1>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-400"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-400"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">Password</label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none focus:border-emerald-400"
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

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;