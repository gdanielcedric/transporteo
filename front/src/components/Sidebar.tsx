import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/bus', label: 'Bus' },
  { to: '/chauffeurs', label: 'Chauffeurs' },
  { to: '/lignes', label: 'Lignes' },
  { to: '/paiements', label: 'Paiements' },
  { to: '/reservations', label: 'Réservations' },
  { to: '/voyages', label: 'Voyages' },
];

export default function Sidebar() {
  return (
    <nav className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Transporteo Admin</h1>
      <ul className="flex flex-col gap-3">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'block px-4 py-2 rounded bg-blue-500 text-white font-semibold'
                  : 'block px-4 py-2 rounded hover:bg-blue-100'
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
