// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthProvider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const resp = await api.post('/auth/login', { username, password });
      const { token, user} = resp.data;
      login(token, user.id);
      navigate('/LandingPage');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={submit} className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <div className="mb-2 text-red-400">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm text-gray-200">Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 rounded bg-black border border-gray-700" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-200">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-black border border-gray-700" />
        </label>
        <div className="flex items-center justify-between">
          <button className="bg-indigo-600 px-4 py-2 rounded text-white" type="submit">Login</button>
          <a href="/register" className="text-sm text-gray-300 underline">Register</a>
        </div>
      </form>
    </div>
  );
}