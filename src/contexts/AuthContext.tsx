import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  logout: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile on auth state change
          setTimeout(async () => {
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
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;

      if (data.user) {
        // Fetch user profile after successful login
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }
        
        if (profile) {
          const userData = {
            id: data.user.id,
            email: data.user.email || '',
            name: profile.name || '',
            role: profile.role || 'student', // Default to student if no role
            tenantId: profile.tenant_id,
            schoolId: profile.school_id
          };
          
          setUser(userData);
          console.log('User logged in:', userData);
        } else {
          console.error('No profile found for user');
          throw new Error('User profile not found');
        }
      }

      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      
      if (authData.user) {
        console.log('Auth user created:', authData.user);
        
        // Step 2: Create a user profile (users table entry)
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              name: name,
              role: 'student', // Default role
            }
          ])
          .select();
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Account created but profile setup failed. Please contact support.');
        } else {
          console.log('Profile created:', profileData);
          toast.success('Registration successful! Please check your email to confirm your account.');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Registration failed: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.info('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed: ' + error.message);
    }
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
