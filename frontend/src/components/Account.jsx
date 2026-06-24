// frontend/src/components/Account.jsx
import React from 'react';
import { useAuth } from '../AuthProvider';

export default function Account() {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <a href="/login" className="text-white underline">
        Log in
      </a>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-200">Hi, {user.username}</span>
      <button onClick={logout} className="text-sm text-white bg-indigo-600 px-2 py-1 rounded">
        Logout
      </button>
    </div>
  );
}