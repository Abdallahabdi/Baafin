import React, { useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function ForgotPassword(){
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/forgot', { identifier });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
          <h3>Email sent (if it exists)</h3>
          <p className="text-sm text-gray-500">Follow the instructions to reset your password.</p>
          <Link to="/login" className="text-blue-600 mt-4 inline-block">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl mb-3">Forgot Password</h2>
        <input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="Email or username" className="w-full p-2 border rounded mb-3" required />
        <button className="w-full bg-primary text-white p-2 rounded">Send reset email</button>
      </form>
    </div>
  );
}
