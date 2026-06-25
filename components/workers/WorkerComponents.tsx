"use client"

import * as React from "react"
import { Star, CheckCircle2, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { mockWorkers, Worker } from "@/lib/services/mockData"
import Link from "next/link"

export function WorkerStatsBar({ stats }: { stats: any }) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium border-none">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Records</span>
        <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.total}</span>
      </div>
      <div className="flex flex-col gap-1 md:border-l md:pl-8 border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Verified Units</span>
        <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.available}</span>
      </div>
      <div className="flex flex-col gap-1 md:border-l md:pl-8 border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Deployed Site</span>
        <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.onSite}</span>
      </div>
      <div className="flex flex-col gap-1 md:border-l md:pl-8 border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Quality Score</span>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.avgRating}</span>
          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
        </div>
      </div>
    </div>
  )
}

export function WorkerCard({ worker, index = 0, viewMode = 'grid' }: { worker: Worker, index?: number, viewMode?: 'grid' | 'list' }) {
  const skillColors: Record<string, string> = {
    Mason: 'bg-gradient-to-br from-blue-500 to-blue-700',
    Carpenter: 'bg-gradient-to-br from-orange-500 to-orange-700',
    Electrician: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    Plumber: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
    Helper: 'bg-gradient-to-br from-slate-500 to-slate-700',
    'Bar Bender': 'bg-gradient-to-br from-red-500 to-red-700',
    Painter: 'bg-gradient-to-br from-pink-500 to-pink-700',
    Welder: 'bg-gradient-to-br from-purple-500 to-purple-700',
    Supervisor: 'bg-gradient-to-br from-indigo-500 to-indigo-700'
  }

  const initials = worker.name.split(' ').map(n => n[0]).join('')
  
  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-white dark:bg-slate-900 rounded-[2rem] shadow-premium-lg border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all duration-500 overflow-hidden relative flex items-center justify-between p-6 animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
      >
        <div className="flex items-center gap-6">
          <div className={cn(
            "h-14 w-14 rounded-[1.25rem] flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform duration-500 group-hover:scale-110",
            skillColors[worker.skill] || 'bg-slate-400'
          )}>
            {initials}
          </div>
          <div>
            <h4 className="font-exrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight text-[17px]">{worker.name}</h4>
            <div className="flex items-center gap-3 mt-1.5 opacity-80">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{worker.skill}</span>
                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">₹{worker.dailyWage}/d</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              worker.status === 'available' ? 'bg-emerald-500' : worker.status === 'on_site' ? 'bg-primary' : 'bg-rose-500'
            )} />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{worker.status.replace('_', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl shadow-inner">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-black text-amber-600 dark:text-amber-500">{worker.rating}</span>
          </div>
          
          <Button 
            variant="outline" 
            className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-md"
            render={
              <Link href={`/contractor/workers/${worker.id}`}>Inspect</Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div 
      className="group bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium-lg border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all duration-500 overflow-hidden relative animate-in fade-in zoom-in-95 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 blur-3xl rounded-full -translate-y-12 translate-x-12 group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-16 w-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
              skillColors[worker.skill] || 'bg-slate-400'
            )}>
              {initials}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight text-lg">{worker.name}</h4>
              <div className="flex items-center gap-2 mt-1.5">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{worker.skill}</span>
                 <div className="h-1 w-1 rounded-full bg-slate-300" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">₹{worker.dailyWage}/d</span>
              </div>
            </div>
          </div>
          <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
             <Star className="h-5 w-5 fill-amber-600 mr-0.5" />
             <span className="text-xs font-black">{worker.rating}</span>
          </div>
        </div>

        <div className="space-y-6 mb-8 relative z-10">
           <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-4 shadow-inner border border-slate-100/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full animate-pulse shadow-sm shadow-current",
                      worker.status === 'available' ? 'bg-emerald-500 text-emerald-500' : worker.status === 'on_site' ? 'bg-primary text-primary' : 'bg-rose-500 text-rose-500'
                    )} />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{worker.status.replace('_', ' ')}</span>
                 </div>
                 {worker.kycVerified && (
                   <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                     <CheckCircle2 className="h-3 w-3" /> KYC Valid
                   </div>
                 )}
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reliability Score</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{worker.reliabilityScore}%</p>
                 </div>
                 <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden shadow-inner">
                   <div className={cn("h-full transition-all duration-1000", worker.reliabilityScore > 80 ? "bg-emerald-500" : "bg-primary")} style={{ width: `${worker.reliabilityScore}%` }} />
                 </div>
              </div>
           </div>
        </div>

        <div className="flex gap-3 relative z-10">
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-all shadow-md group-hover:bg-primary group-hover:text-white"
            render={
              <Link href={`/contractor/workers/${worker.id}`}>View Record</Link>
            }
          />
          <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-md">
            <UserPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
