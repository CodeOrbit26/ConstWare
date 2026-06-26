"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DirectoryView } from "@/components/workers/DirectoryView"
import { AttendanceView } from "@/components/workers/AttendanceView"
import { PortalView } from "@/components/workers/PortalView"
import { AddWorkerModal } from "@/components/workers/AddWorkerModal"
import { Users, CheckSquare, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"

export default function WorkersConsolidatedPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'directory'
  const [activeTab, setActiveTab] = React.useState(initialTab)

  React.useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const getPageTitle = () => {
    switch (activeTab) {
      case 'directory': return 'Directory'
      case 'attendance': return 'Attendance'
      case 'portal': return 'Portal Admin'
      default: return 'Workforce'
    }
  }

  return (
    <DashboardLayout 
       title={
         <>
           {/* Mobile view: Dynamic title matching Command Center formatting */}
           <span className="block md:hidden">{getPageTitle()}</span>
           
           {/* Desktop view: Original multi-line stacked layout */}
           <div className="hidden md:flex flex-col">
              <span className="text-[11px] font-bold text-[#F97316] uppercase tracking-[0.2em] mb-1">WORKFORCE</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight normal-case">Workers & Attendance</span>
           </div>
         </>
       } 
       headerAction={<AddWorkerModal />}
    >
      <div className="w-full max-w-full px-[16px] pb-[40px] box-border space-y-5 animate-in fade-in duration-700 pt-1 lg:pt-0">
        
        {/* Left-aligned WORKFORCE subtitle displayed exclusively on phone screens */}
        <div className="flex md:hidden flex-col items-start px-1">
           <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.25em]">WORKFORCE</span>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
          {/* Options Switcher Bar - Hides active tab only on phones, displaying all options natively on larger screens */}
          <TabsList className="flex h-auto w-full p-0 bg-[#0A0F1E] rounded-xl border border-white/5 overflow-hidden shadow-md">
            
            <TabsTrigger 
              value="directory" 
              className={cn(
                "flex-1 p-3 sm:p-4 rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#F97316] data-[state=active]:bg-[#111827] bg-transparent text-slate-500 data-[state=active]:text-white transition-all border-r border-white/5 last:border-r-0 focus-visible:ring-0",
                activeTab === 'directory' ? "hidden md:flex flex-col items-center md:items-start gap-1" : "flex flex-col items-center md:items-start gap-1 justify-center"
              )}
            >
              <div className="flex items-center gap-1 sm:gap-2 font-black text-[11px] sm:text-sm uppercase tracking-wider text-slate-300">
                 <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F97316] shrink-0" /> 
                 <span className="truncate">Directory</span>
              </div>
              <span className="text-xs font-medium text-slate-500 data-[state=active]:text-slate-400 normal-case hidden md:block truncate">All workers</span>
            </TabsTrigger>

            <TabsTrigger 
              value="attendance" 
              className={cn(
                "flex-1 p-3 sm:p-4 rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#F97316] data-[state=active]:bg-[#111827] bg-transparent text-slate-500 data-[state=active]:text-white transition-all border-r border-white/5 last:border-r-0 focus-visible:ring-0",
                activeTab === 'attendance' ? "hidden md:flex flex-col items-center md:items-start gap-1" : "flex flex-col items-center md:items-start gap-1 justify-center"
              )}
            >
              <div className="flex items-center gap-1 sm:gap-2 font-black text-[11px] sm:text-sm uppercase tracking-wider text-slate-300">
                 <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" /> 
                 <span className="truncate">Attendance</span>
              </div>
              <span className="text-xs font-medium text-slate-500 data-[state=active]:text-slate-400 normal-case hidden md:block truncate">Mark today</span>
            </TabsTrigger>

            <TabsTrigger 
              value="portal" 
              className={cn(
                "flex-1 p-3 sm:p-4 rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#F97316] data-[state=active]:bg-[#111827] bg-transparent text-slate-500 data-[state=active]:text-white transition-all last:border-r-0 focus-visible:ring-0",
                activeTab === 'portal' ? "hidden md:flex flex-col items-center md:items-start gap-1" : "flex flex-col items-center md:items-start gap-1 justify-center"
              )}
            >
              <div className="flex items-center gap-1 sm:gap-2 font-black text-[11px] sm:text-sm uppercase tracking-wider text-slate-300">
                 <KeyRound className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-500 shrink-0" /> 
                 <span className="truncate">Portal Admin</span>
              </div>
              <span className="text-xs font-medium text-slate-500 data-[state=active]:text-slate-400 normal-case hidden md:block truncate">Worker access</span>
            </TabsTrigger>

          </TabsList>

          <TabsContent value="directory" className="mt-0 focus-visible:ring-0 w-full">
             <DirectoryView />
          </TabsContent>

          <TabsContent value="attendance" className="mt-0 focus-visible:ring-0 w-full">
             <AttendanceView />
          </TabsContent>

          <TabsContent value="portal" className="mt-0 focus-visible:ring-0 w-full">
             <PortalView />
          </TabsContent>
        </Tabs>

      </div>
    </DashboardLayout>
  )
}
