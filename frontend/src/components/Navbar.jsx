import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ username: 'Guest', role: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({ username: storedUser.name || storedUser.username, role: storedUser.role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition font-medium ${
      location.pathname === path
        ? 'bg-blue-100 text-blue-700 shadow'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 tracking-wider hover:text-blue-800 transition"
        >
          BAAFIN
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/lost" className={linkClass('/lost')}>
            Lost Items
          </Link>
          <Link to="/found" className={linkClass('/found')}>
            Found Items
          </Link>
          {user.role === 'admin' && (
            <Link to="/adminUsers" className={linkClass('/adminUsers')}>
              Users
            </Link>
          )}
        </nav>

        {/* Right Side: Notifications + User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative group">
            <FaBell className="text-gray-600 text-lg hover:text-blue-600 transition" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full animate-pulse">
              3
            </span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full shadow hover:shadow-lg transition">
              <FaUserCircle className="text-2xl text-blue-500" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-blue-800">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
              {localStorage.getItem('token') ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600 transition text-xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 py-2 flex flex-col gap-2 bg-blue-50 border-t border-blue-100 shadow-inner">
          <Link to="/lost" className={linkClass('/lost')} onClick={() => setMobileMenuOpen(false)}>
            Lost Items
          </Link>
          <Link to="/found" className={linkClass('/found')} onClick={() => setMobileMenuOpen(false)}>
            Found Items
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/adminUsers"
              className={linkClass('/adminUsers')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Users
            </Link>
          )}
          {localStorage.getItem('token') ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
