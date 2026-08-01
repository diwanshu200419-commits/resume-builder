import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofirvweirnjgsyyedkci.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  if (
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("example.com") &&
    !supabaseUrl.includes("ixrlxjwwcpxacovdsdnu")
  ) {
    try {
      return createBrowserClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn("Failed to initialize Supabase browser client, falling back to mock client.");
    }
  }

  // Fallback Mock Client
  return {
    auth: {
      getUser: async () => {
        const token = typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("mock-session-id="))
              ?.split("=")[1]
          : null;

        if (!token) return { data: { user: null }, error: null };

        try {
          const res = await fetch("/api/mock-db");
          return await res.json();
        } catch (e: any) {
          return { data: { user: null }, error: e };
        }
      },
      signInWithPassword: async ({ email, password }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signInWithPassword",
              payload: { email, password },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          return result;
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signUp: async ({ email, password, options }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signUp",
              payload: { email, password, full_name: options?.data?.full_name },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          return result;
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signInWithOAuth: async ({ provider, options }: any) => {
        const supabaseCallback = "https://ofirvweirnjgsyyedkci.supabase.co/auth/v1/callback";
        const redirectUri = encodeURIComponent(supabaseCallback);
        const googleClientId = "240368883912-158f4vu7a813eorkkd34os6f54l73jpe.apps.googleusercontent.com";
        const promptParam = options?.queryParams?.prompt || "select_account";
        const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&prompt=${promptParam}`;

        return {
          data: { url: oauthUrl, provider: "google" },
          error: null,
        };
      },
      signInWithOtp: async ({ phone }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signInWithOtp",
              payload: { phone },
            }),
          });
          return await res.json();
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      verifyOtp: async ({ phone, token }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "verifyOtp",
              payload: { phone, token },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          return result;
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signOut: async () => {
        if (typeof document !== "undefined") {
          document.cookie = "mock-session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return { error: null };
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            const res = await fetch("/api/mock-db");
            const data = await res.json();
            return { data: data.data.profile, error: null };
          },
        }),
      }),
    }),
  } as any;
}
