
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'school_admin' | 'teacher' | 'student';
  tenantId?: string;
  schoolId?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'password',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'school@example.com',
    name: 'School Admin',
    password: 'password',
    role: 'school_admin' as const,
    tenantId: 'tenant-1',
  },
  {
    id: '3',
    email: 'teacher@example.com',
    name: 'Teacher User',
    password: 'password',
    role: 'teacher' as const,
    tenantId: 'tenant-1',
    schoolId: 'school-1',
  },
  {
    id: '4',
    email: 'student@example.com',
    name: 'Student User',
    password: 'password',
    role: 'student' as const,
    tenantId: 'tenant-1',
    schoolId: 'school-1',
  },
];

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(user => user.email === email && user.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = MOCK_USERS.some(user => user.email === email);
      
      if (userExists) {
        throw new Error('User already exists');
      }
      
      // In a real app, this would create a user in the database
      toast.success('Registration successful! Please log in.');
    } catch (error) {
      toast.error('Registration failed: ' + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

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
