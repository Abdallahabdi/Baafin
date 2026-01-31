import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/lost-items', label: 'Lost Items' },
  { to: '/found-items', label: 'Found Items' },
  { to: '/admin-users', label: 'Admin Users' },
  // Add more links as needed
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden md:block md:w-56 bg-white border-r h-screen p-4 fixed top-0 left-0 z-40">
      <div className="mb-8 text-xl font-bold text-blue-700">BAAFIN</div>
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded transition font-medium ${
              location.pathname === link.to
                ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
