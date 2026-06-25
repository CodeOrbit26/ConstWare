"use client"

import * as React from "react"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/shared/DataTable"
import { 
  Wrench, 
  Settings, 
  Fuel, 
  Activity, 
  AlertCircle,
  Plus,
  ArrowRight,
  Shield,
  Search,
  Calendar,
  Construction,
  Truck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface MachineryAsset {
  id: string
  name: string
  type: string
  site: string
  status: 'Operational' | 'Maintenance' | 'Idle' | 'Broken'
  fuelLevel: number
  lastService: string
  nextService: string
  operator: string
}

const mockMachinery: MachineryAsset[] = [
  { id: "m1", name: "JCB 3DX Eco", type: "Backhoe Loader", site: "Green Valley", status: "Operational", fuelLevel: 85, lastService: "2024-03-15", nextService: "2024-05-15", operator: "Ramesh P." },
  { id: "m2", name: "Case 1107 EX", type: "Vibratory Roller", site: "Skyline Towers", status: "Maintenance", fuelLevel: 12, lastService: "2024-04-10", nextService: "2024-06-10", operator: "Suresh K." },
  { id: "m3", name: "Schwing Stetter", type: "Concrete Mixer", site: "Green Valley", status: "Operational", fuelLevel: 64, lastService: "2024-02-28", nextService: "2024-04-28", operator: "Manoj L." },
  { id: "m4", name: "Tata Hitachi EX200", type: "Excavator", site: "Hwy Junction", status: "Idle", fuelLevel: 45, lastService: "2024-01-20", nextService: "2024-04-20", operator: "None" },
]

export function MachineryView() {
  const [search, setSearch] = React.useState("")

  const columns: Column<MachineryAsset>[] = [
    {
      header: "Fleet Asset",
      cell: (row) => (
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-slate-950 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-950 rotate-3 group-hover:rotate-0 transition-transform shadow-premium">
            {row.type.includes("Truck") || row.type.includes("Excavator") ? <Truck className="h-7 w-7" /> : <Construction className="h-7 w-7" />}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-black text-slate-900 dark:text-white tracking-tight uppercase italic text-lg">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{row.type}</span>
          </div>
        </div>
      )
    },
    {
      header: "Strategic Cluster",
      cell: (row) => (
         <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{row.site}</span>
      )
    },
    {
      header: "Registry Status",
      cell: (row) => (
        <Badge 
          variant={row.status === 'Operational' ? 'success' : row.status === 'Maintenance' ? 'warning' : 'outline'}
          className={cn(
             "text-[9px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border",
             row.status === 'Operational' ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" : 
             row.status === 'Maintenance' ? "bg-amber-500/5 border-amber-500/10 text-amber-500 animate-pulse" : 
             "bg-slate-500/5 border-slate-500/10 text-slate-500"
          )}
        >
          {row.status}
        </Badge>
      )
    },
    {
      header: "Energy Reserve",
      cell: (row) => (
        <div className="flex flex-col gap-2 w-32">
           <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Fuel className="h-3 w-3" /> Payload</span>
              <span className={cn(row.fuelLevel > 20 ? "text-slate-900 dark:text-white" : "text-rose-500")}>{row.fuelLevel}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0">
              <div className={cn(
                "h-full transition-all duration-1000",
                row.fuelLevel > 20 ? "bg-primary" : "bg-rose-500 animate-pulse"
               )} style={{ width: `${row.fuelLevel}%` }} />
           </div>
        </div>
      )
    },
    {
      header: "Service Interval",
      cell: (row) => (
        <div className="flex items-center gap-3">
           <div className="h-6 w-6 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
           </div>
           <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums">{row.nextService}</span>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      
      {/* HEADER SECTION - CINEMATIC */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 dark:border-slate-800 pb-12">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                  <Construction className="h-3.5 w-3.5" /> Fleet Oversight
               </span>
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
               Machinery <br /> <span className="text-primary not-italic">Arsenal</span>
            </h1>
         </div>

         <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl rounded-[1.5rem] border border-white/20 dark:border-slate-800/50 p-6 flex items-center gap-8 shadow-premium">
           <div className="flex flex-col">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Uptime</p>
              <p className="text-xl font-black text-slate-900 dark:text-white italic">94.2%</p>
           </div>
           <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
           <div className="flex flex-col">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Assets</p>
              <p className="text-xl font-black text-slate-900 dark:text-white italic">12 Units</p>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard title="Strategic Fleet" value="12 Units" icon={Truck} premium />
         <StatCard title="Critical Maintenance" value="2 Units" icon={Wrench} iconClassName="text-amber-500" premium />
         <StatCard title="Archive Value" value="₹1.4 Cr" icon={Settings} premium />
         <StatCard title="Protocol Integrity" value="Stable" icon={Shield} iconClassName="text-emerald-500" premium />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/20 dark:border-slate-800/50 shadow-premium">
         <div className="relative group flex-1 max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
               placeholder="Search registry by SID, operator, or type..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="h-16 pl-16 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-inner placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary/20"
            />
         </div>
         <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" className="h-16 px-10 rounded-[1.5rem] border-slate-100 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-4">
               <Activity className="h-5 w-5 text-primary" /> System Logs
            </Button>
            <Button className="h-16 px-12 bg-primary hover:bg-primary/95 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] gap-4 shadow-premium-primary">
               <Plus className="h-5 w-5" /> Provision Asset
            </Button>
         </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-[3.5rem] border border-white/20 dark:border-slate-800/50 shadow-premium overflow-hidden p-2 group">
         <DataTable data={mockMachinery} columns={columns} keyExtractor={(m) => m.id} />
      </div>

      <section className="bg-slate-950 rounded-[4rem] p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative overflow-hidden group shadow-premium-dark border border-white/5">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 scale-150">
            <Activity className="h-40 w-40 text-primary" />
         </div>
         <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-rose-500/20 blur-3xl rounded-full" />
         
         <div className="flex items-center gap-8 relative z-10">
            <div className="h-20 w-20 bg-rose-500/20 rounded-3xl flex items-center justify-center text-rose-500 animate-pulse border border-rose-500/20">
               <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
               <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Critical Protocol: Case 1107 EX</h4>
               <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Hardware Alert</p>
            </div>
         </div>
         <Button className="h-20 px-12 bg-white hover:bg-slate-50 text-slate-950 font-black uppercase text-[10px] tracking-[0.3em] rounded-[2rem] gap-6 group/btn shadow-[0_20px_40px_rgba(255,255,255,0.1)] relative z-10">
            Dispatch Technical Unit <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
         </Button>
      </section>

    </div>
  )
}
