"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, Users, Package, Calendar, ArrowRight, UserCircle, Activity } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SiteDetail } from "@/lib/services/mockData"

interface SiteListItemProps {
  site: SiteDetail
}

export function SiteListItem({ site }: SiteListItemProps) {
  const statusColor = {
    active: "bg-emerald-500",
    on_hold: "bg-amber-500",
    completed: "bg-slate-400",
  }[site.status]

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Status indicator strip */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", statusColor)} />

        <div className="flex-1 flex items-center gap-4 min-w-0 w-full">
          <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Activity className={cn("h-5 w-5", site.status === 'active' ? 'text-emerald-500' : 'text-slate-400')} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-navy dark:text-white truncate group-hover:text-primary transition-colors">
              {site.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <MapPin className="h-3 w-3" />
              {site.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 w-full lg:w-auto">
          <div className="hidden sm:flex flex-col min-w-[120px]">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Progress</span>
             <div className="flex items-center gap-3">
               <div className="h-1.5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-primary" 
                   style={{ width: `${site.progress}%` }} 
                 />
               </div>
               <span className="text-sm font-bold text-primary">{site.progress}%</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Labor</span>
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm font-bold text-navy dark:text-white tabular-nums">{site.workers}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lead</span>
              <div className="flex items-center gap-2">
                <UserCircle className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-navy dark:text-white truncate max-w-[80px]">{site.supervisor.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Badge variant={site.status === 'active' ? 'success' : site.status === 'on_hold' ? 'warning' : 'secondary'} className="rounded-lg px-3 py-1 text-[9px] font-bold uppercase tracking-widest leading-none">
               {site.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-navy dark:hover:bg-white hover:text-white dark:hover:text-navy transition-all rounded-xl border border-slate-200 dark:border-slate-800"
            render={
              <Link href={`/contractor/sites/${site.id}`}>
                View Info <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            }
          />
        </div>
      </div>
    </div>
  )
}
