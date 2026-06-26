"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

import { checkIsMockAuth } from "@/lib/auth/mockAuth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router   = useRouter()
  const pathname = usePathname()

  const [error, setError] = useState<string | null>(null)

  // Track whether we've done the very first auth check
  const initialised = useRef(false)

  useEffect(() => {
    const isMock = checkIsMockAuth()

    const checkUser = async () => {
      let activeUser: any = null

      try {
        if (isMock) {
          const { getMockSession } = await import("@/lib/auth/mockAuth")
          activeUser = getMockSession()
        } else {
          const supabase = createClient()
          const { data: { user: supabaseUser }, error: supabaseErr } = await supabase.auth.getUser()
          if (supabaseErr) throw supabaseErr
          activeUser = supabaseUser
        }
        setUser(activeUser)
        setError(null)
      } catch (e: any) {
        console.error("Auth Guard initialization failed:", e)
        setError(e?.message || "Failed to load authenticated node session. Please verify connection credentials.")
        setLoading(false)
        return
      }

      // ── If we already know the user, don't show loading again ──
      if (initialised.current) {
        const path = pathname
        if (!activeUser) {
          if (!path.startsWith("/client/") && path !== "/login" && path !== "/register" && path !== "/") {
            router.push("/login")
          }
        } else {
          const role = activeUser.user_metadata?.role || activeUser.role
          if (path.startsWith("/contractor") && role !== "contractor") router.push("/login")
          else if (path.startsWith("/supervisor") && role !== "supervisor") router.push("/login")
        }
        setLoading(false)
        return
      }

      // ── First ever check — show loading spinner ──
      initialised.current = true
      const path = pathname

      if (path === "/login" || path === "/register" || path === "/") {
        if (activeUser && path !== "/") {
          const role = activeUser.user_metadata?.role || activeUser.role
          if (role === "contractor") router.push("/contractor/dashboard")
          else if (role === "supervisor") router.push("/supervisor/dashboard")
        }
        setLoading(false)
        return
      }

      if (!activeUser) {
        if (!path.startsWith("/client/")) router.push("/login")
        setLoading(false)
        return
      }

      const role = activeUser.user_metadata?.role || activeUser.role
      if (path.startsWith("/contractor") && role !== "contractor") router.push("/login")
      else if (path.startsWith("/supervisor") && role !== "supervisor") router.push("/login")

      setLoading(false)
    }

    checkUser()

    if (!isMock) {
      const supabase = createClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user && !["/login", "/register", "/"].includes(pathname) && !pathname.startsWith("/client/")) {
          router.push("/login")
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [pathname])  // eslint-disable-line react-hooks/exhaustive-deps

  // Error Diagnostics fallback
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white p-4 selection:bg-rose-500/10 selection:text-rose-400">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-sm bg-slate-900/30 backdrop-blur-xl border border-rose-500/20 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-rose-950/5">
          {/* Animated red shield with ring pulse */}
          <div className="relative h-16 w-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-rose-500/10 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-rose-500/20" />
            <div className="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 leading-none">Security Alert</h3>
            <h2 className="text-lg font-black text-white uppercase tracking-tight italic pt-1">Gateway Failure</h2>
          </div>

          <div className="w-full bg-slate-950/60 border border-slate-850 rounded-2xl p-4 text-left">
            <p className="text-[9px] font-mono text-rose-400 dark:text-rose-300 font-semibold leading-relaxed break-words">
              {error}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5 w-full">
            <Button 
              onClick={() => {
                setError(null)
                setLoading(true)
                if (typeof window !== "undefined") window.location.reload()
              }}
              className="w-full h-12 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-600/10 active:scale-95 flex items-center justify-center"
            >
              Reset Session Connection
            </Button>
            <Button 
              onClick={() => router.push("/login")}
              variant="outline" 
              className="w-full h-12 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center"
            >
              Back to Login Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
