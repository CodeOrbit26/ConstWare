"use client"

import * as React from "react"
import { Mail, Clock, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/shared/Badge"

export function ScheduledReportsSection() {
  const [email, setEmail] = React.useState("contractor@constware.ai")
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm p-10 space-y-10">
       <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                   <Clock size={20} />
                </div>
                <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter italic">Automated Dispatch</h3>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                Queue intelligence reports for automated delivery to your inbox. Powered by Supabase + Resend.
             </p>
          </div>

          <div className="flex flex-col md:items-end gap-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dispatch Destination</label>
             <div className="flex gap-2">
                <Input 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="h-11 w-full md:w-64 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold text-xs"
                />
                <Button variant="outline" className="h-11 border-slate-200 uppercase font-black text-[10px] tracking-widest px-4 rounded-xl">
                   Update
                </Button>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScheduleCard 
             title="Daily Operational Summary" 
             description="Summary of attendance, DPRs, and critical alerts from all sites." 
             time="08:00 PM IST"
             defaultChecked={true}
          />
          <ScheduleCard 
             title="Weekly Financial Digest" 
             description="Consolidated P&L, expense trends, and upcoming milestone forecast." 
             time="Mon, 09:00 AM IST"
             defaultChecked={true}
          />
          <ScheduleCard 
             title="Monthly Performance Audit" 
             description="Detailed worker reliability ratings and site efficiency scores." 
             time="1st of Month, 10:00 AM"
             defaultChecked={false}
          />
       </div>

       <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Shield className="text-success h-6 w-6" />
             <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Configuration saved to secure edge vault. Reports will generate automatically.</p>
          </div>
          <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest p-0">
             Manage API Access <ArrowRight size={12} className="ml-1" />
          </Button>
       </div>
    </div>
  )
}

function ScheduleCard({ title, description, time, defaultChecked }: { title: string, description: string, time: string, defaultChecked: boolean }) {
  const [enabled, setEnabled] = React.useState(defaultChecked)

  return (
    <div className={cn(
      "p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6",
      enabled ? "bg-white border-primary shadow-xl shadow-primary/5" : "bg-slate-50 border-transparent opacity-60"
    )}>
       <div className="space-y-4">
          <div className="flex items-center justify-between">
             <Badge variant={enabled ? "primary" : "outline"} className="text-[8px] font-black tracking-[0.2em]">{enabled ? 'ACTIVE' : 'DISABLED'}</Badge>
             <Checkbox 
                checked={enabled} 
                onCheckedChange={(val) => setEnabled(!!val)} 
                className="h-5 w-5 rounded-lg data-[state=checked]:bg-primary border-slate-300" 
             />
          </div>
          <div className="space-y-1">
             <h4 className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">{title}</h4>
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{description}</p>
          </div>
       </div>

       <div className="flex items-center gap-2 pt-2">
          <Clock size={12} className="text-slate-300" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
       </div>
    </div>
  )
}

// Utility check for cn if not global
import { cn } from "@/lib/utils"
