import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@scholar/types';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthFunctions } from '../hooks/useAuthFunctions';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, setUser, setIsLoading } = useAuthState();
  const { login, register, logout } = useAuthFunctions(setUser, setIsLoading);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 