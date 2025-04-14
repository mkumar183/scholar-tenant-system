
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'tenant_admin' | 'school_admin' | 'teacher' | 'staff' | 'student' | 'parent';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if no user
        console.log('No user found, redirecting to login');
        navigate('/login');
      } else if (!user.role) {
        // If user exists but has no role, redirect to settings to complete profile
        console.log('User has no role, redirecting to settings');
        navigate('/settings');
      } else if (requiredRole && user.role !== requiredRole) {
        // Check if role is superadmin and the required role is privileged
        const isSuperadminAccessingPrivilegedRole = 
          user.role === 'superadmin' && 
          ['tenant_admin', 'school_admin', 'teacher', 'staff', 'student', 'parent'].includes(requiredRole);
        
        // If not superadmin accessing privileged role, redirect to dashboard
        if (!isSuperadminAccessingPrivilegedRole) {
          console.log('User does not have required role, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          setShouldRender(true);
        }
      } else {
        // User has permission, render children
        setShouldRender(true);
      }
    }
  }, [user, isLoading, navigate, requiredRole]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (shouldRender) {
    return <>{children}</>;
  }

  return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
};

export default ProtectedRoute;
