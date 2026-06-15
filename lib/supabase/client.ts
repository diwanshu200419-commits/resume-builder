import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl } from "@/lib/supabase/url";

export function createClient() {
  const url = getSupabaseUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }
  return createBrowserClient(url, key);
}
