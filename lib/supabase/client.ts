import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofirvweirnjgsyyedkci.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let clientInstance: any = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
      return clientInstance;
    } catch (e) {
      console.warn("Failed to initialize Supabase browser client:", e);
    }
  }

  // Fallback if env vars are missing
  clientInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey || "dummy-anon-key-set-env-var"
  );
  return clientInstance;
}
