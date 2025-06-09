import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  role: 'Admin' | 'SuperAdmin' | 'User';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Simuler une connexion, à remplacer par appel réel API d'authentification
  async function login(email: string, password: string) {
    // Exemple simple, acceptons tout
    if (email && password) {
      setUser({ email, role: 'Admin' });
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
