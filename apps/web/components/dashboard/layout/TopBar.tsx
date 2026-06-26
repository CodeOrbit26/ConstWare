"use client"

import { Search, Menu, Sun, Moon, Bell, Activity, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "./NotificationBell"
import { useTheme } from "next-themes"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function TopBar({ title, onMenuClick, headerAction }: { title: string; onMenuClick?: () => void; headerAction?: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1600px] mx-auto pt-safe relative">
        
        {/* Left: Menu (Visible on Mobile) */}
        <div className="flex items-center gap-2 lg:hidden w-1/4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-600 dark:text-slate-400 active:scale-95 transition-all h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" 
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Center: Title (Mobile Focused) / Left Parent (Desktop) */}
        <div className="flex-1 flex justify-center lg:justify-start min-w-0 transition-all px-2 h-16">
          <div className="flex flex-col items-center lg:items-start group justify-center h-full">
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider truncate leading-none">
              {title}
            </h1>
          </div>
        </div>

        
        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1.5 lg:gap-3 w-1/4 lg:w-auto shrink-0">
          {headerAction && (
            <div className="hidden sm:block">
              {headerAction}
            </div>
          )}
          
          <Link href="/contractor/finance">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-full border border-slate-200/50 dark:border-slate-700/50 group hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer active:scale-95">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-black text-slate-500 group-hover:text-primary transition-colors uppercase tracking-wider">Finance</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 lg:gap-2">
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  )
}

