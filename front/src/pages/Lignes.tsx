import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Ligne {
  id: string;
  villeDepart: string;
  villeArrivee: string;
  duree: number;
  prix: number;
}

export default function Lignes() {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLignes() {
      setLoading(true);
      try {
        const res = await api.get('/admin/lignes');
        setLignes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLignes();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lignes</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Départ</th>
              <th className="py-2 px-4 text-left">Arrivée</th>
              <th className="py-2 px-4 text-left">Durée (min)</th>
              <th className="py-2 px-4 text-left">Prix (F CFA)</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{l.id}</td>
                <td className="py-2 px-4">{l.villeDepart}</td>
                <td className="py-2 px-4">{l.villeArrivee}</td>
                <td className="py-2 px-4">{l.duree}</td>
                <td className="py-2 px-4">{l.prix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
