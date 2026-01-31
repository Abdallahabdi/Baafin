import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaVenusMars } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (Object.values(form).includes("")) {
      setError("All fields are required");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fade"
      >
        {/* HEADER */}
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join BAAFIN Lost & Found Platform
        </p>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* INPUTS */}
        <Input icon={<FaUser />} name="username" placeholder="Username" onChange={handleChange} />
        <Input icon={<FaEnvelope />} name="email" placeholder="Email" onChange={handleChange} />
        <Input icon={<FaPhone />} name="phone" placeholder="Phone Number" onChange={handleChange} />

        {/* GENDER */}
        <div className="relative mb-4">
          <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            name="gender"
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <PasswordInput
          icon={<FaLock />}
          name="password"
          placeholder="Password"
          show={show}
          setShow={setShow}
          onChange={handleChange}
        />

        <PasswordInput
          icon={<FaLock />}
          name="confirmPassword"
          placeholder="Confirm Password"
          show={show}
          setShow={setShow}
          onChange={handleChange}
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* FOOTER */}
        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ===== Reusable Components ===== */

const Input = ({ icon, ...props }) => (
  <div className="relative mb-4">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);

const PasswordInput = ({ icon, show, setShow, ...props }) => (
  <div className="relative mb-4">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      {...props}
      type={show ? "text" : "password"}
      className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      required
    />
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >
      👁️
    </button>
  </div>
);
