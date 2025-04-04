
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// These values come from Supabase integration
const supabaseUrl = "https://wdzjwyloumvdwtyoadqm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkemp3eWxvdW12ZHd0eW9hZHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NDgwMTksImV4cCI6MjA1OTMyNDAxOX0.uksNaWRHm2d6UmGtIATEGabdApYC58SMzM7TrmwmdM0";

// Initialize the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
