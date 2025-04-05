
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile on auth state change
          try {
            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching user profile:', error);
              return;
            }
            
            if (profile) {
              // Set user with profile data
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || '',
                role: profile.role,
                tenantId: profile.tenant_id,
                schoolId: profile.school_id
              });
            }
          } catch (error) {
            console.error('Error in profile fetch:', error);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            // Set user with profile data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: profile.role,
              tenantId: profile.tenant_id,
              schoolId: profile.school_id
            });
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading, setUser, setIsLoading };
};
