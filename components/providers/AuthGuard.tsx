"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router   = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Track whether we've done the very first auth check
  const initialised = useRef(false)

  useEffect(() => {
    const isMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"

    const checkUser = async () => {
      // Mock auth — bypass everything instantly
      if (isMockAuth) {
        setLoading(false)
        initialised.current = true
        return
      }

      // ── If we already know the user, don't show loading again ──
      // Re-run route protection logic silently, no spinner needed.
      if (initialised.current) {
        const currentUser = user
        const path = pathname

        if (!currentUser) {
          if (!path.startsWith("/client/") && path !== "/login" && path !== "/register" && path !== "/") {
            router.push("/login")
          }
        } else {
          const role = currentUser.user_metadata?.role
          if (path.startsWith("/contractor") && role !== "contractor") router.push("/login")
          else if (path.startsWith("/supervisor") && role !== "supervisor") router.push("/login")
        }
        return
      }

      // ── First ever check — show loading spinner ──
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        setUser(supabaseUser)
        initialised.current = true

        const path = pathname

        if (path === "/login" || path === "/register" || path === "/") {
          if (supabaseUser && path !== "/") {
            const role = supabaseUser.user_metadata?.role
            if (role === "contractor") router.push("/contractor/dashboard")
            else if (role === "supervisor") router.push("/supervisor/dashboard")
          }
          setLoading(false)
          return
        }

        if (!supabaseUser) {
          if (!path.startsWith("/client/")) router.push("/login")
          setLoading(false)
          return
        }

        const role = supabaseUser.user_metadata?.role
        if (path.startsWith("/contractor") && role !== "contractor") router.push("/login")
        else if (path.startsWith("/supervisor") && role !== "supervisor") router.push("/login")

      } catch (error) {
        console.error("Auth check failed:", error)
        initialised.current = true
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    if (process.env.NEXT_PUBLIC_MOCK_AUTH !== "true") {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user && !["/login", "/register", "/"].includes(pathname) && !pathname.startsWith("/client/")) {
          router.push("/login")
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [pathname])  // eslint-disable-line react-hooks/exhaustive-deps

  // Only show the splash screen on the very first load, not on every navigation
  if (loading && !initialised.current) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] text-white">
        <div className="relative h-14 w-14 mb-8">
          <div className="absolute inset-0 rounded-2xl border-4 border-primary/20 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center font-black text-xs text-white">CW</div>
          <span className="text-xl font-black uppercase tracking-tight">ConstWare</span>
        </div>
        <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading Platform...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
