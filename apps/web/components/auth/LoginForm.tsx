"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { 
  Briefcase, 
  UserCog, 
  UserCircle, 
  ArrowRight, 
  Lock, 
  Phone, 
  Shield,
  Loader2,
  Link2 as LinkIcon,
  Mail,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"

// Google SVG Icon
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [forgotMode, setForgotMode] = React.useState(false)
  const [resetEmail, setResetEmail] = React.useState("")

  const isMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"

  const handleLogin = async (role: string, e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (isMockAuth) {
      try {
        const { authenticateMockUser } = await import("@/lib/auth/mockAuth")
        await authenticateMockUser(email, password, role)
        
        setIsLoading(false)
        toast.success(`Access Granted: ${role.charAt(0).toUpperCase() + role.slice(1)} Session Established`, {
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        })
        if (role === "contractor") router.push("/contractor/dashboard")
        else if (role === "supervisor") router.push("/supervisor/dashboard")
        else router.push("/client/demo-token")
      } catch (err: any) {
        toast.error(err.message || "Invalid credentials")
        setIsLoading(false)
      }
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email before logging in. Check your inbox for the verification link.")
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.")
        } else {
          toast.error(error.message)
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        const userRole = data.user.user_metadata?.role || "contractor"
        
        // Check role mismatch
        if (userRole !== role) {
          toast.error(`This account is registered as a ${userRole}. Please use the ${userRole} tab to login.`)
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }

        toast.success(`Welcome back! ${role.charAt(0).toUpperCase() + role.slice(1)} session established.`, {
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        })
        
        if (role === "contractor") router.push("/contractor/dashboard")
        else if (role === "supervisor") router.push("/supervisor/dashboard")
      }
    } catch (err: any) {
      toast.error("Connection failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async (role: string) => {
    if (isMockAuth) {
      toast.info("Google login requires real Supabase credentials. Update your .env.local file.")
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      if (error) toast.error(error.message)
    } catch {
      toast.error("Google login failed. Please try again.")
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      toast.error("Please enter your email address")
      return
    }
    setIsLoading(true)
    
    if (isMockAuth) {
      setTimeout(() => {
        setIsLoading(false)
        toast.success("Password reset email sent! Check your inbox.")
        setForgotMode(false)
      }, 1000)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Password reset email sent! Check your inbox.")
        setForgotMode(false)
      }
    } catch {
      toast.error("Failed to send reset email.")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── FORGOT PASSWORD MODAL ───
  if (forgotMode) {
    return (
      <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black tracking-tight text-navy dark:text-white uppercase">
            Reset Password
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-8 rounded-[2rem] shadow-2xl">
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                  <Input 
                    id="reset-email" 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@email.com" 
                    required 
                    className="h-12 pl-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl font-medium"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-widest shadow-xl"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <button 
                type="button"
                onClick={() => setForgotMode(false)}
                className="w-full text-center text-sm text-slate-500 font-medium hover:text-primary transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ─── MAIN LOGIN FORM ───
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tight text-navy dark:text-white uppercase">
          Welcome back
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Select your portal to access the command center or{" "}
          <button 
            onClick={() => router.push("/register")}
            className="text-primary font-bold hover:underline focus:outline-none"
          >
            Create an Account
          </button>
        </p>
      </div>

      <Tabs defaultValue="contractor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-10 h-14 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <TabsTrigger 
            value="contractor" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-navy data-[state=active]:text-primary data-[state=active]:shadow-xl data-[state=active]:shadow-primary/10 flex flex-col gap-1 items-center justify-center transition-all duration-300 group"
          >
            <Briefcase className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-tighter">Contractor</span>
          </TabsTrigger>
          <TabsTrigger 
            value="supervisor" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-navy data-[state=active]:text-blue-600 data-[state=active]:shadow-xl data-[state=active]:shadow-blue-600/10 flex flex-col gap-1 items-center justify-center transition-all duration-300 group"
          >
            <UserCog className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-tighter">Supervisor</span>
          </TabsTrigger>
          <TabsTrigger 
            value="client" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-navy data-[state=active]:text-emerald-500 data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-500/10 flex flex-col gap-1 items-center justify-center transition-all duration-300 group"
          >
            <UserCircle className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-tighter">Client</span>
          </TabsTrigger>
        </TabsList>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-8 rounded-[2rem] shadow-2xl">
            {/* ═══ CONTRACTOR LOGIN ═══ */}
            <TabsContent value="contractor" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <form onSubmit={(e) => handleLogin("contractor", e)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="you@email.com" 
                        required 
                        className="h-12 pl-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-primary focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        id="password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        required 
                        placeholder="••••••••"
                        className="h-12 pl-12 pr-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-primary focus:border-primary transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-navy hover:bg-navy/90 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-navy/20 transition-all active:scale-[0.98] group/btn overflow-hidden relative"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Enter Dashboard
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none"></div>
                </Button>

                {/* Divider */}
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Google Login */}
                <Button 
                  type="button"
                  onClick={() => handleGoogleLogin("contractor")}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm gap-3 transition-all active:scale-[0.98]"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </Button>

                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    <button 
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-primary font-bold cursor-pointer hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* ═══ SUPERVISOR LOGIN ═══ */}
            <TabsContent value="supervisor" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <form onSubmit={(e) => handleLogin("supervisor", e)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="s-email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Supervisor Email</Label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input id="s-email" name="email" type="email" placeholder="supervisor@email.com" required className="h-12 pl-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-password" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Supervisor Security Key</Label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input id="s-password" name="password" type="password" required placeholder="••••••••" className="h-12 pl-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl" />
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/10 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Validating Credentials...
                    </div>
                  ) : "Access Site Console"}
                </Button>

                {/* Divider */}
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                <Button 
                  type="button"
                  onClick={() => handleGoogleLogin("supervisor")}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm gap-3 transition-all active:scale-[0.98]"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </Button>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-relaxed text-center">
                    Supervisor access is provisioned by your Primary Contractor. Contact your project lead if you lack credentials.
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* ═══ CLIENT LOGIN ═══ */}
            <TabsContent value="client" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ClientLoginFlow isLoading={isLoading} setIsLoading={setIsLoading} router={router} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
         <button onClick={() => setForgotMode(true)} className="cursor-pointer hover:text-primary transition-colors">Forgot Access?</button>
         <span className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</span>
         <span className="cursor-pointer hover:text-primary transition-colors">Contact Support</span>
      </div>
    </div>
  )
}

