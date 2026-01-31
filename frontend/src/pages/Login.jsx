import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please enter your email/username and password");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 px-4 sm:px-6 lg:px-8">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade"
      >
        {/* HEADER */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm sm:text-base mb-6">
          Login to BAAFIN Lost & Found
        </p>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 text-xs sm:text-sm text-center p-2 rounded">
            {error}
          </div>
        )}

        {/* USERNAME */}
        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* OPTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-blue-600"
            />
            Remember me
          </label>

          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:scale-[1.02] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="mt-5 text-center text-xs sm:text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
