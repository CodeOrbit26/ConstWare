"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/shared/Badge"
import { SiteCard } from "@/components/sites/SiteCard"
import { CreateSiteModal } from "@/components/sites/CreateSiteModal"
import { Input } from "@/components/ui/input"
import { Search, Building2, ShieldAlert, Sparkles, CheckCircle2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUserId } from "@/lib/auth/mockAuth"

export function SitesRegistryView() {
  const [filter, setFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")

  const { data: sites = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      const res = await fetch('/api/sites', {
        headers: {
          'x-user-id': userId
        }
      })
      if (!res.ok) throw new Error('Failed to fetch sites')
      return res.json()
    }
  })

  // Apply filters on the client-side
  const filteredSites = React.useMemo(() => {
    return sites.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.location.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || s.status === filter;
      return matchesSearch && matchesFilter;
    })
  }, [sites, search, filter])

  // Stats calculation
  const totalNodes = sites.length
  const activeNodes = sites.filter(s => s.status === 'active').length
  const standbyNodes = sites.filter(s => s.status === 'on_hold').length

  const healthScore = React.useMemo(() => {
    if (totalNodes === 0) return "N/A"
    const ratio = activeNodes / totalNodes
    return `${Math.round(ratio * 100)}%`
  }, [totalNodes, activeNodes])

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 lg:pb-0 text-left">
      
      {/* Search and Filters Layout */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         {/* Search Station */}
         <div className="relative group w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="SEARCH CLUSTER ID OR LOCATION..."
              className="pl-12 h-12 border border-slate-800 bg-slate-900/50 dark:bg-slate-950 rounded-xl font-bold text-[10px] tracking-widest placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-primary/20 shadow-inner text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>

         {/* Deployment Chips (Filters) */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full md:w-auto">
            <button 
               onClick={() => setFilter("all")}
               className={cn(
                  "px-5 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border border-slate-800",
                  filter === "all" ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-slate-900/40 text-slate-500 hover:text-white"
               )}
            >
               All Units ({totalNodes})
            </button>
            <button 
               onClick={() => setFilter("active")}
               className={cn(
                  "px-5 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border border-slate-800",
                  filter === "active" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-900/40 text-slate-500 hover:text-white"
               )}
            >
               Active ({activeNodes})
            </button>
            <button 
               onClick={() => setFilter("on_hold")}
               className={cn(
                  "px-5 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border border-slate-800",
                  filter === "on_hold" ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-slate-900/40 text-slate-500 hover:text-white"
               )}
            >
               Standby ({standbyNodes})
            </button>
         </div>
      </div>

      {/* Mobile-only Create Site Banner (shown only when sites exist) */}
      {!isLoading && sites.length > 0 && (
        <div className="sm:hidden bg-gradient-to-r from-slate-900/90 to-slate-955 border border-slate-800/80 rounded-[1.5rem] p-4 flex items-center justify-between shadow-lg shadow-black/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Initialize Node</p>
            <h3 className="text-xs font-black text-white uppercase tracking-wider italic leading-none pt-1">Deploy New Site</h3>
          </div>
          <div className="shrink-0">
            <CreateSiteModal />
          </div>
        </div>
      )}

      {/* Sites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-slate-900/50 border border-slate-800/60 rounded-2xl" />
          ))}
        </div>
      ) : filteredSites.length > 0 ? (
        <div className="transition-all duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/10 backdrop-blur-xl rounded-[2rem] border border-dashed border-slate-800/60 text-center p-8 space-y-4">
          <div className="h-14 w-14 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight uppercase italic">No sites added yet</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first site to start tracking attendance, expenses, and progress.
            </p>
          </div>
          <div className="pt-2">
            <CreateSiteModal />
          </div>
        </div>
      )}
    </div>
  )
}
