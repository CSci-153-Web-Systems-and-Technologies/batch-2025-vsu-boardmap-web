import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey, supabaseUrl } from "./info";

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

function validateConfig() {
  if (!projectId || projectId.includes(" ") || projectId.length < 10) {
    throw new Error("Invalid Supabase project ID configuration");
  }

  if (!publicAnonKey || publicAnonKey.length < 20) {
    throw new Error("Invalid Supabase anon key configuration");
  }
}

function buildClientOptions(accessToken?: string) {
  return {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce" as const,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
      fetch: (...args) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const [resource, init] = args as [RequestInfo, RequestInit?];

        return fetch(resource, {
          ...(init || {}),
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));
      },
    },
  };
}

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  validateConfig();

  supabaseInstance = createSupabaseClient(
    supabaseUrl,
    publicAnonKey,
    buildClientOptions()
  );

  return supabaseInstance;
}

export function createAuthenticatedClient(accessToken?: string) {
  validateConfig();

  if (!accessToken) {
    return createClient();
  }

  return createSupabaseClient(
    supabaseUrl,
    publicAnonKey,
    buildClientOptions(accessToken)
  );
}

export const supabase = createClient();
