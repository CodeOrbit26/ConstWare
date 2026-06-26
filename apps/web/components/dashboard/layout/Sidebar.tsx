"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Grid, 
  Calendar, 
  Users, 
  Clock, 
  Wallet, 
  Package, 
  Wrench, 
  BookOpen, 
  BarChart, 
  Eye, 
  TrendingUp,
  LogOut,
  Sparkles,
  Shield,
  Settings,
  Menu,
  X,
  Star,
  Layers,
  ShoppingBag,
  Receipt
} from "lucide-react"
import { Avatar } from "@/components/shared/Avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSettings } from "@/lib/context/SettingsContext"

const contractorNavigation = [
  {
    title: "OPERATIONS",
    items: [
      { name: "Command Center", href: "/contractor/dashboard", icon: LayoutDashboard },
      { name: "All Sites", href: "/contractor/sites?tab=registry", icon: Grid },
      { name: "Project Estimator", href: "/contractor/strategy?tab=projections", icon: BarChart },
      { name: "Supervisor Audit", href: "/contractor/strategy?tab=audit", icon: Eye },
    ],
  },
  {
    title: "WORKFORCE",
    items: [
      { name: "Workers", href: "/contractor/workers", icon: Users },
    ],
  },
  {
    title: "COMMERCE",
    items: [
      { name: "Finance", href: "/contractor/finance", icon: Wallet },
      { name: "Procurement & Fleet", href: "/contractor/resources", icon: Receipt },
      { name: "Bazaar", href: "/contractor/bazaar", icon: ShoppingBag },
      { name: "Document Hub", href: "/contractor/documents", icon: Sparkles },
    ],
  },
]

