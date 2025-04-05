
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      } else if (!user.role) {
        // If user exists but has no role, redirect to settings to complete profile
        navigate('/settings');
      } else if (requiredRole && user.role !== requiredRole) {
        // Check if role is admin and the required role is privileged (school_admin, teacher, or student)
        const isAdminAccessingPrivilegedRole = 
          user.role === 'admin' && 
          ['school_admin', 'teacher', 'student'].includes(requiredRole);
        
        // If not admin accessing privileged role, redirect to dashboard
        if (!isAdminAccessingPrivilegedRole) {
          navigate('/dashboard');
        }
      }
    }
  }, [user, isLoading, navigate, requiredRole]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Render children if:
  // 1. User exists and has the required role, OR
  // 2. User is admin (can access any role's routes)
  if (user && (
    !requiredRole || 
    user.role === requiredRole || 
    (user.role === 'admin' && ['school_admin', 'teacher', 'student'].includes(requiredRole))
  )) {
    return <>{children}</>;
  }

  return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
};

export default ProtectedRoute;
