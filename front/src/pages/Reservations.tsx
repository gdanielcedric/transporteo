import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Reservation {
  id: string;
  voyageId: string;
  utilisateurId: string;
  nombrePlaces: number;
  dateReservation: string;
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      try {
        const res = await api.get('/admin/reservations');
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Réservations</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Voyage ID</th>
              <th className="py-2 px-4 text-left">Utilisateur ID</th>
              <th className="py-2 px-4 text-left">Nombre de places</th>
              <th className="py-2 px-4 text-left">Date de réservation</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2
                px-4">{r.id}</td>
                <td className="py-2 px-4">{r.voyageId}</td>
                <td className="py-2 px-4">{r.utilisateurId}</td>
                <td className="py-2 px-4">{r.nombrePlaces}</td>
                <td className="py-2 px-4">{new Date(r.dateReservation).toLocaleDateString()}</td>
            </tr>
            ))}
         </tbody>
         </table>
)}
</div>
);
}