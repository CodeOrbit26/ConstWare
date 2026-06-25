"use client"

import * as React from "react"
import { Badge } from "@/components/shared/Badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Calendar, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon,
  AlertCircle,
  Building2,
  TrendingUp,
  ExternalLink,
  ChevronRight
} from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { SiteDetail, DPR } from "@/lib/services/mockData"

// Project Hero Card
export function ClientProjectHero({ site }: { site: SiteDetail }) {
  return (
    <div className="relative overflow-hidden rounded-[3.5rem] bg-slate-950 p-12 lg:p-16 text-white shadow-premium group">
      <div className="absolute top-0 right-0 h-full w-2/3 bg-gradient-to-l from-primary/20 to-transparent blur-3xl rounded-full translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-blue-600/10 blur-3xl rounded-full" />
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
        <div className="space-y-10 flex-1">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
               {site.status}
            </span>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Property of {site.client}</span>
          </div>

          <div className="space-y-4">
             <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                {site.name}
             </h1>
             <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-slate-200">{site.location}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-slate-200">{site.description.split('.')[0]}</span>
                </div>
             </div>
          </div>
          
          <div className="space-y-4 pt-4 max-w-md">
             <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Execution Velocity</p>
                <div className="text-right">
                   <p className="text-3xl font-black text-white leading-none">{site.progress}%</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Completion</p>
                </div>
             </div>
             <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-1000" style={{ width: `${site.progress}%` }} />
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-8 lg:text-right">
           <div className="p-8 rounded-[2.5rem] bg-white text-slate-900 shadow-2xl space-y-6">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Chief Execution Partner</p>
                 <p className="text-2xl font-black tracking-tight text-slate-950">Abhay Sharma</p>
              </div>
              <div className="flex flex-col gap-3">
                 <Button className="h-14 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">
                    Direct Secure Line
                 </Button>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available for Technical consultation</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

// Today's Update Section
export function ClientTodayUpdate({ dpr }: { dpr: DPR | undefined }) {
  if (!dpr) return (
     <div className="p-20 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
           <Clock className="h-10 w-10 text-slate-300" />
        </div>
        <div className="space-y-1">
           <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Awaiting Site Intake</h3>
           <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">Digital site reports are aggregated and published by 19:00 IST daily.</p>
        </div>
     </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        <div className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-premium border-none relative overflow-hidden group">
           <div className="absolute top-0 left-0 h-1.5 w-full bg-slate-950" />
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Executive Site Summation</h2>
                 <p className="text-sm font-bold text-slate-900 dark:text-white">{dpr.date}</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 font-black uppercase text-[9px] tracking-widest">Daily Milestone Reached</Badge>
           </div>

           <div className="space-y-8">
              <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">&quot;{dpr.summary}&quot;</p>
              
              <div className="flex items-center gap-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                       <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">{dpr.attendance.present} Personnel</p>
                       <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Force Deployed</p>
                    </div>
                 </div>
                 {dpr.issues && dpr.issues.severity !== 'none' ? (
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                          <AlertCircle className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">{dpr.issues.severity.toUpperCase()}</p>
                          <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Risk Vector</p>
                       </div>
                    </div>
                 ) : (
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">PERFECT</p>
                          <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Operating Safety</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Visual Evidence</h2>
            <span className="text-[9px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest"><div className="h-1 w-1 rounded-full bg-primary animate-ping" /> Real-time Sync</span>
         </div>
         <div className="grid grid-cols-1 gap-6">
            {dpr.photos.slice(0, 2).map((photo: any, i: number) => (
              <div key={i} className="group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-premium border-none cursor-zoom-in">
                 <img src={photo.url} alt="Site" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Technical Capture</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tight leading-tight">{photo.caption}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}

// Photo Timeline Gallery
export function ClientPhotoTimeline({ photos }: { photos: any[] }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between px-2">
         <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-none">Intelligence Archive</h2>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Progress Chronology</h3>
         </div>
         <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 shadow-premium text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-primary transition-all">
           Full Historical Audit <ChevronRight className="h-4 w-4 ml-2" />
         </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {photos.map((photo, i) => (
           <div key={i} className={cn(
             "relative rounded-[2.5rem] overflow-hidden shadow-premium group cursor-pointer border-none",
             i === 1 ? "md:row-span-2 md:col-span-2" : "aspect-square"
           )}>
              <img src={photo.url} alt="Status" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-center">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{photo.date}</p>
                 <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 h-12 rounded-xl font-black uppercase text-[9px] tracking-widest px-8">Expand View</Button>
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}

// Financial Transparency
export function ClientFinancialCard({ budget, spent, categories }: { budget: number, spent: number, categories: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 border-y border-slate-100 dark:border-slate-800">
       <div className="space-y-10">
          <div className="space-y-2">
             <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Capital Management</h2>
             <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none italic">Financial <span className="text-primary not-italic">Integrity</span></h3>
          </div>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">A real-time, audited breakdown of project capital utilization. We maintain absolute transparency on every rupee deployed.</p>
          
          <div className="p-10 rounded-[3.5rem] bg-slate-950 text-white shadow-premium relative overflow-hidden group">
             <div className="absolute top-0 right-0 h-full w-24 bg-primary/20 blur-3xl rounded-full translate-x-12" />
             <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Valuation</span>
                      <p className="text-4xl font-black tracking-tight tabular-nums italic">{formatCurrency(budget)}</p>
                   </div>
                   <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-7 w-7" />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Utilization Quotient</p>
                      <p className="text-2xl font-black text-white">{Math.round((spent/budget)*100)}%</p>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-primary shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all duration-1000" style={{ width: `${(spent/budget)*100}%` }} />
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-premium border-none space-y-10">
          <div className="flex items-center justify-between">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Investment Allocation</h3>
             <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Q2 2024 Audit</span>
          </div>
          <div className="space-y-10">
             {categories.map((cat, i) => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-900 dark:text-white">
                     <span>{cat.name}</span>
                     <span className="tabular-nums">{cat.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                     <div className={cn("h-full transition-all duration-1000", cat.color)} style={{ width: `${cat.percentage}%` }} />
                  </div>
               </div>
             ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-center italic mt-10">Calculated based on GSTR-3B filings and direct procurement ledger.</p>
       </div>
    </div>
  )
}

// Project Milestones
export function ClientMilestones({ milestones }: { milestones: SiteDetail['milestones'] }) {
  return (
    <div className="space-y-16 py-10">
       <div className="text-center space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">Project Vector</h2>
          <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Operational <span className="text-primary not-italic">Milestones</span></h3>
       </div>
       
       <div className="relative max-w-5xl mx-auto py-10">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-16">
             {milestones.map((ms, i) => (
               <div key={ms.id} className={cn(
                 "relative flex flex-col md:flex-row items-center gap-10 md:gap-0",
                 i % 2 === 0 ? "md:flex-row-reverse" : ""
               )}>
                 <div className="absolute left-8 md:left-1/2 h-14 w-14 rounded-[1.5rem] border-8 border-slate-50 dark:border-slate-950 bg-white dark:bg-slate-900 shadow-premium -translate-x-1/2 flex items-center justify-center z-10 transition-all hover:scale-125 group">
                    {ms.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-primary transition-colors" />
                    )}
                 </div>
                 
                 <div className="w-full md:w-[42%]">
                    <div className={cn(
                      "p-8 rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-premium hover:shadow-2xl transition-all duration-500 relative group",
                      ms.completed ? "grayscale-[0.5] opacity-60 hover:grayscale-0 hover:opacity-100" : "scale-105"
                    )}>
                       <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">{ms.date}</span>
                          <span className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                             ms.completed ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-primary text-white shadow-lg shadow-primary/20"
                          )}>
                             {ms.completed ? "ACHIEVED" : "IN PROGRESS"}
                          </span>
                       </div>
                       <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">{ms.title}</h4>
                    </div>
                 </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  )
}

// Contact Card
export function ClientContactSection() {
  return (
    <div className="rounded-[4rem] bg-slate-950 p-16 lg:p-24 text-white relative overflow-hidden group">
       <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent blur-3xl opacity-50" />
       <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
       
       <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="text-center lg:text-left space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Client Relations</span>
             </div>
             <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none italic">Technical <span className="text-primary not-italic">Consultation</span></h2>
             <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-lg">Request a digital site walk-through or schedule a personalized structural review with our executive engineering team.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
             <Button className="h-16 px-10 bg-white text-slate-950 hover:bg-slate-100 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:scale-105">
                <Phone className="h-5 w-5 mr-3 text-primary" /> Executive Voice
             </Button>
             <Button variant="outline" className="h-16 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all">
                <MessageSquare className="h-5 w-5 mr-3 text-primary" /> Technical Intake
             </Button>
          </div>
       </div>
    </div>
  )
}
