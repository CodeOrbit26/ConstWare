import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function isValid(val: string | undefined): boolean {
  if (!val) return false
  const clean = val.trim().toLowerCase()
  return clean !== "" && clean !== "undefined" && clean !== "null"
}

export function createClient() {
  const cookieStore = cookies()
  const supabaseUrl = isValid(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : "https://placeholder.supabase.co"
  const supabaseAnonKey = isValid(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : "placeholder-key"

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
