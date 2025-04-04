
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'school_admin' | 'teacher' | 'student';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [user, setUser] = useState<{ id: string; profile?: Profile | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          // No active session
          setUser(null);
          return;
        }

        // User is authenticated, get their profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - this is handled below
          throw profileError;
        }

        setUser({
          id: session.user.id,
          profile: profile || null
        });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if no user
        navigate('/login');
      } else if (requiredRole && user.profile?.role !== requiredRole) {
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
