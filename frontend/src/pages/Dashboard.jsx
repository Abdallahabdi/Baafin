import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserContext } from '../utils/UserContext';
import {
  FaBoxOpen, FaBox, FaLink, FaBars, FaUser,
  FaHome, FaSearch, FaTimes
} from 'react-icons/fa';
import { FaClipboardList } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/* ---------------- COUNTER ---------------- */
function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = value > current ? 1 : 0;
    const timer = setInterval(() => {
      current += step;
      setCount(current);
      if (current === value) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

/* ---------------- CARD ---------------- */
function StatsCard({ title, value, icon }) {
  return (
    <div className="flex items-center p-4 bg-white shadow rounded-xl border border-blue-100 hover:shadow-lg transition transform hover:scale-105 min-h-[90px]">
      <div className="text-3xl text-blue-500 mr-4 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">
          <AnimatedCounter value={value} />
        </p>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0, lost: 0, found: 0, matches: 0, returned: 0
  });
  const [recent, setRecent] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [searchQuery, setSearchQuery] = useState('');

  /* ---------------- SIDEBAR LINKS ---------------- */
  const sidebarLinks = [
    { name: 'Dashboard', path: '/', icon: <FaHome /> },
    { name: 'Lost Items', path: '/lost', icon: <FaBoxOpen />, key: 'lost' },
    { name: 'Found Items', path: '/found', icon: <FaBox />, key: 'found' },
    { name: 'Matches', path: '/auto', icon: <FaLink />, key: 'matches' },
    { name: 'Users', path: '/users', icon: <FaUser />, key: 'users' },
    { name: 'Audit Logs', path: '/audit-logs', icon: <FaClipboardList />, adminOnly: true },
    { name: 'Profile', path: '/profile', icon: <FaUser /> },
  ];

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          lostRes, foundRes, matchRes, userRes, returnRes, monthlyRes
        ] = await Promise.all([
          API.get('/lost'),
          API.get('/found'),
          API.get('/matches'),
          API.get('/users'),
          API.get('/returns'),
          API.get('/stats/monthly'),
        ]);

        setStats({
          users: userRes.data?.total || userRes.data.length,
          lost: lostRes.data?.total || lostRes.data.length,
          found: foundRes.data?.total || foundRes.data.length,
          matches: matchRes.data.length,
          returned: returnRes.data.length,
        });

        setRecent([
          ...lostRes.data.slice(-3),
          ...foundRes.data.slice(-3),
        ]);

        setMonthlyData(monthlyRes.data || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    }
    loadDashboard();
  }, []);

  /* ---------------- RESPONSIVE ---------------- */
  useEffect(() => {
    const resize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ---------------- BAR CHART ---------------- */
  const BarChart = ({ data }) => (
    <div className="flex items-end gap-2 bg-blue-50 rounded p-4 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div className="bg-blue-500 w-6 rounded-t" style={{ height: `${d.value * 10}px` }} />
          <span className="text-xs mt-1">{d.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-56 p-4">
          {/* HEADER */}
          <header className="bg-white shadow p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center w-full sm:w-auto justify-between">
              <FaBars className="md:hidden cursor-pointer mr-2" onClick={() => setSidebarOpen(true)} />
              <h2 className="text-xl font-semibold text-blue-800">
                {sidebarLinks.find(l => l.path === location.pathname)?.name || "Dashboard"}
              </h2>
            </div>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="border px-3 py-1 rounded text-sm w-full sm:w-64 mt-2 sm:mt-0"
            />
          </header>
          <main className="p-4 sm:p-6 flex-1 overflow-auto ">
            {/* STATS */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {sidebarLinks.filter(l => l.key).map(link => (
                <NavLink key={link.key} to={link.path} className="block">
                  <StatsCard title={link.name} value={stats[link.key]} icon={link.icon} />
                </NavLink>
              ))}
            </div>
            {/* MONTHLY */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
              <h3 className="font-semibold mb-2">Monthly Report</h3>
              <BarChart data={monthlyData} />
            </div>
            {/* RECENT */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recent.length ? recent.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 shadow-sm hover:shadow-md transition">
                    {r.imageUrl || r.image ? (
                      <img
                        src={r.imageUrl || r.image}
                        alt={r.title}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-blue-200 rounded-md text-2xl">
                        📦
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{r.description}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm">No activity found</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
