// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthProvider';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const resp = await api.post('/auth/register', { username, email, password });
      // After registration, log in automatically (call login endpoint)
      const loginResp = await api.post('/auth/login', { username, password });
      const { token, user } = loginResp.data;
      login(token, user);
      navigate('/Homepage');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={submit} className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <div className="mb-2 text-red-400">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm text-gray-200">Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 rounded bg-black border border-gray-700" />
        </label>
        <label className="block mb-2">
          <span className="text-sm text-gray-200">Email (optional)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-black border border-gray-700" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-200">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-black border border-gray-700" />
        </label>
        <div className="flex items-center justify-between">
          <button className="bg-indigo-600 px-4 py-2 rounded text-white" type="submit">Register</button>
          <a href="/login" className="text-sm text-gray-300 underline">Login</a>
        </div>
      </form>
    </div>
  );
}