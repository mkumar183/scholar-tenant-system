
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
    }
  }
);

// Helper function to check Supabase connectivity
export const checkSupabaseConnection = async () => {
  try {
    // Simple query to check if we can connect to Supabase
    const { data, error } = await supabase.from('tenants').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase connection test exception:', err);
    return false;
  }
};
