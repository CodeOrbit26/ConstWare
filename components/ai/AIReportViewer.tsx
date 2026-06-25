"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, Info, RefreshCw } from "lucide-react"

export function AIReportViewer({ report, onReanalyze }: { report: any, onReanalyze: () => void }) {
  if (!report) return null

  return (
    <div className="space-y-12 animate-in zoom-in-95 duration-1000">
       <div className="flex justify-between items-end">
          <div className="space-y-2">
             <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Analysis <span className="text-primary not-italic">Synthesis</span></h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Neural review complete</p>
          </div>
          <Button onClick={onReanalyze} variant="outline" className="rounded-xl border-slate-800 gap-2 h-12 text-[10px] font-black uppercase tracking-widest">
             <RefreshCw className="h-4 w-4" /> New Analysis
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-slate-800 rounded-[3rem] p-10 space-y-8">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                   <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black text-white uppercase italic">Positive Findings</h4>
             </div>
             <ul className="space-y-4">
                {(report.positives || ["Structural alignment matches blueprints", "Material quality within standard ranges", "Safety protocols active"]).map((p: any, i: number) => (
                   <li key={i} className="flex gap-4 text-[11px] font-medium text-slate-400 group">
                      <span className="h-4 w-4 shrink-0 rounded bg-emerald-500/10 flex items-center justify-center text-[8px] font-black text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all italic">{i+1}</span>
                      {p}
                   </li>
                ))}
             </ul>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-[3rem] p-10 space-y-8">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                   <AlertTriangle className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black text-white uppercase italic">Risk Vectors</h4>
             </div>
             <ul className="space-y-4">
                {(report.risks || ["Minor material wastage on Sector B", "Welfare facility requirements pending", "Slab curing duration monitor recommended"]).map((r: any, i: number) => (
                   <li key={i} className="flex gap-4 text-[11px] font-medium text-slate-400 group">
                      <span className="h-4 w-4 shrink-0 rounded bg-amber-500/10 flex items-center justify-center text-[8px] font-black text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all italic">{i+1}</span>
                      {r}
                   </li>
                ))}
             </ul>
          </div>
       </div>

       <div className="p-12 bg-primary/5 border border-primary/20 rounded-[3rem] space-y-6">
          <div className="space-y-1">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Executive Summary</p>
             <p className="text-lg font-bold text-white italic leading-relaxed">
                {report.summary || "The neural synthesis indicates a high level of operational compliance. Critical path items are progressing within designated tolerances. Material utilization efficiency is calculated at 94.2%."}
             </p>
          </div>
       </div>
    </div>
  )
}
