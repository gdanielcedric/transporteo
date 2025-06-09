import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Voyages from './pages/Voyages';
import Lignes from './pages/Lignes';
import Reservations from './pages/Reservations';
import Paiements from './pages/Paiements';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

// Wrapper layout conditionnel
function LayoutWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login';

  return (
    <div className="flex h-screen bg-gray-100">
      {!hideLayout && <Sidebar />}
      <div className="flex flex-col flex-1">
        {!hideLayout && <Header />}
        <main className="p-4 overflow-auto flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/voyages"
              element={
                <PrivateRoute>
                  <Voyages />
                </PrivateRoute>
              }
            />
            <Route
              path="/lignes"
              element={
                <PrivateRoute>
                  <Lignes />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <PrivateRoute>
                  <Reservations />
                </PrivateRoute>
              }
            />
            <Route
              path="/paiements"
              element={
                <PrivateRoute>
                  <Paiements />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </AuthProvider>
  );
}
