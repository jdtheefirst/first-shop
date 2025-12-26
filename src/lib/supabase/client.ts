"use client";

import { createBrowserClient as createBrowserClientBase } from "@supabase/ssr";

let supabaseInstance: ReturnType<typeof createBrowserClientBase> | null = null; // /lib/supabase/client.ts - Updated version

export function createSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }
  return (supabaseInstance = createBrowserClientBase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieEncoding: "base64url",
      auth: {
        flowType: "pkce",
        autoRefreshToken: false, // Keep this!
        detectSessionInUrl: false,
        persistSession: true,
      },
      global: {
        headers: {
          "X-Client-Info": "shop-example/1.0.0",
        },
      },
    }
  ));
}

// Export a single instance
export const supabase = createSupabaseClient();
export type SupabaseClientType = ReturnType<typeof createSupabaseClient>;
