import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofirvweirnjgsyyedkci.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let clientInstance: any = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  const url = supabaseUrl && !supabaseUrl.includes("aBcDe") 
    ? supabaseUrl 
    : "https://ofirvweirnjgsyyedkci.supabase.co";

  const key = supabaseAnonKey && supabaseAnonKey.length > 20 
    ? supabaseAnonKey 
    : "missing-anon-key";

  try {
    clientInstance = createBrowserClient(url, key);
    return clientInstance;
  } catch (e) {
    console.error("Error creating browser client:", e);
    return createBrowserClient("https://ofirvweirnjgsyyedkci.supabase.co", "missing-anon-key");
  }
}
