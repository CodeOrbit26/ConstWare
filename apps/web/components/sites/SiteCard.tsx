"use client"

import { MapPin, Users, Package, Calendar, ArrowRight, UserCircle, TrendingUp, Copy, CheckCircle2 } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { SiteDetail } from "@/lib/services/mockData"
import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

interface SiteCardProps {
  site: SiteDetail
}

// Mock data for the sparkline
const sparkData = [
  { val: 40 }, { val: 30 }, { val: 45 }, { val: 50 }, { val: 45 }, { val: 60 }, { val: 55 }, { val: 70 },
]

export function SiteCard({ site }: SiteCardProps) {
  const [copied, setCopied] = React.useState(false)

  const statusColor = {
    active: "#22C55E",
    on_hold: "#EAB308",
    completed: "#94A3B8",
  }[site.status]

  const formattedCode = site.siteAccessCode 
    ? `${site.siteAccessCode.slice(0,2)}-${site.siteAccessCode.slice(2,4)}-${site.siteAccessCode.slice(4,6)}-${site.siteAccessCode.slice(6,8)}-${site.siteAccessCode.slice(8,10)}-${site.siteAccessCode.slice(10,12)}`
    : ""

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!formattedCode) return
    navigator.clipboard.writeText(formattedCode)
    setCopied(true)
    toast.success(`Site code ${formattedCode} copied! Share with your client.`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-navy dark:text-white truncate tracking-tight">
              {site.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 ">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{site.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={site.status === 'active' ? 'success' : site.status === 'on_hold' ? 'warning' : 'secondary'} className="rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-widest leading-none">
              {site.status.replace('_', ' ')}
            </Badge>
            {/* Site Access Code - Enlarged for excellent mobile visibility */}
            {site.siteAccessCode ? (
              <button 
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border-2 border-primary/30 rounded-xl font-mono text-xs font-black text-primary uppercase hover:bg-primary/20 active:scale-95 transition-all cursor-pointer group/copy shadow-sm"
              >
                {copied ? (
                  <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                ) : (
                  <Copy size={11} className="opacity-60 group-hover/copy:opacity-100 transition-opacity shrink-0" />
                )}
                <span className="tracking-wider">{formattedCode}</span>
              </button>
            ) : (
              <Link href={`/contractor/sites/${site.id}?tab=settings`} className="text-[8px] font-black uppercase text-slate-400 hover:text-primary tracking-widest italic transition-colors">
                 + ADD CLIENT
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Completion</span>
               <span className="text-sm font-bold text-primary">{site.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-300"
                 style={{ width: `${site.progress}%`, backgroundColor: statusColor }}
               />
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: "Labor", value: site.workers, color: "text-blue-500" },
              { icon: Package, label: "Alerts", value: "02", color: "text-rose-500" },
              { icon: Calendar, label: "Days Left", value: "45d", color: "text-amber-500" }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <item.icon className={cn("h-3 w-3", item.color)} />
                    <span className="text-sm font-bold text-navy dark:text-white tabular-nums">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Budget Burn Sparkline - Graph portion hidden purely on mobile phones */}
          <div className="flex items-center justify-between md:justify-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 md:h-16">
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Budget</span>
               <span className="text-xs font-bold text-navy dark:text-white">{formatCurrency(site.budgetTotal || 0)}</span>
            </div>
            
            {/* Graph container wrapped to display natively on tablets/laptops only */}
            <div className="hidden md:block flex-1 h-10 w-full max-w-[180px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={sparkData}>
                   <Area 
                     type="monotone" 
                     dataKey="val" 
                     stroke={statusColor} 
                     strokeWidth={2} 
                     fillOpacity={0.1} 
                     fill={statusColor} 
                     isAnimationActive={false} 
                    />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Supervisor Information */}
          <div className="flex items-center gap-3">
             <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-slate-400" />
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Supervisor</span>
                <span className="text-xs font-bold text-navy dark:text-white">{site.supervisor}</span>
             </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button 
            variant="default"
            className="flex-1 h-12 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-navy dark:bg-white text-white dark:text-navy hover:opacity-90 active:scale-95 transition-all shadow-sm"
            render={
              <Link href={`/contractor/sites/${site.id}`}>
                View Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            }
          />
          <Button variant="outline" className="h-12 px-6 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-800 transition-all">
            DPR
          </Button>
        </div>
      </div>
    </div>
  )
}
