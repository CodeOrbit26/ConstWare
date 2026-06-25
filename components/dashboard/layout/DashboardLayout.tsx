"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { BottomNav } from "./BottomNav"
import { MobileDrawer } from "./MobileDrawer"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ 
  children, 
  title = "Dashboard",
  headerAction
}: { 
  children: React.ReactNode
  title?: React.ReactNode
  headerAction?: React.ReactNode
}) { 
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#020617] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] pb-16 lg:pb-0 transition-colors duration-500">
      <div className={cn(
        "hidden lg:block shrink-0 transition-[width] duration-300 ease-in-out sticky top-0 h-screen",
        isSidebarCollapsed ? "w-[84px]" : "w-[280px]"
      )}>
        <Sidebar 
          className="h-full w-full" 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} onMenuClick={() => setIsMobileDrawerOpen(true)} headerAction={headerAction} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>

      <BottomNav />
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
    </div>
  )
}
