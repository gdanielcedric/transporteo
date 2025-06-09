import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Paiement {
  id: string;
  reservationId: string;
  montant: number;
  datePaiement: string;
  statut: string;
}

export default function Paiements() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPaiements() {
      setLoading(true);
      try {
        const res = await api.get('/admin/paiements');
        setPaiements(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPaiements();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paiements</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Réservation ID</th>
              <th className="py-2 px-4 text-left">Montant</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{p.id}</td>
                <td className="py-2 px-4">{p.reservationId}</td>
                <td className="py-2 px-4">{p.montant} F CFA</td>
                <td className="py-2 px-4">{new Date(p.datePaiement).toLocaleDateString()}</td>
                <td className="py-2 px-4">{p.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
