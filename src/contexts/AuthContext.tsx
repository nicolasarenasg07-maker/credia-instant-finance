import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'SME' | 'ADMIN';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - will be replaced with actual API calls
const mockUsers: Record<string, User> = {
  'admin@credia.com': {
    id: 'admin-1',
    email: 'admin@credia.com',
    name: 'Admin User',
    role: 'ADMIN',
    avatarInitials: 'AU',
  },
  'sme@company.com': {
    id: 'sme-1',
    email: 'sme@company.com',
    name: 'John Smith',
    role: 'SME',
    avatarInitials: 'JS',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing session
    const stored = localStorage.getItem('credia_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    // Default to SME user for demo
    return mockUsers['sme@company.com'];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('credia_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('credia_user');
    }
  }, [user]);

  const login = async (email: string, _password: string) => {
    // Mock login - in production this would call /api/auth/login
    const foundUser = mockUsers[email];
    if (foundUser) {
      setUser(foundUser);
    } else {
      // Default to SME role for any email
      setUser({
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'SME',
        avatarInitials: email.substring(0, 2).toUpperCase(),
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('credia_user');
  };

  // For demo purposes - allows switching between roles
  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
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
