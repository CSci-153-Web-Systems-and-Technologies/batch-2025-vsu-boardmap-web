// client.tsx - FIXED VERSION
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton instance
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  // Return existing client if it already exists
  if (supabaseClient) {
    return supabaseClient;
  }
  
  // Log for debugging
  console.log('Creating Supabase client for project:', projectId);
  
  const supabaseUrl = `https://${projectId}.supabase.co`;
  
  // Validate URL format
  if (!projectId || projectId.includes(' ') || projectId.length < 10) {
    console.error('Invalid Supabase project ID:', projectId);
    throw new Error('Invalid Supabase project ID configuration');
  }
  
  if (!publicAnonKey || publicAnonKey.length < 20) {
    console.error('Invalid Supabase anon key');
    throw new Error('Invalid Supabase anon key configuration');
  }
  
  // Create the singleton instance
  supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      fetch: (...args) => {
        // Add timeout to fetch requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Ensure we pass at most two arguments to fetch: resource and init
        const [resource, init] = args as [RequestInfo, RequestInit?];
        const mergedInit = { ...(init || {}), signal: controller.signal };

        return fetch(resource, mergedInit)
          .finally(() => clearTimeout(timeoutId));
      }
    }
  });
  
  return supabaseClient;
}

// Export a default instance
export const supabase = createClient();