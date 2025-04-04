
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'school_admin' | 'teacher' | 'student';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if no user
        navigate('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        // Redirect to dashboard if user doesn't have required role
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate, requiredRole]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
