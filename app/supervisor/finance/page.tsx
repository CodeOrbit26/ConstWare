"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { KhataEntryPanel } from "@/components/finance/KhataEntryPanel"
import { TransactionTable } from "@/components/finance/FinanceComponents"
import { AlertCircle, Lock } from "lucide-react"
import { Badge } from "@/components/shared/Badge"

export default function SupervisorFinancePage() {
  return (
    <DashboardLayout title="Fiscal: Site Expenditures">
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-100 dark:border-slate-800 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5" /> Site Fiscal Ledger
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Expense <br /> <span className="text-primary not-italic">Reporting</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Tactical Site Expenditures & Petty Cash Intelligence</p>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Access Authority</p>
                 <Badge variant="outline" className="h-12 px-6 rounded-2xl border-amber-500/20 text-amber-500 bg-amber-500/5 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-premium-sm">
                    <Lock className="h-4 w-4" /> Supervisor Level-02
                 </Badge>
              </div>
           </div>
        </div>

        {/* ACCESS PROTOCOL BANNER */}
        <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/20 dark:border-slate-800/50 shadow-premium flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 h-full w-64 bg-primary/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
           <div className="h-16 w-16 rounded-[1.25rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-premium relative z-10">
              <AlertCircle className="h-8 w-8" />
           </div>
           <div className="space-y-1 relative z-10">
              <h4 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tight uppercase">Operational Sovereignty Protocol</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-2xl">
                 Authorized for local site expenditure logging and recent audit visibility. Global Master Ledger oversight is cryptographically restricted to Contractor-level nodes.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           {/* LOGGING COMMAND CENTER */}
           <div className="lg:col-span-5 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">01. Transaction Entry</h3>
              </div>
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[3.5rem] p-4 shadow-premium border border-white/20 dark:border-slate-800/50 overflow-hidden">
                 <KhataEntryPanel />
              </div>
           </div>
           
           {/* RECENT AUDIT FEED */}
           <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 pr-4">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">02. Visual Reporting Logic</h3>
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-50">
                    <Lock className="h-3.5 w-3.5" /> Immutable Sync
                 </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[3.5rem] shadow-premium border border-white/20 dark:border-slate-800/50 overflow-hidden">
                 <TransactionTable />
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
