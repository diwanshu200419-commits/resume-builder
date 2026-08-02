import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofirvweirnjgsyyedkci.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maXJ2d2Vpcm5qZ3N5eWVka2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDc4NzYxMSwiZXhwIjoyMTAwMzYzNjExfQ.fJKKqs0Psp0Tg3IBN5UTQsRY4EpjungqCspoJdI3AG0";

export async function createClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey || serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function createServiceClient() {
  return createSupabaseJsClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
