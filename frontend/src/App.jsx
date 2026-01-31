import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./utils/UserContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Dashboard.jsx";
import Items from "./components/ItemModal.jsx";
import Login from "./pages/Login.jsx";
import AddItem from "./pages/LostItems.jsx";
import Register from "./pages/Register.jsx";
import FoundItems from "./pages/FoundItems.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import LostItems from "./pages/LostItems.jsx";
import AutoMatches from "./pages/AutoMatches.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import MatchDetails from "./pages/MatchDetails.jsx";
import Profile from "./pages/Profile.jsx";

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register", "/forgotpassword"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) setUser(data);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserProvider>
      {!hideNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <div style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/items" element={<Items />} />
          <Route path="/add" element={<AddItem user={user} />} />
          <Route path="/found" element={<FoundItems />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/lost" element={<LostItems />} />
          <Route path="/auto" element={<AutoMatches />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
        </Routes>
         <ToastContainer position="top-right" autoClose={3000} />
         <Toaster position="top-right" />
      </div>
    </UserProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
