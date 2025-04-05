import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'tenant_admin' | 'school_admin' | 'teacher' | 'staff' | 'student' | 'parent';
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
        // Check if role is superadmin and the required role is privileged
        const isSuperadminAccessingPrivilegedRole = 
          user.role === 'superadmin' && 
          ['tenant_admin', 'school_admin', 'teacher', 'staff', 'student', 'parent'].includes(requiredRole);
        
        // If not superadmin accessing privileged role, redirect to dashboard
        if (!isSuperadminAccessingPrivilegedRole) {
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
  // 2. User is superadmin (can access any role's routes)
  if (user && (
    !requiredRole || 
    user.role === requiredRole || 
    (user.role === 'superadmin' && ['tenant_admin', 'school_admin', 'teacher', 'staff', 'student', 'parent'].includes(requiredRole))
  )) {
    return <>{children}</>;
  }

  return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
};

export default ProtectedRoute;
