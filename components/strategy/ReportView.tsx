"use client"

import * as React from "react"
import { 
  Download, 
  Save, 
  Share2, 
  RefreshCcw, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Package, 
  Hammer,
  Clock,
  Wallet,
  Building2,
  ChevronRight,
  Layout as LayoutIcon,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { formatINR } from "@/lib/utils/calculations"

interface ReportViewProps {
  data: any
  onBack: () => void
  onSaveToSite: () => void
}

import { generateSiteCode, formatSiteCode } from "@/lib/utils/siteCodeGenerator"
import { Copy, Check } from "lucide-react"

export function ReportView({ data, onBack, onSaveToSite }: ReportViewProps) {
  const [copied, setCopied] = React.useState(false)
  if (!data) return null

  const info = data.project_info || {}
  const rawSiteCode = generateSiteCode({
    clientName: info.client_name || "Client",
    siteName: info.plot_area ? `Plot ${info.plot_area}` : "Site",
    startDate: new Date().toISOString().split('T')[0],
    contractorName: "Abhay Sharma",
    city: info.city || "Mumbai"
  })
  const displayCode = formatSiteCode(rawSiteCode)

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Access Code copied to clipboard!")
  }

  const summary = data.cost_summary || {
    total_project_cost: 4500000,
    cost_per_sqft: 2250,
    timeline_months: 8.5
  }

  const breakdown = [
    { label: "Exterior Division", cost: summary.exterior_cost || summary.total_project_cost * 0.65, icon: Hammer, color: "text-orange-500" },
    { label: "Interior Division", cost: summary.interior_cost || summary.total_project_cost * 0.30, icon: LayoutIcon, color: "text-emerald-500" },
    { label: "Contingency & Buffer", cost: summary.contingency || summary.total_project_cost * 0.05, icon: Wallet, color: "text-purple-500" },
  ]

  return (
    <div className="space-y-12 animate-in zoom-in-95 duration-700 pb-32">
      
      <div className="space-y-4 text-center">
         <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 uppercase font-bold tracking-widest text-[10px]">
            System Validated Estimate
         </Badge>
         <h1 className="text-4xl font-bold text-navy dark:text-white tracking-tight italic uppercase leading-none">
            YOUR COMPLETE <span className="text-primary not-italic">PROJECT REPORT</span>
         </h1>
      </div>

      {/* HERO COST CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-sm relative">
         <div className="absolute top-0 right-0 p-8 h-full flex flex-col justify-between items-end border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-xl group">
            <div className="text-right">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Grand Total Estimate</p>
               <p className="text-6xl font-bold text-navy dark:text-white italic tracking-tighter">₹{formatINR(summary.total_project_cost)}</p>
            </div>
            <div className="flex gap-12 text-right">
               <div>
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mb-1 italic">Cost per sqft</p>
                  <p className="text-2xl font-bold text-navy dark:text-white italic">₹{formatINR(summary.cost_per_sqft)}</p>
               </div>
               <div>
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mb-1 italic">Timeline Forecast</p>
                  <p className="text-2xl font-bold text-navy dark:text-white italic">{summary.timeline_months} Months</p>
               </div>
            </div>
         </div>

         <div className="p-12 lg:w-[60%] space-y-8 relative z-10">
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <FileText className="h-8 w-8" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-navy dark:text-white uppercase italic tracking-tight">{data.project_info?.archetype || "Residential Villa"}</h3>
                  <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                     <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Site ID: <span className="text-primary font-bold">{displayCode}</span></p>
                     <button 
                       onClick={handleCopy}
                       className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-primary/20 hover:text-primary transition-all text-[9px] font-black uppercase tracking-widest text-slate-400"
                     >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy Access Code"}
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               {[
                 { label: "Plot Area", value: `${data.project_info?.plot_area || "2500"} sqft` },
                 { label: "Built-up Area", value: `${data.project_info?.area_sqft || "2000"} sqft` },
                 { label: "Location", value: data.project_info?.city || "Mumbai" },
                 { label: "Quality Grade", value: data.project_info?.grade || "Luxury" }
               ].map((item, i) => (
                 <div key={i} className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-navy dark:text-white italic">{item.value}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* STRUCTURAL INTELLIGENCE NODE */}
      {data.structural_intelligence && (
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[2.5rem] p-10 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -z-10" />
           
           <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary italic">Autonomous Structural Recommendation</span>
              </div>
              <h3 className="text-3xl font-bold text-navy dark:text-white italic tracking-tight">{data.structural_intelligence.recommended_structure}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-primary/80 max-w-lg leading-relaxed">
                {data.structural_intelligence.reasoning}
              </p>
           </div>
           
           <div className="flex gap-4 lg:w-[50%]">
              <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 text-center shadow-sm">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cement Req.</p>
                 <p className="text-2xl font-bold text-navy dark:text-white italic">{data.structural_intelligence.cement_bags_est} <span className="text-xs text-slate-500">Bags</span></p>
              </div>
              <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 text-center shadow-sm">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Steel Req.</p>
                 <p className="text-2xl font-bold text-navy dark:text-white italic">{data.structural_intelligence.steel_tons_est} <span className="text-xs text-slate-500">Tons</span></p>
              </div>
              <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 text-center shadow-sm">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sand / Agg.</p>
                 <p className="text-2xl font-bold text-navy dark:text-white italic">{data.structural_intelligence.sand_cu_m_est} <span className="text-xs text-slate-500">cu.m</span></p>
              </div>
           </div>
        </div>
      )}

      {/* COST BREAKDOWN GRID */}
      {/* COST BREAKDOWN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {breakdown.map((item, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <div className={cn("h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center", item.color)}>
                    <item.icon className="h-6 w-6" />
                 </div>
                 <Badge variant="outline" className="text-[9px] font-bold border-slate-200 dark:border-slate-800 text-slate-500 uppercase">{Math.round((item.cost/summary.total_project_cost)*100)}%</Badge>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                 <p className="text-2xl font-bold text-navy dark:text-white italic tracking-tight">₹{formatINR(item.cost)}</p>
              </div>
           </div>
         ))}
      </div>

      {/* MATERIALS SUMMARY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] overflow-hidden">
         <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-navy dark:text-white italic uppercase tracking-tight">Top Material Forecast</h3>
            <Button variant="outline" size="sm" className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[9px] font-bold uppercase tracking-widest gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all">
               <Download className="h-4 w-4" /> Export BOQ (CSV)
            </Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                     {["Material", "Total Qty", "Unit", "Rate (₹)", "Est. Total"].map(h => (
                       <th key={h} className="px-8 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">{h}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(data.material_summary || []).slice(0, 10).map((m: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                       <td className="px-8 py-4 text-[11px] font-bold text-navy dark:text-white italic">{m.material}</td>
                       <td className="px-8 py-4 text-[11px] font-medium text-slate-500 font-mono">{m.qty}</td>
                       <td className="px-8 py-4 text-[9px] font-bold uppercase text-slate-400">{m.unit}</td>
                       <td className="px-8 py-4 text-[11px] font-medium text-slate-500 font-mono">₹{m.rate}</td>
                       <td className="px-8 py-4 text-[11px] font-bold text-primary font-mono italic">₹{formatINR(m.total)}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* ACTIONS */}
      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4">
         <Button className="flex-1 h-16 rounded-2xl bg-white dark:bg-slate-800 text-navy dark:text-white font-bold uppercase text-[10px] tracking-[0.3em] gap-3 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Download className="h-5 w-5" /> Download PDF Report
         </Button>
         <Button onClick={onSaveToSite} className="flex-1 h-16 rounded-2xl bg-primary hover:bg-orange-600 text-white font-bold uppercase text-[10px] tracking-[0.3em] gap-3 shadow-md transition-all">
            <Save className="h-5 w-5" /> Archive to Cloud
         </Button>
         <Button className="h-16 px-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Share2 className="h-5 w-5" /> Share link
         </Button>
         <Button onClick={onBack} variant="outline" className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
            <RefreshCcw className="h-5 w-5" />
         </Button>
      </div>

    </div>
  )
}

