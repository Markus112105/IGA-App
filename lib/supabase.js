import { createClient } from "@supabase/supabase-js";

let supabase = globalThis._team19_supabase_admin;

export function getSupabaseAdmin() {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      throw new Error("SUPABASE_URL is not defined");
    }

    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
    }

    supabase = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });

    globalThis._team19_supabase_admin = supabase;
  }

  return supabase;
}
