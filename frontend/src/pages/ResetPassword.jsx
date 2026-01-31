import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useSearchParams, Link } from 'react-router-dom';

export default function ResetPassword(){
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    try {
      await API.post('/auth/reset', { id, token, newPassword });
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
          <h3>Password reset successful</h3>
          <Link to="/login" className="text-blue-600 mt-4 inline-block">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl mb-3">Reset Password</h2>
        <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="New password" className="w-full p-2 border rounded mb-3" required />
        <button className="w-full bg-primary text-white p-2 rounded">Reset Password</button>
      </form>
    </div>
  );
}
