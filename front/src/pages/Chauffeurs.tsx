import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Chauffeur {
  id: string;
  nom: string;
  telephone: string;
}

export default function Chauffeurs() {
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // get authenticated user
  const { user } = useAuth();
  //config
  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    async function fetchChauffeurs() {
      setLoading(true);
      try {
        const res = await api.get('/admin/chauffeurs', config);
        setChauffeurs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChauffeurs();
  }, []);

  const exportCSV = () => {
    const csvRows = chauffeurs.map(item => `${item.id},${item.nom},${item.telephone}`).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'export_chauffeurs.csv');
    a.click();
  };

  // Export en Excel
  const exportExcel = () => {
    // Exclure certains champs, par exemple exclure "email"
    const filteredForExcel = chauffeurs.map(({ id, nom, telephone}) => ({
      id,
      nom,
      telephone
    }));
    const ws = XLSX.utils.json_to_sheet(filteredForExcel); // Crée la feuille avec les champs filtrés
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "export_chauffeurs.xlsx");
  };

  // Export en PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Ajouter un titre en dessous du logo
    doc.setFontSize(16);
    doc.text("Liste des chauffeurs", 60, 25); // Position du titre

    // Ajouter un tableau avec autoTable
    autoTable(doc, {
      startY: 50, // Commencer le tableau sous l'entête
      head: [['ID','Nom','Telephone']], // En-tête du tableau
      body: chauffeurs.map((item) => [item.id, item.nom, item.telephone]), // Corps du tableau
    });

    // Exporter le PDF
    doc.save("export_chauffeurs.pdf");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chauffeurs</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="inset-0 flex items-center justify-center" style={{ marginBottom: '20px' }}>
            <div className="p-6 rounded-lg shadow-lg">
              <div className="flex justify-between mt-4">
                <button onClick={() => navigate('/chauffeurs/ajouter')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
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
                <th className="py-2 px-4 text-left">Nom</th>
                <th className="py-2 px-4 text-left">Telephone</th>
              </tr>
            </thead>
            <tbody>
              {chauffeurs.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{c.id}</td>
                  <td className="py-2 px-4">{c.nom}</td>
                  <td className="py-2 px-4">{c.telephone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
        
      )}
    </div>
  );
}
