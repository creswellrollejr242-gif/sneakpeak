import { createClient } from '@supabase/supabase-js';

// Access environment variables via Vite's import.meta.env
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);