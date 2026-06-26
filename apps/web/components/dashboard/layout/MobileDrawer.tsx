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
  BarChart, 
  Eye, 
  ShoppingBag,
  LogOut,
  Sparkles,
  Settings,
  X
} from "lucide-react"
import { Avatar } from "@/components/shared/Avatar"
import { Button } from "@/components/ui/button"
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

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

import { checkIsMockAuth } from "@/lib/auth/mockAuth"

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSupervisor = pathname?.startsWith('/supervisor')
  const navigation = isSupervisor ? supervisorNavigation : contractorNavigation
  const { settings: userSettings } = useSettings()

  const handleSignOut = async () => {
    onClose()
    const isMock = checkIsMockAuth()

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
    <div className={cn(
      "fixed inset-0 z-[100] lg:hidden transition-all duration-500",
      isOpen ? "visible" : "invisible pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )} 
        onClick={onClose}
      />
      
      {/* Drawer Content matches laptop screen Sidebar perfectly */}
      <div className={cn(
        "absolute inset-y-0 left-0 w-[85vw] max-w-[320px] bg-slate-950 text-white border-r border-slate-800/50 p-6 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header Area */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/50 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 shrink-0 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-orange-500/20 text-white">
              CW
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-sm font-extrabold tracking-tight">ConstWare</span>
              <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] uppercase truncate">Enterprise Suite</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors rounded-xl shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-6">
          {navigation.map((section) => (
            <div key={section.title} className="flex flex-col w-full">
              {/* Section Header */}
              <div className="mb-3 px-2">
                 <h3 className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase whitespace-nowrap">
                   {section.title}
                 </h3>
              </div>
              
              {/* Items List */}
              <div className="space-y-1.5 w-full">
                {section.items.map((item) => {
                  let isActive = false
                  
                  if (item.href.includes('?')) {
                    const [basePath, query] = item.href.split('?')
                    const searchParamsTab = searchParams ? searchParams.get('tab') : null
                    
                    if (query.includes('tab=')) {
                      const targetTab = new URLSearchParams(query).get('tab')
                      
                      if (pathname === basePath) {
                         if (!searchParamsTab && (
                            targetTab === 'registry' || 
                            targetTab === 'projections' || 
                            targetTab === 'directory' || 
                            targetTab === 'inventory' || 
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
                      onClick={onClose}
                      className={cn(
                        "group flex items-center rounded-xl p-3 text-sm font-semibold transition-all duration-300 overflow-hidden",
                        isActive 
                          ? "bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-orange-500/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center mr-3">
                        <item.icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "text-white" : "text-slate-500 group-hover:text-white group-hover:scale-110")} />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Profile Area - Merged with Settings */}
        <div className="mt-auto pt-4 border-t border-slate-800/50 shrink-0 space-y-3">
          <Link 
            href="/contractor/settings" 
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/40 hover:bg-primary/5 hover:border-primary/20 active:scale-[0.98] transition-all duration-300 group w-full"
          >
            <div className="flex items-center min-w-0">
              <Avatar initials={user.initials} size="sm" className="bg-gradient-to-br from-primary to-orange-600 text-white font-extrabold shadow-sm shrink-0 border-none group-hover:scale-105 transition-transform" />
              <div className="flex flex-col overflow-hidden ml-3 text-left">
                <span className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">{user.name}</span>
                <span className="text-[9px] text-slate-500 font-semibold truncate group-hover:text-slate-400 transition-colors">
                   {user.role} {user.site && `• ${user.site}`}
                </span>
              </div>
            </div>
            <Settings className="h-4 w-4 text-slate-500 group-hover:text-primary group-hover:rotate-45 transition-all duration-300 shrink-0 mr-1" />
          </Link>
          
          {/* Logout Button */}
          <Button 
            variant="ghost" 
            className="w-full text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-xs h-9 rounded-xl justify-center font-semibold border border-slate-800/30"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
