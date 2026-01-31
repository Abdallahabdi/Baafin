import React, { useState, useEffect } from 'react';
import API from '../api/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { FaEdit, FaSave, FaUserCircle } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: '' });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setForm({
        name: storedUser.name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        gender: storedUser.gender || '',
      });
      setPreview(storedUser.avatar || '');
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('email', form.email);
      data.append('phone', form.phone);
      data.append('gender', form.gender);
      if (avatar) data.append('avatar', avatar);

      const res = await API.put(`/auth/profile`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl max-w-3xl w-full p-6 md:flex md:gap-6 animate-fade-in">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 md:mb-0">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-400 object-cover"
              />
            ) : (
              <FaUserCircle className="w-32 h-32 text-gray-300" />
            )}
            {editing && (
              <label className="mt-4 cursor-pointer text-blue-600 hover:underline text-sm">
                Change Avatar
                <input type="file" className="hidden" onChange={handleAvatarChange} />
              </label>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-700">Profile</h2>
              {!editing && (
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  onClick={() => setEditing(true)}
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="text-gray-600 text-sm">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-600 text-sm">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {editing && (
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold transition disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
