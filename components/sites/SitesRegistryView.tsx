"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/shared/Badge"
import { SiteCard } from "@/components/sites/SiteCard"
import { CreateSiteModal } from "@/components/sites/CreateSiteModal"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockSites } from "@/lib/services/mockData"

export function SitesRegistryView() {
  const [filter, setFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")

  const { data: sites = [] } = useQuery({
    queryKey: ['sites', filter],
    queryFn: () => {
      let filtered = [...mockSites]
      if (filter !== "all") {
        filtered = filtered.filter(s => s.status === filter)
      }
      return Promise.resolve(filtered)
    },
    initialData: mockSites
  })

  const filteredSites = sites.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 lg:pb-0">
      
      {/* Primary Interaction Engine (Search & Filters) Moved to Top */}
      <div className="flex flex-col gap-4">
         {/* Search Station */}
         <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search cluster ID or location..."
              className="pl-14 h-14 border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/10 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>

         {/* Deployment Chips (Filters) */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
               onClick={() => setFilter("all")}
               className={cn(
                  "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                  filter === "all" ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
               )}
            >
               All Units
            </button>
            <button 
               onClick={() => setFilter("active")}
               className={cn(
                  "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                  filter === "active" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
               )}
            >
               Active
            </button>
            <button 
               onClick={() => setFilter("on_hold")}
               className={cn(
                  "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                  filter === "on_hold" ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
               )}
            >
               Standby
            </button>
            
            <div className="flex-1" />
         </div>
      </div>

      {/* Global Telemetry Chips */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
         <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm shrink-0">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Nodes</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{sites.length}</p>
         </div>
         <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm shrink-0">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Health</p>
            <p className="text-xl font-black text-emerald-500">92%</p>
         </div>
         <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm shrink-0">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Critical</p>
            <p className="text-xl font-black text-rose-500">04</p>
         </div>
      </div>

      {/* Sites Deployment Grid */}
        {filteredSites.length > 0 ? (
          <div className="transition-all duration-500 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-950/20 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <Search className="h-12 w-12 text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Units Located</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Adjust Telemetry parameters.</p>
          </div>
        )}
    </div>
  )
}