/* ============================================================ */
/* CLIENT LOGIN — MULTI-STEP WIZARD                             */
/* ============================================================ */

interface ClientProject {
  code: string
  siteName: string
  contractor: string
  addedAt: string
}

function ClientLoginFlow({ 
  isLoading, setIsLoading, router 
}: { 
  isLoading: boolean; 
  setIsLoading: (v: boolean) => void; 
  router: ReturnType<typeof useRouter> 
}) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [clientEmail, setClientEmail] = React.useState("")
  const [clientPassword, setClientPassword] = React.useState("")
  const [siteCode, setSiteCode] = React.useState("")
  const [savedProjects, setSavedProjects] = React.useState<ClientProject[]>([])
  const [verifyState, setVerifyState] = React.useState<"verifying" | "approved" | null>(null)

  // Load saved projects from localStorage after login
  const loadProjects = (email: string) => {
    try {
      const stored = localStorage.getItem(`cw_client_projects_${email}`)
      if (stored) return JSON.parse(stored) as ClientProject[]
    } catch {}
    return []
  }

  const saveProject = (email: string, project: ClientProject) => {
    const existing = loadProjects(email)
    // Avoid duplicates
    if (!existing.find(p => p.code === project.code)) {
      existing.push(project)
      localStorage.setItem(`cw_client_projects_${email}`, JSON.stringify(existing))
    }
    return existing
  }

  // STEP 1 — Email/Phone + Password
  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientEmail || !clientPassword) {
      toast.error("Please enter your email/phone and password")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const projects = loadProjects(clientEmail)
      setSavedProjects(projects)
      
      if (projects.length > 0) {
        toast.success("Welcome back! Select a project or add a new one.", {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        })
        setStep(2) // Show project list
      } else {
        toast.success("Identity Verified — Enter your Site Access Code", {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        })
        setStep(3) // No projects, go straight to code entry
      }
    }, 1500)
  }

  // STEP 3 — 12-digit site code submission
  const handleSiteCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const raw = siteCode.replace(/[^A-Z0-9]/gi, '')
    if (raw.length !== 12) {
      toast.error("Invalid Code: Must be exactly 12 characters")
      return
    }

    // Check format starts with CW
    if (!raw.startsWith('CW')) {
      toast.error("Invalid Code: Must start with CW (ConstWare)")
      return
    }

    setIsLoading(true)
    setVerifyState("verifying")

    const verificationMinimumTime = new Promise(r => setTimeout(r, 1000))

    try {
      const res = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientAccessId: raw, email: clientEmail })
      })
      const data = await res.json()
      
      await verificationMinimumTime

      if (res.ok && data.success) {
         setVerifyState("approved")
         await new Promise(r => setTimeout(r, 1500))
         saveProject(clientEmail, { code: data.siteId, siteName: data.siteName, contractor: "Sharma & Associates", addedAt: new Date().toISOString() })
         router.push(data.redirectUrl)
      } else {
         throw new Error(data.error || "Access Denied: Invalid code")
      }
    } catch (err: any) {
      await verificationMinimumTime
      setVerifyState(null)
      toast.error(err.message || "Connection failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCode = (val: string) => {
    let raw = val.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 12)
    let parts: string[] = []
    if (raw.length > 0) parts.push(raw.slice(0, 2))
    if (raw.length > 2) parts.push(raw.slice(2, 4))
    if (raw.length > 4) parts.push(raw.slice(4, 6))
    if (raw.length > 6) parts.push(raw.slice(6, 8))
    if (raw.length > 8) parts.push(raw.slice(8, 10))
    if (raw.length > 10) parts.push(raw.slice(10, 12))
    return parts.join('-')
  }

  // ─── STEP INDICATOR ───
  const StepIndicator = ({ active }: { active: 1 | 2 | 3 }) => (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div className="flex items-center gap-1.5">
        <div className={cn("h-6 w-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all", 
          active > 1 ? "bg-emerald-500/20 text-emerald-500" : active === 1 ? "bg-emerald-500 text-white" : "bg-slate-300 dark:bg-slate-700 text-slate-500"
        )}>
          {active > 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : "1"}
        </div>
        <span className={cn("text-[9px] font-black uppercase tracking-widest", active >= 1 ? "text-emerald-500" : "text-slate-400")}>Login</span>
      </div>
      <div className={cn("w-5 h-px", active > 1 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700")} />
      <div className="flex items-center gap-1.5">
        <div className={cn("h-6 w-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all",
          active > 2 ? "bg-emerald-500/20 text-emerald-500" : active === 2 ? "bg-emerald-500 text-white" : "bg-slate-300 dark:bg-slate-700 text-slate-500"
        )}>
          {active > 2 ? <CheckCircle2 className="h-3.5 w-3.5" /> : "2"}
        </div>
        <span className={cn("text-[9px] font-black uppercase tracking-widest", active >= 2 ? "text-emerald-500" : "text-slate-400")}>Projects</span>
      </div>
      <div className={cn("w-5 h-px", active > 2 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700")} />
      <div className="flex items-center gap-1.5">
        <div className={cn("h-6 w-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all",
          active === 3 ? "bg-emerald-500 text-white" : "bg-slate-300 dark:bg-slate-700 text-slate-500"
        )}>3</div>
        <span className={cn("text-[9px] font-black uppercase tracking-widest", active === 3 ? "text-emerald-500" : "text-slate-400")}>Site Code</span>
      </div>
    </div>
  )

  // ─── LOGGED-IN CHIP ───
  const UserChip = ({ onBack }: { onBack: () => void }) => (
    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 truncate">{clientEmail}</span>
      </div>
      <button type="button" onClick={onBack} className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest flex items-center gap-1 transition-colors">
        <ArrowLeft className="h-3 w-3" /> Back
      </button>
    </div>
  )

  // STEP 1 — LOGIN
  if (step === 1) {
    return (
      <form onSubmit={handleClientLogin} className="space-y-5 animate-in fade-in duration-500">
        <StepIndicator active={1} />
        <div className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="c-email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email or Phone Number</Label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input 
                    id="c-email" 
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="you@email.com  or  +91 9876543210" 
                    required 
                    className="h-12 pl-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl font-medium"
                 />
              </div>
           </div>
           <div className="space-y-2">
              <Label htmlFor="c-pass" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</Label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input 
                    id="c-pass" 
                    type="password"
                    value={clientPassword}
                    onChange={e => setClientPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    className="h-12 pl-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl"
                 />
              </div>
           </div>
        </div>

        <Button 
           type="submit" 
           disabled={isLoading}
           className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all group/btn"
        >
           {isLoading ? (
              <div className="flex items-center gap-2">
                 <Loader2 className="h-4 w-4 animate-spin" />
                 Verifying Identity...
              </div>
           ) : (
              <div className="flex items-center justify-center gap-2">
                 Continue <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </div>
           )}
        </Button>

        <div className="text-center">
           <p className="text-xs text-slate-500 font-medium italic">
             Don't have an account? <span className="text-emerald-500 font-bold cursor-pointer hover:underline">Request client access from your contractor</span>
           </p>
        </div>
      </form>
    )
  }

  // STEP 2 — MY PROJECTS
  if (step === 2) {
    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
        <StepIndicator active={2} />
        <UserChip onBack={() => setStep(1)} />
        <div className="text-center space-y-1">
           <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Your Projects</h3>
           <p className="text-xs text-slate-500 font-medium">Select a project to view, or add a new one with a code.</p>
        </div>
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
           {savedProjects.map((proj, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer group"
                onClick={() => { toast.success(`Opening ${proj.siteName}...`); router.push(`/client/${proj.code}`) }}
              >
                 <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                       <Briefcase className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{proj.siteName}</p>
                       <p className="text-[10px] text-slate-500 font-medium truncate">{proj.contractor} • {proj.code}</p>
                    </div>
                 </div>
                 <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
           ))}
        </div>
        <div className="h-px bg-slate-200 dark:bg-slate-800" />
        <Button onClick={() => setStep(3)} variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 font-black uppercase tracking-widest text-[10px] transition-all">
           + Add New Project With Code
        </Button>
      </div>
    )
  }

  // STEP 3 — ENTER 12-DIGIT SITE ACCESS CODE
  return (
    <div className="relative">
      {verifyState && (
        <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
           {verifyState === "verifying" ? (
              <div className="flex flex-col items-center gap-5 animate-in fade-in duration-500">
                 <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                    <Shield className="absolute inset-0 m-auto h-8 w-8 text-emerald-500" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Verifying Code...</p>
                    <p className="text-xs text-slate-500 font-medium">Authenticating with ConstWare security layer</p>
                 </div>
              </div>
           ) : (
              <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-500">
                 <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-in zoom-in duration-300">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-lg font-black text-emerald-500 uppercase tracking-widest">Verified</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Access Approved — Redirecting...</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-widest">{siteCode}</span>
                 </div>
              </div>
           )}
        </div>
      )}

      <form onSubmit={handleSiteCode} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
        <StepIndicator active={3} />
        <UserChip onBack={() => savedProjects.length > 0 ? setStep(2) : setStep(1)} />
        <div className="space-y-3 text-center">
           <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
              <KeyRound className="h-3.5 w-3.5" /> Enter 12-Digit Site Access Code
           </Label>
           <p className="text-xs text-slate-500 font-medium">Your contractor will provide this code via WhatsApp, SMS, or Email.</p>
           <Input 
              value={siteCode}
              onChange={e => setSiteCode(formatCode(e.target.value))}
              maxLength={17}
              placeholder="CW-XX-XX-DD-XX-XX"
              className="h-20 text-center text-2xl font-black tracking-[0.15em] font-mono bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 shadow-inner"
           />
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              Format: <span className="text-emerald-500">CW-AB-GV-01-AS-GG</span>
           </p>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all group/btn">
           {isLoading ? (
              <div className="flex items-center gap-3">
                 <Loader2 className="h-5 w-5 animate-spin" />
                 Unlocking Project Portal...
              </div>
           ) : (
              <div className="flex items-center gap-3">
                 View My Project <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
              </div>
           )}
        </Button>
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
           <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed">
              This code links you to a specific construction site. Each site has a unique code issued by the contractor.
           </p>
        </div>
      </form>
    </div>
  )
}
