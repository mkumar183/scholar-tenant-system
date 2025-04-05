
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// These values come from Supabase integration
const supabaseUrl = "https://wdzjwyloumvdwtyoadqm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkemp3eWxvdW12ZHd0eW9hZHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NDgwMTksImV4cCI6MjA1OTMyNDAxOX0.uksNaWRHm2d6UmGtIATEGabdApYC58SMzM7TrmwmdM0";

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    },
    global: {
      fetch: (url, options) => {
        // Custom fetch with timeout to better handle connectivity issues
        const controller = new AbortController();
        const { signal } = controller;
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const fetchOptions = { ...options, signal };
        
        return fetch(url, fetchOptions)
          .then(response => {
            clearTimeout(timeoutId);
            return response;
          })
          .catch(error => {
            clearTimeout(timeoutId);
            console.error('Supabase fetch error:', error);
            throw error;
          });
      }
    }
  }
);

// Helper function to check Supabase connectivity
export const checkSupabaseConnection = async () => {
  try {
    console.log('Testing connection to Supabase...');
    // Simple query to check if we can connect to Supabase
    const { data, error } = await supabase.from('tenants').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test error:', error);
      return { connected: false, error: error.message };
    }
    console.log('Supabase connection successful');
    return { connected: true, error: null };
  } catch (err: any) {
    console.error('Supabase connection test exception:', err);
    return { connected: false, error: err.message || 'Unknown connection error' };
  }
};
