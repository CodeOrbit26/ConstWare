"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Construction, 
  Users, 
  IndianRupee, 
  Plus,
  BarChart2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
}

function NavLink({ href, icon: Icon, label, isActive }: NavItem & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 flex-1 relative transition-all duration-300",
        isActive ? "text-primary" : "text-slate-400"
      )}
    >
      <div className={cn(
        "relative flex items-center justify-center h-8 w-14 rounded-full transition-all duration-500 ease-out",
        isActive ? "bg-primary/15 shadow-sm" : "hover:bg-slate-100 dark:hover:bg-slate-800"
      )}>
        <Icon
          className={cn(
            "h-5 w-5 transition-transform duration-500",
            isActive ? "scale-110 stroke-[2.5px]" : "scale-100 stroke-2"
          )}
        />
      </div>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300",
        isActive ? "opacity-100 transform translate-y-0" : "opacity-60 transform translate-y-0.5"
      )}>
        {label}
      </span>
    </Link>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const isContractor = pathname.includes("/contractor")
  const base = isContractor ? "/contractor" : "/supervisor"
  
  const navItems: NavItem[] = [
    { href: `${base}/dashboard`, icon: Home,         label: "Home" },
    { href: `${base}/sites`,    icon: Construction,  label: "Sites" },
    { href: `${base}/workers`,  icon: Users,          label: "Teams" },
    { href: `${base}/finance`,  icon: IndianRupee,   label: "Ledger" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      {/* Dynamic Action Button (FAB) Area - Optional for later */}
      
      <nav className="relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.1)] transition-all duration-500 px-2 pt-2 pb-safe-and-4">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              {...item}
              isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
            />
          ))}
        </div>
        
        {/* Android Gesture Bar Safe Area */}
        <div className="h-2 w-full flex justify-center pb-2">
          <div className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-800 opacity-50" />
        </div>
      </nav>
    </div>
  )
}
