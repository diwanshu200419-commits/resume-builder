export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  if (!raw) return raw;
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}
