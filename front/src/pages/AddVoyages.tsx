import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import ErrorPopup from '../components/ErrorPopup';
import LoadSpinner from '../components/LoadingSpinner';

export default function AddVoyages() {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date().toISOString().slice(0, 16)); // Format YYYY-MM-DDTHH:mm
  const [price, setPrice] = useState<number>(0);
  const [availableSeats, setAvailableSeats] = useState<number>(0);
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
      await api.post('/admin/voyages',
        {
          departureCity,
          arrivalCity,
          departureTime,
          price,
          availableSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDepartureCity('');
      setArrivalCity('');
      setPrice(0);
      setAvailableSeats(0);
      setDepartureTime(new Date().toISOString().slice(0, 16)); // Réinitialiser la date au format YYYY-MM-DDTHH:mm

      // rediriger vers la liste des voyages
      navigate('/voyages');
      return;
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de l’enregistrement du voyage.');
      setLoading(false); // Arrêter le spinner
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">     

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {errorMsg && <ErrorPopup message={errorMsg} />}
        {loading && <LoadSpinner />}

        <h1 className="text-2xl font-bold mb-6">Ajouter un Voyage</h1>
        
        <div>
          <label className="block font-medium">Ville de Départ</label>
          <input
            type="text"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Ville d'arrivée</label>
          <input
            type="text"
            value={arrivalCity}
            onChange={(e) => setArrivalCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Coût (CFA)</label>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Nombre de places disponible</label>
          <input
            type="number"
            min={1}
            value={availableSeats}
            onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Date de départ</label>
          <input
            type="date"
            min={1}
            value={departureTime.slice(0, 10)}
            onChange={(e) => setDepartureTime(e.target.value + 'T' + departureTime.slice(11))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Enregistrer le voyage
        </button>
      </form>
    </div>
  );
}