import React, { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { FaTrash, FaUserShield } from 'react-icons/fa';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId, currentRole) => {
    if (!confirm('Are you sure you want to change this user’s role?')) return;
    try {
      await API.put(`/users/${userId}`, { role: currentRole === 'admin' ? 'user' : 'admin' });
      loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${userId}`);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6">
            User Management
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                        onClick={() => changeRole(u._id, u.role)}
                      >
                        <FaUserShield /> Toggle Role
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                        onClick={() => deleteUser(u._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
