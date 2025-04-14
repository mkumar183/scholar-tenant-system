
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
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Add console logs to help with debugging
    console.log('ProtectedRoute: User state:', user);
    console.log('ProtectedRoute: Loading state:', isLoading);
    
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
      setCheckComplete(true);
    }
  }, [user, isLoading, navigate, requiredRole]);

  // Only show loading indicator when actively checking the auth state
  if (isLoading && !checkComplete) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (shouldRender) {
    return <>{children}</>;
  }

  // Only show redirect message when check is complete but rendering isn't allowed
  if (checkComplete && !shouldRender) {
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }
  
  // Return empty during transitional states to prevent flicker
  return null;
};

export default ProtectedRoute;
