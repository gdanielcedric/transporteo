import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

  const navigate = useNavigate();

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

  const exportCSV = () => {
    const csvRows = lignes.map(item => `${item.id},${item.villeDepart},${item.villeArrivee},${item.duree}, ,${item.prix}`).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'export_lignes.csv');
    a.click();
  };

  // Export en Excel
  const exportExcel = () => {
    // Exclure certains champs, par exemple exclure "email"
    const filteredForExcel = lignes.map(({ id, villeDepart, villeArrivee, duree, prix}) => ({
      id,
      villeDepart,
      villeArrivee,
      duree,
      prix
    }));
    const ws = XLSX.utils.json_to_sheet(filteredForExcel); // Crée la feuille avec les champs filtrés
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "export_lignes.xlsx");
  };

  // Export en PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Ajouter un titre en dessous du logo
    doc.setFontSize(16);
    doc.text("Liste des lignes", 60, 25); // Position du titre

    // Ajouter un tableau avec autoTable
    autoTable(doc, {
      startY: 50, // Commencer le tableau sous l'entête
      head: [['ID','Ville Depart','Ville Arrivée', 'Durée', 'Prix']], // En-tête du tableau
      body: lignes.map((item) => [item.id, item.villeDepart, item.villeArrivee, item.duree, item.prix]), // Corps du tableau
    });

    // Exporter le PDF
    doc.save("export_lignes.pdf");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lignes</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="inset-0 flex items-center justify-center" style={{ marginBottom: '20px' }}>
            <div className="p-6 rounded-lg shadow-lg">
              <div className="flex justify-between mt-4">
                <button onClick={() => navigate('/lignes/ajouter')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
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
        </>
        
      )}
    </div>
  );
}
