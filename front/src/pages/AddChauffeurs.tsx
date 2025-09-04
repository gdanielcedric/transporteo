import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import ErrorPopup from '../components/ErrorPopup';
import LoadSpinner from '../components/LoadingSpinner';

export default function AddChauffeurs() {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
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
      await api.post('/admin/chauffeurs',
        {
          nom,
          telephone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNom('');
      setTelephone('');

      // rediriger vers la liste des chauffeurs
      navigate('/chauffeurs');
      return;
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de l’enregistrement du chauffeur.');
      setLoading(false); // Arrêter le spinner
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">     

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {errorMsg && <ErrorPopup message={errorMsg} />}
        {loading && <LoadSpinner />}

        <h1 className="text-2xl font-bold mb-6">Ajouter un Chauffeur</h1>
        
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Telephone</label>
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Enregistrer le chauffeur
        </button>
      </form>
    </div>
  );
}