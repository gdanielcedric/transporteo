import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Bus {
  id: string;
  marque: string;
  matricule: string;
  nombreDePlaces: number;
}

export default function Buses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // get authenticated user
  const { user } = useAuth();
  //config
  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    async function fetchBuses() {
      setLoading(true);
      try {
        const res = await api.get('/admin/bus', config);
        setBuses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBuses();
  }, []);

  const exportCSV = () => {
    const csvRows = buses.map(item => `${item.id},${item.marque},${item.matricule},${item.nombreDePlaces}`).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'export_buses.csv');
    a.click();
  };

  // Export en Excel
  const exportExcel = () => {
    // Exclure certains champs, par exemple exclure "email"
    const filteredForExcel = buses.map(({ id, marque, matricule, nombreDePlaces}) => ({
      id,
      marque,
      matricule,
      nombreDePlaces
    }));
    const ws = XLSX.utils.json_to_sheet(filteredForExcel); // Crée la feuille avec les champs filtrés
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "export_buses.xlsx");
  };

  // Export en PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Ajouter un titre en dessous du logo
    doc.setFontSize(16);
    doc.text("Liste des bus", 60, 25); // Position du titre

    // Ajouter un tableau avec autoTable
    autoTable(doc, {
      startY: 50, // Commencer le tableau sous l'entête
      head: [['ID','Marque','Matricule','Nombre de places']], // En-tête du tableau
      body: buses.map((item) => [item.id, item.marque, item.matricule, item.nombreDePlaces]), // Corps du tableau
    });

    // Exporter le PDF
    doc.save("export_buses.pdf");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bus</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="inset-0 flex items-center justify-center" style={{ marginBottom: '20px' }}>
            <div className="p-6 rounded-lg shadow-lg">
              <div className="flex justify-between mt-4">
                <button onClick={() => navigate('/bus/ajouter')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
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
                <th className="py-2 px-4 text-left">marque</th>
                <th className="py-2 px-4 text-left">Matricule</th>
                <th className="py-2 px-4 text-left">Places dispo</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{b.id}</td>
                  <td className="py-2 px-4">{b.marque}</td>
                  <td className="py-2 px-4">{b.matricule}</td>
                  <td className="py-2 px-4">{b.nombreDePlaces}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>        
      )}
    </div>
  );
}
