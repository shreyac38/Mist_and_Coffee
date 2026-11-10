import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve from Vite environment variables or localStorage (for dynamic connection testing)
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('mist_supabase_url') || '' : '';
const storedAnonKey = typeof window !== 'undefined' ? localStorage.getItem('mist_supabase_key') || '' : '';

export const supabaseUrl = envUrl || storedUrl;
export const supabaseAnonKey = envAnonKey || storedAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('placeholder')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabase = null;
  }
}

export function saveRuntimeSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mist_supabase_url', url.trim());
    localStorage.setItem('mist_supabase_key', key.trim());
    window.location.reload();
  }
}

export function clearRuntimeSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mist_supabase_url');
    localStorage.removeItem('mist_supabase_key');
    window.location.reload();
  }
}
