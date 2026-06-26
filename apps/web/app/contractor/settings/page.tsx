"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  Settings, 
  ShieldCheck, 
  BellRing, 
  CreditCard,
  UserCircle2,
  Mail,
  Camera,
  Activity,
  Smartphone,
  ChevronRight,
  Search,
  ArrowLeft,
  X,
  Archive,
  Clock,
  Layout,
  Lock,
  Users,
  Shield,
  Key,
  Database,
  Sliders,
  Laptop
} from "lucide-react"
import { toast } from "sonner"
import { useSettings } from "@/lib/context/SettingsContext"

export default function SettingsPage() {
  const router = useRouter()
  const { settings, updateSettings, saveSettings, resetSettings, isDirty } = useSettings()
  const [activeView, setActiveView] = React.useState<"main" | "accounts_center" | "profile" | "security" | "organization" | "notifications" | "operational">("main")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [loadingProfile, setLoadingProfile] = React.useState(true)
  
  // Custom avatar background selection (simulated local state for customization)
  const [avatarGrad, setAvatarGrad] = React.useState("bg-gradient-to-br from-primary to-orange-600")

  // Account deletion states
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const isMock = typeof window !== 'undefined' 
          ? (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"))
          : true

        const { getCurrentUserId, getMockSession } = await import("@/lib/auth/mockAuth")
        const userId = await getCurrentUserId()
        if (!userId || userId === "anonymous") {
          router.push("/login")
          return
        }

        if (isMock) {
          const session = getMockSession()
          if (session) {
            const fullName = session.name || ""
            const parts = fullName.trim().split(/\s+/)
            const firstName = parts[0] || ""
            const lastName = parts.slice(1).join(" ") || ""
            updateSettings({
              firstName,
              lastName,
              email: session.email || "",
              phone: session.phone || "",
              designation: session.designation || "Contractor",
              companyName: session.company_name || ""
            })
            setLoadingProfile(false)
            return
          }
        }

        const response = await fetch("/api/contractor/me", {
          headers: {
            "x-user-id": userId
          }
        })

        if (!response.ok) {
          throw new Error("Failed to authenticate session.")
        }

        const data = await response.json()
        updateSettings({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          designation: data.designation || "Contractor",
          companyName: data.companyName || ""
        })
      } catch (err: any) {
        console.error(err)
        // If there's an active context setting, do not hard logout in local mock environment
        const isMockEnv = typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"))
        if (!isMockEnv) {
          toast.error("Session expired. Redirecting to login...")
          router.push("/login")
        }
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [router, updateSettings])

  const handleSave = () => {
    saveSettings()
    toast.success("Settings saved & synced successfully.", {
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
    })
  }

  const handleReset = () => {
    resetSettings()
    toast.info("Changes discarded.")
  }

  const initials = ((settings.firstName?.[0] || "").toUpperCase() + (settings.lastName?.[0] || "").toUpperCase()) || "CW"

  // Gradients for avatar customization
  const gradients = [
    { id: "orange", class: "bg-gradient-to-br from-primary to-orange-600" },
    { id: "blue", class: "bg-gradient-to-br from-blue-500 to-indigo-600" },
    { id: "emerald", class: "bg-gradient-to-br from-emerald-400 to-teal-600" },
    { id: "violet", class: "bg-gradient-to-br from-violet-500 to-fuchsia-600" },
    { id: "dark", class: "bg-gradient-to-br from-slate-700 to-slate-900" }
  ]

  // Menu items list for desktop sidebar / mobile main menu
  const menuCategories = [
    {
      group: "Personal Node Settings",
      items: [
        { id: "profile", label: "Profile Details", desc: "Name, email, avatar parameters", icon: UserCircle2 },
        { id: "security", label: "Security & Credentials", desc: "Passwords, security keys, 2FA status", icon: ShieldCheck },
        { id: "accounts_center", label: "Accounts Center", desc: "Connected nodes and account status", icon: Users }
      ]
    },
    {
      group: "Enterprise Configuration",
      items: [
        { id: "organization", label: "Organization Profile", desc: "Legal entities, tax IDs, node address", icon: Building2 },
        { id: "notifications", label: "Notification Routing", desc: "Configure dispatch triggers and webhooks", icon: BellRing }
      ]
    },
    {
      group: "Operational Preferences",
      items: [
        { id: "operational", label: "Dashboard Parameters", desc: "Shift schedules, display structures", icon: Sliders }
      ]
    }
  ]

  // Filter items if searching
  const filteredCategories = searchQuery.trim() === "" 
    ? menuCategories 
    : menuCategories.map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.items.length > 0)

  // Account deletion mock trigger
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return

    setIsDeleting(true)
    const isMock = typeof window !== 'undefined' 
      ? (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"))
      : true

    if (isMock) {
      try {
        const sessionUserStr = localStorage.getItem("constware_mock_session")
        if (sessionUserStr) {
          const sessionUser = JSON.parse(sessionUserStr)

          const usersStr = localStorage.getItem("constware_mock_users")
          if (usersStr) {
            const users = JSON.parse(usersStr)
            const remainingUsers = users.filter((u: any) => {
              const uEmail = u.email ? u.email.toLowerCase().trim() : ""
              const uPhone = u.phone ? u.phone.replace(/\D/g, "") : ""
              const sEmail = sessionUser.email ? sessionUser.email.toLowerCase().trim() : ""
              const sPhone = sessionUser.phone ? sessionUser.phone.replace(/\D/g, "") : ""
              
              const isMatch = (sEmail && uEmail === sEmail) || (sPhone && uPhone === sPhone)
              return !isMatch
            })
            localStorage.setItem("constware_mock_users", JSON.stringify(remainingUsers))
          }
        }
        
        // Clear mock credentials and cached storage
        localStorage.removeItem("constware_mock_session")
        localStorage.removeItem("constware_user_settings")
        
        toast.warning("Account deleted successfully.", {
          icon: <Shield className="h-4 w-4 text-rose-500" />
        })

        // Hard redirect
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      } catch (e) {
        console.error(e)
        toast.error("Failed to delete mock account")
      }
    } else {
      try {
        // Supabase deletion flow (simulated since DB triggers handle auth.users deletes)
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        localStorage.removeItem("constware_user_settings")
        
        toast.warning("Workspace deletion requested (Production Auth). Please contact your administrator.", {
          icon: <Shield className="h-4 w-4 text-orange-500" />
        })

        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      } catch (e: any) {
        console.error(e)
        toast.error(e.message || "Failed to delete account")
      }
    }
    
    setIsDeleting(false)
    setShowDeleteConfirm(false)
    setDeleteConfirmText("")
  }

  // --- Sub-view Panels ---

  const ProfileView = () => {
    if (loadingProfile) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900/60 border border-slate-800/40 rounded-3xl backdrop-blur-xl">
            <div className="h-24 w-24 rounded-full bg-slate-800 shrink-0" />
            <div className="space-y-3 flex-1 w-full">
              <div className="h-5 w-40 bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="space-y-4 bg-slate-900/40 border border-slate-800/20 p-6 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><div className="h-3 w-16 bg-slate-800 rounded" /><div className="h-11 bg-slate-800 rounded-xl" /></div>
              <div className="space-y-1.5"><div className="h-3 w-16 bg-slate-800 rounded" /><div className="h-11 bg-slate-800 rounded-xl" /></div>
            </div>
            <div className="space-y-1.5"><div className="h-3 w-32 bg-slate-800 rounded" /><div className="h-11 bg-slate-800 rounded-xl" /></div>
            <div className="space-y-1.5"><div className="h-3 w-32 bg-slate-800 rounded" /><div className="h-11 bg-slate-800 rounded-xl" /></div>
            <div className="space-y-1.5"><div className="h-3 w-24 bg-slate-800 rounded" /><div className="h-11 bg-slate-800 rounded-xl" /></div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900/60 border border-slate-800/40 rounded-3xl backdrop-blur-xl">
          <div className="relative group cursor-pointer shrink-0">
            <div className={`h-24 w-24 rounded-full ${avatarGrad} flex items-center justify-center text-3xl font-black text-white shadow-xl border-4 border-slate-950 transition-all duration-300`}>
              {initials}
            </div>
            <div className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-primary/40">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight leading-tight">{settings.firstName} {settings.lastName}</h3>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{settings.designation}</p>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
              {gradients.map(grad => (
                <button
                  key={grad.id}
                  type="button"
                  onClick={() => setAvatarGrad(grad.class)}
                  className={`h-5 w-5 rounded-full ${grad.class} border-2 ${avatarGrad === grad.class ? 'border-white scale-110 shadow-lg shadow-primary/20' : 'border-transparent hover:scale-105'} transition-all`}
                  title={`Gradient ${grad.id}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-slate-900/40 border border-slate-800/20 p-6 rounded-3xl">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Personal Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">First Name</label>
              <Input 
                value={settings.firstName} 
                onChange={e => updateSettings({ firstName: e.target.value })} 
                className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 focus:ring-1 focus:ring-primary text-white font-bold" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Last Name</label>
              <Input 
                value={settings.lastName} 
                onChange={e => updateSettings({ lastName: e.target.value })} 
                className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 focus:ring-1 focus:ring-primary text-white font-bold" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Email Node Address</label>
            <Input 
              value={settings.email} 
              onChange={e => updateSettings({ email: e.target.value })} 
              type="email" 
              className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 focus:ring-1 focus:ring-primary text-white font-bold" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Contact Gateway (Phone)</label>
            <Input 
              value={settings.phone} 
              onChange={e => updateSettings({ phone: e.target.value })} 
              className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 focus:ring-1 focus:ring-primary text-white font-bold" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Designation / Role Title</label>
            <Input 
              value={settings.designation} 
              onChange={e => updateSettings({ designation: e.target.value })} 
              className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 focus:ring-1 focus:ring-primary text-white font-bold" 
            />
          </div>
        </div>
      </div>
    )
  }

  const SecurityView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 bg-slate-900/60 border border-slate-800/40 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-5 w-5 text-primary" />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Security Keys</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Current Password</label>
            <Input type="password" placeholder="••••••••" className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 ml-1">New Secure Password</label>
            <Input type="password" placeholder="Min. 8 characters" className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80" />
          </div>
          <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider text-xs">
            Update Security Credentials
          </Button>
        </div>
      </div>

      <div className="p-6 bg-slate-900/40 border border-slate-800/20 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs font-black text-white">Two-Factor Authentication</h4>
            <p className="text-[10px] text-slate-500 font-semibold leading-normal">Adds a secondary verification layer during login.</p>
          </div>
          <Button variant="outline" className="rounded-xl text-[10px] h-8 font-black uppercase border-warning/30 text-warning hover:bg-warning/10">
            Configure 2FA
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 bg-red-950/10 border border-red-500/20 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Danger Zone</h4>
            <p className="text-[10px] text-slate-500 font-semibold leading-normal">Permanently delete your workspace node and clear your account credentials.</p>
          </div>
          <Button 
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl text-[10px] h-9 px-4 font-black uppercase bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-900/20 shrink-0"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="p-6 bg-slate-900/40 border border-slate-800/20 rounded-3xl space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Active Device Sessions</h4>
        <div className="space-y-3 divide-y divide-slate-800/50">
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <Laptop className="h-4 w-4 text-primary" />
              <div className="text-left">
                <p className="text-xs font-bold text-white">macOS Safari Client</p>
                <p className="text-[9px] text-slate-500">Current Node • Mumbai, Maharashtra</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Now</span>
          </div>
        </div>
      </div>
    </div>
  )

  const AccountsCenterView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2 p-4">
        <div className="flex justify-center mb-1">
          <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-sm border border-primary/20">CW</div>
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight">Accounts Center</h3>
        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
          Manage your shared profiles and workspace nodes across Constware Enterprise products.
        </p>
      </div>

      {/* Shared Profiles */}
      <div className="bg-slate-900/60 border border-slate-800/40 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-left">Connected Workspace profiles</h4>
        
        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/40 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="relative h-11 w-11 shrink-0">
              <div className={`absolute top-0 right-0 h-9 w-9 rounded-full ${avatarGrad} border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-white`}>
                {initials}
              </div>
              <div className="absolute bottom-0 left-0 h-6 w-6 rounded-full bg-primary/20 border-2 border-slate-950 flex items-center justify-center text-[8px] font-black text-primary">CW</div>
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-white">{settings.firstName} {settings.lastName}</h4>
              <p className="text-[9px] text-slate-500 font-bold tracking-tight uppercase">{settings.designation} • 1 Active Node</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Primary</span>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/20 rounded-3xl overflow-hidden divide-y divide-slate-800/50">
        <MenuItem icon={ShieldCheck} label="Password and security keys" onClick={() => setActiveView("security")} />
        <MenuItem icon={Activity} label="Personal information data sync" onClick={() => setActiveView("profile")} />
        <MenuItem icon={Smartphone} label="Registered nodes and access logs" />
        <MenuItem icon={CreditCard} label="Billing channels & Pay gates" onClick={() => setActiveView("organization")} />
      </div>
    </div>
  )

  const OrganizationView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4 bg-slate-900/60 border border-slate-800/40 p-6 rounded-3xl">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 text-left">Legal Enterprise entity</h4>
        
        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Legal Name</label>
            <Input 
              value={settings.companyName} 
              onChange={e => updateSettings({ companyName: e.target.value })} 
              className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 font-bold" 
            />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">GSTIN / Tax Registration ID</label>
            <Input 
              value={settings.gstin} 
              onChange={e => updateSettings({ gstin: e.target.value })} 
              className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 uppercase font-black tracking-wider focus:border-primary" 
            />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Office Node Address</label>
            <Input 
              value={settings.officeAddress} 
              onChange={e => updateSettings({ officeAddress: e.target.value })} 
              className="h-11 rounded-xl bg-slate-950/60 border-slate-800/80 font-bold" 
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900/40 border border-slate-800/20 rounded-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Database className="h-4 w-4 text-primary" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Active Node capacity</h4>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase">8 / 15 Workspace Nodes</span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div className="h-full bg-gradient-to-r from-primary to-orange-500 w-[53%]" />
        </div>
      </div>
    </div>
  )

  const AlertsView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4 bg-slate-900/60 border border-slate-800/40 p-6 rounded-3xl">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 text-left">Event Dispatch Rules</h4>
        
        <div className="space-y-3">
          {[
            { t: "Critical Site Hazards", d: "Safety violations and structural warning logs." },
            { t: "DPR Submission Windows", d: "Daily reports completion thresholds." },
            { t: "Budget Overrun Warning", d: "Project expenditure exceeds estimated target." }
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/40">
               <div className="space-y-0.5 pr-4 text-left">
                  <p className="text-xs font-bold text-white leading-normal">{pref.t}</p>
                  <p className="text-[9px] text-slate-500 leading-normal">{pref.d}</p>
               </div>
               <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-primary accent-primary cursor-pointer shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 bg-slate-900/40 border border-slate-800/20 p-6 rounded-3xl">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 text-left">Dispatch Channels</h4>
        <div className="space-y-3">
          {["SMS Notifications", "Email Delivery", "In-App Alerts Panel"].map((channel, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/10">
              <span className="text-xs font-bold text-slate-350">{channel}</span>
              <input type="checkbox" defaultChecked={i > 0} className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-primary accent-primary cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const OperationalView = () => {
    const [timing, setTiming] = React.useState("08:00 - 17:00")
    const [layout, setLayout] = React.useState("grid")
    const [showArchived, setShowArchived] = React.useState(false)

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="space-y-4 bg-slate-900/60 border border-slate-800/40 p-6 rounded-3xl">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 text-left">Dashboard Settings</h4>
          
          <div className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Standard Shift timings</label>
              <select 
                value={timing}
                onChange={e => setTiming(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-white font-bold text-xs"
              >
                <option value="08:00 - 17:00">08:00 AM - 05:00 PM (Default)</option>
                <option value="09:00 - 18:00">09:00 AM - 06:00 PM</option>
                <option value="10:00 - 19:00">10:00 AM - 07:00 PM</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Command Center Layout Style</label>
              <select 
                value={layout}
                onChange={e => setLayout(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-white font-bold text-xs"
              >
                <option value="grid">Grid Structure Dashboard</option>
                <option value="compact">Compact List Layout</option>
                <option value="wide">Wide Ledger View</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/40 rounded-2xl">
              <div className="space-y-0.5 text-left">
                <p className="text-xs font-bold text-white">Hide Project Archives</p>
                <p className="text-[9px] text-slate-500">Excludes completed construction nodes from directory listing.</p>
              </div>
              <input 
                type="checkbox" 
                checked={showArchived}
                onChange={e => setShowArchived(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-primary accent-primary cursor-pointer shrink-0" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800/20 rounded-3xl text-left">
          <div className="flex items-center gap-2 mb-2 text-slate-300">
            <Sliders className="h-4 w-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-wider">System Activity Logs</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mb-3">Logs represent local cache transactions synchronized on client nodes.</p>
          <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1.5 font-mono text-[9px] text-slate-400">
            <p className="text-emerald-500">● [18:04:12] Synced local profile token with localStorage</p>
            <p>● [18:04:15] Retrieved active session payload successfully</p>
            <p>● [18:05:00] Checked Supabase auth headers (offline fallback mode)</p>
          </div>
        </div>
      </div>
    )
  }

  // --- Main View (Mobile only fallback for settings dashboard options) ---

  const MainView = () => (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Top Profile Card in Settings */}
      <button 
        onClick={() => setActiveView("profile")}
        className="w-full flex items-center gap-4 p-5 bg-gradient-to-br from-slate-900/70 to-slate-900/40 border border-slate-800/40 rounded-3xl shadow-lg hover:border-primary/20 active:scale-[0.99] transition-all text-left"
      >
        <div className={`h-14 w-14 rounded-full ${avatarGrad} flex items-center justify-center text-lg font-black text-white shadow-md border-2 border-slate-950`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-extrabold text-white truncate">{settings.firstName} {settings.lastName}</h4>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider truncate mt-0.5">{settings.designation}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
      </button>

      {/* Menu Categories */}
      {filteredCategories.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-2.5 text-left">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">{group.group}</h3>
          
          <div className="bg-slate-900/40 border border-slate-800/20 rounded-3xl overflow-hidden divide-y divide-slate-800/40">
            {group.items.map((item, itemIdx) => (
              <button 
                key={itemIdx}
                onClick={() => setActiveView(item.id as any)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-900/30 active:bg-slate-900/50 transition-all group text-left"
              >
                <div className="h-9 w-9 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-black text-slate-200 group-hover:text-white transition-colors">{item.label}</span>
                  <span className="block text-[9px] text-slate-500 font-semibold truncate mt-0.5">{item.desc}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const MenuItem = ({ icon: Icon, label, onClick }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-900/30 transition-all group text-left"
    >
      <Icon className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
      <span className="flex-1 text-xs font-bold text-slate-300 group-hover:text-white">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
    </button>
  )

  // Mapping current activeView to actual sub-view UI
  const renderDetailPanel = (viewType: typeof activeView) => {
    switch (viewType) {
      case "profile":
        return <ProfileView />
      case "security":
        return <SecurityView />
      case "accounts_center":
        return <AccountsCenterView />
      case "organization":
        return <OrganizationView />
      case "notifications":
        return <AlertsView />
      case "operational":
        return <OperationalView />
      default:
        return <ProfileView />
    }
  }

  // Active view title
  const activeTitle = {
    profile: "Profile details",
    security: "Security keys",
    accounts_center: "Accounts Center",
    organization: "Organization Profile",
    notifications: "Notification Routing",
    operational: "Operational parameters",
    main: "Settings & Activity"
  }[activeView === "main" ? "profile" : activeView]

  return (
    <DashboardLayout title={activeView === "main" ? "Settings" : ""}>
      <div className="max-w-[1400px] mx-auto pt-2 md:pt-4 px-4 pb-24 relative font-sans">
        
        {/* Dynamic radial glow background elements */}
        <div className="absolute top-10 left-1/4 h-72 w-72 bg-primary/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-80 w-80 bg-orange-600/5 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Header - Mobile Only when nested */}
        <div className="flex items-center gap-3 mb-6 md:hidden">
          {activeView !== "main" && (
            <button 
              onClick={() => setActiveView("main")}
              className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
          )}
          <h1 className="text-base font-black text-white tracking-tight uppercase italic flex-1 text-left">
            {activeView === "main" ? "Settings and activity" : activeTitle}
          </h1>
        </div>

        {/* --- PREMIUM DUAL PANE LAYOUT (Desktop) & Responsive (Mobile) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Menu Column: Visible always on desktop, on mobile visible only when activeView === 'main' */}
          <div className={`lg:col-span-4 space-y-6 ${activeView === "main" ? "block" : "hidden lg:block"}`}>
            <h2 className="hidden lg:block text-xl font-black text-white tracking-tight uppercase italic text-left mb-6">
              Settings & Preferences
            </h2>

            {/* Desktop Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search parameter..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-11 w-full pl-11 pr-4 rounded-xl bg-slate-900/60 border border-slate-800/60 focus:border-primary placeholder:text-slate-600 text-xs font-bold text-white shadow-inner"
              />
            </div>

            {/* Left Menu Navigation Items */}
            <div className="space-y-5">
              {filteredCategories.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-2 text-left">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 px-1">{group.group}</span>
                  
                  <div className="bg-slate-900/30 border border-slate-800/40 rounded-2xl overflow-hidden divide-y divide-slate-800/30">
                    {group.items.map((item, itemIdx) => {
                      const isActive = activeView === item.id || (activeView === "main" && item.id === "profile")
                      
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => setActiveView(item.id as any)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left group ${
                            isActive 
                              ? "bg-gradient-to-r from-primary/10 to-orange-500/10 border-l-2 border-primary text-white" 
                              : "hover:bg-slate-900/30 text-slate-400 hover:text-white"
                          }`}
                        >
                          <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}`} />
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-bold truncate">{item.label}</span>
                          </div>
                          <ChevronRight className={`h-3 w-3 transition-all ${isActive ? 'text-primary rotate-90' : 'text-slate-600 group-hover:text-primary opacity-0 group-hover:opacity-100 lg:block'}`} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Help Support Shortcut in Sidebar */}
            <div className="bg-slate-900/20 border border-slate-800/40 p-4 rounded-2xl space-y-2 text-left hidden lg:block">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Need Assistance?</span>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Access our integrated channels to request node upgrades or report issues.</p>
              <Button 
                onClick={() => router.push("/support")}
                className="w-full h-8 text-[10px] uppercase font-black tracking-wider bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-lg"
              >
                Open Support Gateway
              </Button>
            </div>
          </div>

          {/* Right Content Column: Visible always on desktop, on mobile hidden when activeView === 'main' */}
          <div className={`lg:col-span-8 ${activeView !== "main" ? "block" : "hidden lg:block"}`}>
            
            {/* Header for detail view on desktop */}
            <div className="hidden lg:flex items-center justify-between pb-4 mb-6 border-b border-slate-800/50">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                {activeTitle}
              </h3>
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="text-[9px] font-bold text-slate-500 tracking-[0.1em] uppercase">Node Status: Secure</span>
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Renders the dynamic active panel */}
            <div className="min-h-[50vh]">
              {renderDetailPanel(activeView)}
            </div>

          </div>

        </div>

        {/* --- FLOATING SAVE / RESET BANNER FOR UNSAVED CHANGES --- */}
        {isDirty && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl bg-slate-950/90 border border-primary/20 p-4 rounded-2xl shadow-2xl shadow-primary/10 backdrop-blur-md flex items-center justify-between gap-4 animate-in slide-in-from-bottom-12 duration-300">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping shrink-0" />
              <p className="text-[10px] sm:text-xs font-bold text-white truncate text-left">
                Unsaved modifications detected in settings.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                onClick={handleReset} 
                variant="ghost" 
                className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-white"
              >
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                className="h-8 px-4 rounded-lg text-[10px] font-black uppercase bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/25"
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* --- DELETE CONFIRMATION MODAL --- */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Delete Workspace Node?</h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  This action is irreversible. All workers, expense histories, and site registries associated with this contractor account will be wiped.
                </p>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 pl-1">Type DELETE to confirm</label>
                <Input 
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  className="h-10 rounded-xl bg-slate-950/60 border-slate-800 text-xs font-bold text-center text-white"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText("")
                  }}
                  variant="ghost" 
                  disabled={isDeleting}
                  className="flex-1 h-10 rounded-xl text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                  className="flex-1 h-10 rounded-xl text-xs font-black bg-red-650 hover:bg-red-750 text-white uppercase tracking-wider shadow-md shadow-red-900/20 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
