import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  username: string;
  token: string;
  expiration: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔁 Charger depuis sessionStorage au démarrage
  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored) as User;
      if (parsed.expiration > Date.now()) {
        setUser(parsed);
      } else {
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const loginEndpoint = 'https://localhost:44339/api/auth/login'; // adapter si besoin
      const response = await axios.post(loginEndpoint, { username, password });

      if (response.status === 200) {
        const userData: User = {
          username: username,
          token: response.data.access_token,
          expiration: response.data.expires_in, // Convertir en timestamp
        };

        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
    } catch (err) {
      console.error('Erreur login', err);
    }

    return false;
  }

  function logout() {
    sessionStorage.removeItem('user');
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}