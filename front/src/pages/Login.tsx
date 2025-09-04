import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import ErrorPopup from '../components/ErrorPopup';
import LoadSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // loading = true;
    setLoading(true);
    const success = await login(username, password);
    if (success) {
      // Si la connexion réussit, rediriger vers la page d'accueil
      navigate('/');
      return;
    }
    else{
      // Si la connexion échoue, afficher un message d'erreur
      setError('Username ou mot de passe invalide');
      setLoading(false); // Arrêter le spinner
      return;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        {error && <ErrorPopup message={error} />}
        {loading && <LoadSpinner />}
        <label className="block mb-2 font-semibold" htmlFor="email">
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2 font-semibold" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
