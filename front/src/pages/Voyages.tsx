import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Voyage {
  id: string;
  ligneId: string;
  dateDepart: string;
  heureDepart: string;
  nombrePlacesDisponibles: number;
}

export default function Voyages() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVoyages() {
      setLoading(true);
      try {
        const res = await api.get('/admin/voyages');
        setVoyages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVoyages();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Voyages</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Ligne ID</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Heure</th>
              <th className="py-2 px-4 text-left">Places dispo</th>
            </tr>
          </thead>
          <tbody>
            {voyages.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{v.id}</td>
                <td className="py-2 px-4">{v.ligneId}</td>
                <td className="py-2 px-4">{new Date(v.dateDepart).toLocaleDateString()}</td>
                <td className="py-2 px-4">{v.heureDepart}</td>
                <td className="py-2 px-4">{v.nombrePlacesDisponibles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