const supervisorNavigation = [
  {
    title: "MY SITE",
    items: [
      { name: "Site Dashboard", href: "/supervisor/dashboard", icon: LayoutDashboard },
      { name: "Mark Attendance", href: "/supervisor/attendance", icon: Clock },
      { name: "Daily Report", href: "/supervisor/dpr", icon: Calendar },
    ],
  },
  {
    title: "COMMERCE",
    items: [
      { name: "Bazaar", href: "/supervisor/bazaar", icon: ShoppingBag },
      { name: "Site Expenses", href: "/supervisor/finance", icon: Wallet },
    ],
  },
  {
    title: "WORKFORCE",
    items: [
      { name: "Workers", href: "/supervisor/workers", icon: Users },
    ],
  },
]

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSupervisor = pathname?.startsWith('/supervisor')
  const navigation = isSupervisor ? supervisorNavigation : contractorNavigation
  const { settings: userSettings } = useSettings()

  const handleSignOut = async () => {
    const isMock = typeof window !== 'undefined' 
      ? (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"))
      : true

    if (isMock) {
      const { clearMockSession } = await import("@/lib/auth/mockAuth")
      clearMockSession()
    } else {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signOut()
    }

    router.push("/login")
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  const user = isSupervisor 
    ? { name: `${userSettings.firstName} ${userSettings.lastName}`, role: "Site Supervisor", site: "Assigned Site", initials: (userSettings.firstName[0] || "S") + (userSettings.lastName[0] || "V") }
    : { 
        name: `${userSettings.firstName} ${userSettings.lastName}`, 
        role: userSettings.designation.split(' - ')[0] || "Contractor", 
        site: null, 
        initials: (userSettings.firstName[0] || "A") + (userSettings.lastName[0] || "S") 
      }

  return (
    <div className={cn("flex h-full flex-col bg-slate-950 text-white border-r border-slate-800/50 backdrop-blur-xl relative transition-all duration-300 z-40 overflow-hidden", className)}>
      
      {/* Header Area with Menu Toggle */}
      <div className={cn("flex items-center h-16 shrink-0 z-10 w-full transition-all duration-300 border-b border-slate-800/50", isCollapsed ? "justify-center px-0" : "px-4 justify-between")}>
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300 origin-left", isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-full")}>
          <div className="h-8 w-8 shrink-0 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-orange-500/20 text-white">
            CW
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-sm font-extrabold tracking-tight">ConstWare</span>
            <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] uppercase truncate">Enterprise Suite</span>
          </div>
        </div>
        
        {onToggle && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-xl shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-5 w-5" />}
          </Button>
        )}
      </div>

      <div className="flex-1 w-full px-4 overflow-y-auto no-scrollbar">
        <div className="space-y-8 pb-8 pt-2 w-full">
          {navigation.map((section) => (
            <div key={section.title} className="flex flex-col w-full">
              {/* Section Header */}
              <div className="relative mb-4 px-2 h-4 w-full flex items-center">
                 <h3 className={cn("absolute text-[10px] font-semibold tracking-wider text-slate-500 uppercase whitespace-nowrap transition-all duration-300 ease-in-out", isCollapsed ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-100 translate-x-0")}>
                   {section.title}
                 </h3>
                 {/* Collapse Divider logic: fades in when collapsed instead of text */}
                 <div className={cn("h-px bg-slate-800 rounded-full transition-all duration-300 mx-auto", isCollapsed ? "w-6 opacity-100" : "w-0 opacity-0 hidden")} />
              </div>
              
              {/* Navigation Items */}
              <div className="space-y-1.5 w-full">
                {section.items.map((item) => {
                  let isActive = false
                  
                  if (item.href.includes('?')) {
                    const [basePath, query] = item.href.split('?')
                    const searchParamsTab = searchParams ? searchParams.get('tab') : null
                    
                    // Match tab parameter exactly
                    if (query.includes('tab=')) {
                      const targetTab = new URLSearchParams(query).get('tab')
                      
                      if (pathname === basePath) {
                         // Default tabs when no param is passed
                         if (!searchParamsTab && (
                            targetTab === 'registry' || 
                            targetTab === 'projections' || 
                            targetTab === 'directory' || 
                            targetTab === 'inventory' || 
                            targetTab === 'diary' || 
                            targetTab === 'ledger'
                         )) {
                            isActive = true
                         } else if (searchParamsTab === targetTab) {
                            isActive = true
                         }
                      }
                    }
                  } else {
                    isActive = pathname === item.href
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      className={cn(
                        "group flex items-center rounded-xl p-3 text-sm font-semibold transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isActive 
                          ? "bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-orange-500/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                        <item.icon className={cn("transition-transform duration-300", isCollapsed ? "h-6 w-6" : "h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white group-hover:scale-110")} />
                      </div>
                      <span className={cn("overflow-hidden whitespace-nowrap transition-all duration-300", isCollapsed ? "opacity-0 max-w-0 ml-0 invisible" : "opacity-100 max-w-[200px] ml-4 visible")}>
                        {item.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Profile Area - Merged with Settings */}
      <div className="mt-auto border-t border-slate-800 bg-slate-900/30 p-3 shrink-0 transition-all duration-300 overflow-hidden w-full space-y-2">
        <Link 
          href="/contractor/settings" 
          className={cn(
            "flex items-center w-full rounded-xl p-2 bg-slate-900/60 border border-slate-800/40 hover:bg-primary/5 hover:border-primary/20 active:scale-[0.98] transition-all duration-300 group relative",
            isCollapsed ? "justify-center" : "justify-between"
          )}
          title={isCollapsed ? `Settings: ${user.name}` : undefined}
        >
          <div className="flex items-center min-w-0">
            <div className="shrink-0 transition-all duration-300 flex items-center justify-center w-10 h-10">
              <Avatar initials={user.initials} size="sm" className="bg-gradient-to-br from-primary to-orange-600 text-white font-extrabold shadow-md border-none group-hover:scale-105 transition-transform" />
            </div>
            <div className={cn("flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-left", isCollapsed ? "opacity-0 max-w-0 ml-0 opacity-0 invisible" : "opacity-100 max-w-[140px] ml-3 visible")}>
              <span className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">{user.name}</span>
              <span className="text-[9px] text-slate-500 font-semibold truncate group-hover:text-slate-400 transition-colors">
                 {user.role} {user.site && `• ${user.site}`}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <Settings className="h-4 w-4 text-slate-500 group-hover:text-primary group-hover:rotate-45 transition-all duration-300 shrink-0" />
          )}
        </Link>
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          title={isCollapsed ? "Sign Out" : undefined}
          className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-300 overflow-hidden w-full h-9 px-2 rounded-xl justify-start font-semibold border border-transparent"
          onClick={handleSignOut}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          <span className={cn("overflow-hidden whitespace-nowrap transition-all duration-300 text-xs", isCollapsed ? "opacity-0 max-w-0 ml-0 invisible" : "opacity-100 max-w-[200px] ml-3 visible")}>
            Sign Out
          </span>
        </Button>
      </div>
    </div>
  )
}

