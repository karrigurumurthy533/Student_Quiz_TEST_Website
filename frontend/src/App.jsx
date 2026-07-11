import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Tests from "./Pages/Tests";
import Files from "./pages/Files";

import Exam from "./Pages/Exam";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={
            <ProtectedRoutes>
              <AppLayout />
            </ProtectedRoutes>
          }>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/files" element={<Files />} />

            {/* ✅ FIXED ROUTE */}
            <Route path="/tests/:id" element={<Exam />} />

          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;