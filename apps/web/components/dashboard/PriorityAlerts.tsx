"use client"

import * as React from "react"
import { Alert } from "@/lib/services/mockData"
import { Badge } from "@/components/shared/Badge"
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function PriorityAlerts({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-emerald-50 text-center rounded-[2.5rem]">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-4" />
        <h3 className="font-black text-xl text-slate-900 tracking-tight uppercase">System Nominal</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Zero anomalies detected.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className="min-w-[80%] md:min-w-[360px] flex-shrink-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm relative overflow-hidden flex"
        >
          {/* Vertical indicator bar */}
          <div className={cn(
            "w-1.5 flex-shrink-0",
            alert.severity === 'critical' ? "bg-[#EF4444]" : "bg-amber-400"
          )} />
          
          <div className="flex-1 p-5">
            <div className="flex justify-between items-start mb-3">
              <Badge variant={alert.severity === 'critical' ? 'danger' : 'warning'} className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest">
                {alert.severity}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-tight uppercase">{alert.title}</h3>
              <p className="text-[10px] font-black text-[#F97316] uppercase tracking-widest">{alert.site}</p>
              <p className="text-[11px] font-medium text-slate-400 leading-tight line-clamp-2">{alert.description}</p>
            </div>
            
            <Link 
              href={alert.href}
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
            >
              {alert.actionLabel || 'Execute'}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
