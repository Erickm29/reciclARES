import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder = supabaseAnonKey === "your_supabase_anon_key_here";

/** Cliente Supabase singleton — usado en cliente y servidor. */
export const supabaseClient =
  supabaseUrl && supabaseAnonKey && !isPlaceholder
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local"
    );
  }
  return supabaseClient;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey && !isPlaceholder);
}

