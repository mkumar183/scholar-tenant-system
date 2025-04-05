
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth.types';

export const useAuthFunctions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  const register = async (email: string, password: string, name: string, role: 'admin' | 'school_admin' | 'teacher' | 'student' = 'student') => {
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
              role: role, // Use the provided role or default to student
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

  return { login, register, logout };
};
