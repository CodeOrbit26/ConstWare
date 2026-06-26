"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/shared/DataTable"
import { 
  Users, 
  MapPin, 
  Phone, 
  Search, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  Clock,
  UserPlus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockWorkers } from "@/lib/services/mockData"
import { Input } from "@/components/ui/input"

export default function SupervisorWorkersPage() {
  const [search, setSearch] = React.useState("")
  
  // Only show workers assigned to the supervisor's site (mock site 's1')
  const siteWorkers = mockWorkers.filter(w => w.assignedSiteId === 's1')

  const columns: Column<any>[] = [
    {
      header: "Personnel Identity",
      cell: (row) => (
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-lg shadow-inner">
            {row.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{row.name}</span>
            <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">{row.skill} • Certified</span>
          </div>
        </div>
      )
    },
    {
      header: "Comms Link",
      cell: (row) => (
        <div className="flex items-center gap-3 text-slate-500 font-bold tabular-nums">
           <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
             <Phone className="h-3.5 w-3.5" />
           </div>
           <span className="text-xs">+91 91234 56789</span>
        </div>
      )
    },
    {
      header: "Deployment Status",
      cell: (row) => (
        <Badge 
          className={cn(
             "h-9 px-6 text-[9px] font-black tracking-widest uppercase rounded-full border",
             row.attendanceToday === 'present' 
               ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
               : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400"
          )}
        >
          {row.attendanceToday || 'Pending marking'}
        </Badge>
      )
    },
    {
      header: "Efficiency Rating",
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Performance</span>
              <span className="text-[10px] font-black text-primary italic tabular-nums">98%</span>
           </div>
           <div className="w-24 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-primary w-[98%] rounded-full shadow-premium-primary" />
           </div>
        </div>
      )
    },
    {
      header: "Protocol",
      cell: () => (
        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <MoreVertical className="h-5 w-5" />
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout title="Personnel: Workforce Oversight">
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-100 dark:border-slate-800 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Site Personnel Command
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Squad <br /> <span className="text-primary not-italic">Reporting</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">High-fidelity Workforce performance & Deployment Telemetry</p>
           </div>

           <div className="flex items-center gap-4">
              <Button className="h-16 px-10 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-premium-dark border border-white/10 transition-all active:scale-95 group">
                <UserPlus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" /> Sync New Personnel
              </Button>
           </div>
        </div>

        {/* TEAM DECK - HIGH FIDELITY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Total Strength", val: siteWorkers.length, icon: Users, color: "text-primary", bg: "bg-primary/5" },
             { label: "Active Deployment", val: siteWorkers.filter(w => w.attendanceToday === 'present').length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5" },
             { label: "Sync Discrepancy", val: "02", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/5" },
             { label: "Role Diversity", val: "04", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/5" }
           ].map(stat => (
             <div key={stat.label} className={cn("p-10 rounded-[3rem] shadow-premium border border-white/20 dark:border-slate-800/50 transition-all duration-500 hover:translate-y-[-4px]", stat.bg)}>
                <div className="flex items-center justify-between mb-8">
                   <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner", stat.bg)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                   </div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                <p className={cn("text-5xl font-black italic tracking-tighter tabular-nums", stat.color)}>{stat.val}</p>
             </div>
           ))}
        </div>

        {/* SEARCH COMMAND CENTER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 p-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl rounded-[3.5rem] border border-white/20 dark:border-slate-800/50 shadow-premium group">
           <div className="relative group/search flex-1 max-w-xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within/search:text-primary transition-colors" />
              <Input 
                 placeholder="Search personnel by identity or trade classification..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="h-16 pl-16 bg-slate-50 dark:bg-slate-900/50 border-none rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-inner placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary/20"
              />
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Network Status</p>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Encrypted Link Active</span>
                 </div>
              </div>
           </div>
        </div>

        {/* WORKFORCE REGISTRY - SOPHISTICATED */}
        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[4rem] border border-white/20 dark:border-slate-800/50 shadow-premium overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <DataTable 
             data={siteWorkers} 
             columns={columns} 
             keyExtractor={(w) => w.id} 
           />
        </div>

        {/* GEOFENCE TELEMETRY - TACTICAL */}
        <div className="p-10 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[3.5rem] border border-white/10 dark:border-slate-100 shadow-premium-dark flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 h-full w-64 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
           <div className="h-20 w-20 bg-white/10 dark:bg-slate-100 backdrop-blur-3xl rounded-[1.75rem] flex items-center justify-center text-primary shadow-premium relative z-10">
              <MapPin className="h-10 w-10 animate-bounce" />
           </div>
           <div className="space-y-2 relative z-10">
              <p className="text-2xl font-black italic tracking-tighter uppercase leading-none">Geofence Telemetry: Operational</p>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
                 Real-time GPS tracking active. Current team proximity is <span className="text-white dark:text-slate-950 font-black italic">94% within assigned Site geofence boundaries</span>.
              </p>
           </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
