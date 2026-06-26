import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/contractor/dashboard"

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Determine redirect based on user role
      const role = data.user.user_metadata?.role || "contractor"
      const redirectTo = role === "supervisor" 
        ? "/supervisor/dashboard" 
        : "/contractor/dashboard"
      
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
