import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.username}</span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <span>Non connecté</span>
        )}
      </div>
    </header>
  );
}
