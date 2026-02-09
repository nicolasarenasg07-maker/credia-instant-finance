import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TODO: replace mock with real backend (Supabase/Firebase)

export type UserRole = 'SME' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
  companyName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsSME: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'credia_user';

// Demo user presets
const demoSME: User = {
  id: 'sme-001',
  email: 'sme@company.com',
  name: 'John Smith',
  role: 'SME',
  avatarInitials: 'JS',
  companyName: 'TechFlow Solutions',
};

const demoAdmin: User = {
  id: 'admin-1',
  email: 'admin@credia.com',
  name: 'Admin User',
  role: 'ADMIN',
  avatarInitials: 'AU',
  companyName: 'credIA',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    // NOT logged in by default — must use demo buttons
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _password: string) => {
    // Simulated login — map known emails, default to SME
    if (email === 'admin@credia.com') {
      setUser(demoAdmin);
    } else {
      setUser({
        ...demoSME,
        email,
        name: email.split('@')[0],
        avatarInitials: email.substring(0, 2).toUpperCase(),
      });
    }
  };

  const loginAsSME = () => setUser(demoSME);
  const loginAsAdmin = () => setUser(demoAdmin);

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const base = role === 'ADMIN' ? demoAdmin : demoSME;
      setUser({ ...base, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        loginAsSME,
        loginAsAdmin,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
