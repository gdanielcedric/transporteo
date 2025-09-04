import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

  // get authenticated user
  const { user } = useAuth();
  //config
  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      try {
        const res = await api.get('/mobile/reservations', config);
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  const exportCSV = () => {
    const csvRows = reservations.map(item => `${item.id},${item.voyageId},${item.utilisateurId},${item.nombrePlaces},${item.dateReservation}`).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'export_reservations.csv');
    a.click();
  };

  // Export en Excel
  const exportExcel = () => {
    // Exclure certains champs, par exemple exclure "email"
    const filteredForExcel = reservations.map(({ id, voyageId, utilisateurId, nombrePlaces, dateReservation}) => ({
      id,
      voyageId,
      utilisateurId,
      nombrePlaces,
      dateReservation: new Date(dateReservation).toLocaleDateString() // Formater la date pour Excel
    }));
    const ws = XLSX.utils.json_to_sheet(filteredForExcel); // Crée la feuille avec les champs filtrés
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "export_reservations.xlsx");
  };

  // Export en PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Ajouter un titre en dessous du logo
    doc.setFontSize(16);
    doc.text("Liste des reservations", 60, 25); // Position du titre

    // Ajouter un tableau avec autoTable
    autoTable(doc, {
      startY: 50, // Commencer le tableau sous l'entête
      head: [['ID','Voyage ID','Utilisateur ID','Nombre de Places', 'Date de Reservation']], // En-tête du tableau
      body: reservations.map((item) => [item.id, item.voyageId, item.utilisateurId, item.nombrePlaces, item.dateReservation]), // Corps du tableau
    });

    // Exporter le PDF
    doc.save("export_reservations.pdf");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Réservations</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="inset-0 flex items-center justify-center" style={{ marginBottom: '20px' }}>
            <div className="p-6 rounded-lg shadow-lg">
              <div className="flex justify-between mt-4">
                <button onClick={exportCSV} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Exporter CSV
                </button>
                <button onClick={exportExcel} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                  Exporter Excel
                </button>
                <button onClick={exportPDF} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                  Exporter PDF
                </button>
              </div>
            </div>
          </div>
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
        </>        
)}
</div>
);
}