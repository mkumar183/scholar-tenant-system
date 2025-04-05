
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
          setTimeout(async () => {
            try {
              // First get the direct user profile
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
                // If user is a tenant_admin but has no tenant_id, try to find their tenant
                if (profile.role === 'tenant_admin' && !profile.tenant_id) {
                  console.log('Tenant admin found with no tenant_id, searching for their tenant...');
                  const { data: tenantData, error: tenantError } = await supabase
                    .from('tenants')
                    .select('id')
                    .eq('admin_id', session.user.id)
                    .maybeSingle();
                  
                  if (tenantError) {
                    console.error('Error fetching tenant for admin:', tenantError);
                  } else if (tenantData) {
                    console.log('Found tenant for admin:', tenantData.id);
                    
                    // Update the user's profile with the tenant_id
                    const { error: updateError } = await supabase
                      .from('users')
                      .update({ tenant_id: tenantData.id })
                      .eq('id', session.user.id);
                    
                    if (updateError) {
                      console.error('Error updating user with tenant_id:', updateError);
                    } else {
                      // Set updated profile with tenant_id
                      setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: profile.name || '',
                        role: profile.role,
                        tenantId: tenantData.id,
                        schoolId: profile.school_id
                      });
                      return; // Exit early since we've set the user
                    }
                  }
                }
                
                // Set user with original profile data
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
          }, 0);
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
          // First get basic profile
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            // If user is a tenant_admin but has no tenant_id, try to find their tenant
            if (profile.role === 'tenant_admin' && !profile.tenant_id) {
              console.log('Tenant admin found with no tenant_id on init, searching for their tenant...');
              const { data: tenantData, error: tenantError } = await supabase
                .from('tenants')
                .select('id')
                .eq('admin_id', session.user.id)
                .maybeSingle();
              
              if (tenantError) {
                console.error('Error fetching tenant for admin:', tenantError);
              } else if (tenantData) {
                console.log('Found tenant for admin on init:', tenantData.id);
                
                // Update the user's profile with the tenant_id
                const { error: updateError } = await supabase
                  .from('users')
                  .update({ tenant_id: tenantData.id })
                  .eq('id', session.user.id);
                
                if (updateError) {
                  console.error('Error updating user with tenant_id:', updateError);
                } else {
                  // Set updated profile with tenant_id
                  setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: profile.name || '',
                    role: profile.role,
                    tenantId: tenantData.id,
                    schoolId: profile.school_id
                  });
                  setIsLoading(false);
                  return; // Exit early since we've set the user
                }
              }
            }
            
            // Set user with original profile data
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
