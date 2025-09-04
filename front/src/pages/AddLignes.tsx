import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import ErrorPopup from '../components/ErrorPopup';
import LoadSpinner from '../components/LoadingSpinner';

export default function Addlignes() {
  const [villeDepart, setVilleDepart] = useState('');
  const [villeArrivee, setVilleArrivee] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    // loading = true;
    setLoading(true);

    // get token from sessionStorage
    const token = JSON.parse(sessionStorage.getItem('user') || '{}')?.token;

    try {
      await api.post('/admin/lignes',
        {
          villeDepart,
          villeArrivee
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVilleDepart('');
      setVilleArrivee('');

      // rediriger vers la liste des lignes
      navigate('/lignes');
      return;
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de l’enregistrement du bus.');
      setLoading(false); // Arrêter le spinner
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">     

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {errorMsg && <ErrorPopup message={errorMsg} />}
        {loading && <LoadSpinner />}

        <h1 className="text-2xl font-bold mb-6">Ajouter une ligne</h1>
        
        <div>
          <label className="block font-medium">Ville de départ</label>
          <input
            type="text"
            value={villeDepart}
            onChange={(e) => setVilleDepart(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Ville d'arrivee</label>
          <input
            type="text"
            value={villeArrivee}
            onChange={(e) => setVilleArrivee(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Enregistrer la ligne
        </button>
      </form>
    </div>
  );
}