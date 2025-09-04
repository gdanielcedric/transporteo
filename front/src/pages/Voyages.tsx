import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

  const navigate = useNavigate();

  // get authenticated user
  const { user } = useAuth();
  //config
  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    async function fetchVoyages() {
      setLoading(true);
      try {
        const res = await api.get('/admin/voyages', config);
        setVoyages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVoyages();
  }, []);

  const exportCSV = () => {
    const csvRows = voyages.map(item => `${item.id},${item.ligneId},${item.dateDepart},${item.heureDepart},${item.nombrePlacesDisponibles}`).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'export_voyages.csv');
    a.click();
  };

  // Export en Excel
  const exportExcel = () => {
    // Exclure certains champs, par exemple exclure "email"
    const filteredForExcel = voyages.map(({ id, ligneId, dateDepart, heureDepart, nombrePlacesDisponibles}) => ({
      id,
      ligneId,
      dateDepart,
      heureDepart,
      nombrePlacesDisponibles
    }));
    const ws = XLSX.utils.json_to_sheet(filteredForExcel); // Crée la feuille avec les champs filtrés
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "export_voyages.xlsx");
  };

  // Export en PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Ajouter un titre en dessous du logo
    doc.setFontSize(16);
    doc.text("Liste des voyages", 60, 25); // Position du titre

    // Ajouter un tableau avec autoTable
    autoTable(doc, {
      startY: 50, // Commencer le tableau sous l'entête
      head: [['ID','Ligne ID','Date Depart', 'Heure Depart', 'Nombre de Places']], // En-tête du tableau
      body: voyages.map((item) => [item.id, item.ligneId, item.dateDepart, item.heureDepart, item.nombrePlacesDisponibles]), // Corps du tableau
    });

    // Exporter le PDF
    doc.save("export_voyages.pdf");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Voyages</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="inset-0 flex items-center justify-center" style={{ marginBottom: '20px' }}>
            <div className="p-6 rounded-lg shadow-lg">
              <div className="flex justify-between mt-4">
                <button onClick={() => navigate('/voyages/ajouter')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Ajouter +
                </button>
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
        </>
        
      )}
    </div>
  );
}
