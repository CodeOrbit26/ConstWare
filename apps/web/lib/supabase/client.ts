import { createBrowserClient } from "@supabase/ssr"

function isValid(val: string | undefined): boolean {
  if (!val) return false
  const clean = val.trim().toLowerCase()
  return clean !== "" && clean !== "undefined" && clean !== "null"
}

export function createClient() {
  const supabaseUrl = isValid(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : "https://placeholder.supabase.co"
  const supabaseAnonKey = isValid(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : "placeholder-key"
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
