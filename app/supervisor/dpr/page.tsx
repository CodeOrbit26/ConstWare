"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { mockDPRs } from "@/lib/services/mockData"
import { Button } from "@/components/ui/button"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
  History,
  FileText,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isFuture,
  isToday
} from "date-fns"
import Link from "next/link"

export default function SupervisorDPRHistoryPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  // In real app, filter by supervisor's assigned site. For now, site-1.
  const mySiteDPRs = mockDPRs.filter(d => d.siteId === 'site-1')

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getDayStatus = (day: Date) => {
    if (isFuture(day)) return 'future'
    const report = mySiteDPRs.find(d => isSameDay(new Date(d.date), day))
    if (report?.submitted) return 'submitted'
    return 'missing'
  }

  return (
    <DashboardLayout title="Tactical History: DPR Intelligence">
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-100 dark:border-slate-800 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5" /> Intelligence Registry
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Report <br /> <span className="text-primary not-italic">Synchronicity</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Global Site Compliance & Daily Progress Synchronization</p>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl rounded-[1.5rem] border border-white/20 dark:border-slate-800/50 p-6 flex items-center gap-8 shadow-premium group">
                 <div className="flex flex-col">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Protocol</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white italic uppercase">{format(currentMonth, 'MMMM')}</p>
                 </div>
                 <div className="h-10 w-px bg-slate-100 dark:bg-slate-800" />
                 <Button asChild className="h-14 px-8 bg-primary hover:bg-primary/95 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-premium-primary">
                    <Link href="/supervisor/dpr/new">
                       <Plus className="h-5 w-5 mr-3" /> Initialize DPR
                    </Link>
                 </Button>
              </div>
           </div>
        </div>

        {/* MONTH SELECTOR - SOPHISTICATED */}
        <div className="flex items-center justify-between gap-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-premium">
           <Button variant="ghost" className="h-14 w-14 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-6 w-6 text-slate-400" />
           </Button>
           <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-12 w-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-inner">
                 <CalendarIcon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white tabular-nums">
                 {format(currentMonth, 'MMMM yyyy')}
              </span>
           </div>
           <Button variant="ghost" className="h-14 w-14 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-6 w-6 text-slate-400" />
           </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           {/* CALENDAR HEATMAP (Left 8 Cols) */}
           <div className="lg:col-span-8 space-y-10">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[4rem] border border-white/20 dark:border-slate-800/50 p-12 shadow-premium animate-in fade-in slide-in-from-bottom-12 duration-1000 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 scale-150">
                    <CalendarIcon className="h-40 w-40 text-primary" />
                 </div>
                 
                 <div className="grid grid-cols-7 gap-6 mb-12 relative z-10">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                       <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">{d}</div>
                    ))}
                 </div>
                 
                 <div className="grid grid-cols-7 gap-6 relative z-10">
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                      <div key={i} className="aspect-square" />
                    ))}
                    
                    {days.map(day => {
                       const status = getDayStatus(day)
                       const report = mySiteDPRs.find(d => isSameDay(new Date(d.date), day))
                       
                       return (
                         <Link 
                           key={day.toISOString()} 
                           href={(status === 'submitted' && report) ? `/contractor/dpr/${report.id}` : '#'}
                           className={cn(
                             "aspect-square rounded-[1.75rem] flex flex-col items-center justify-center gap-3 border transition-all relative overflow-hidden group/day",
                             status === 'future' && "border-slate-50 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-800/10 opacity-40 cursor-not-allowed",
                             status === 'submitted' && "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 shadow-xl shadow-emerald-500/0 hover:shadow-emerald-500/20",
                             status === 'missing' && "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 shadow-xl shadow-rose-500/0 hover:shadow-rose-500/20",
                             isToday(day) && "border-primary bg-primary/10"
                           )}
                         >
                            <span className={cn(
                               "text-xl font-black italic tracking-tighter transition-colors tabular-nums",
                               status === 'submitted' && "text-emerald-500 group-hover/day:text-white",
                               status === 'missing' && "text-rose-500 group-hover/day:text-white",
                               status === 'future' && "text-slate-300 dark:text-slate-700",
                               isToday(day) && "text-primary group-hover/day:text-white"
                            )}>
                               {format(day, 'd')}
                            </span>
                            {status === 'submitted' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover/day:bg-white animate-pulse" />}
                            {status === 'missing' && <div className="h-1.5 w-1.5 rounded-full bg-rose-500 group-hover/day:bg-white animate-pulse" />}
                         </Link>
                       )
                    })}
                 </div>
              </div>

              {/* LEGEND - REFINED */}
              <div className="flex items-center gap-8 px-12">
                 <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Committed</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/40" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Failure</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Future Interval</span>
                 </div>
              </div>
           </div>

           {/* COMPLIANCE BOARD (Right 4 Cols) */}
           <div className="lg:col-span-4 space-y-12">
              <div className="p-12 rounded-[4rem] bg-slate-950 text-white shadow-premium-dark space-y-10 relative overflow-hidden group transition-all hover:translate-y-[-4px] border border-white/5">
                 <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 scale-150">
                    <TrendingUp className="h-40 w-40 text-primary" />
                 </div>
                 <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-primary/20 blur-3xl rounded-full" />
                 
                 <div className="relative z-10 space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Monthly Compliance</h3>
                    <div className="flex flex-col gap-2">
                       <span className="text-7xl font-black italic tracking-tighter tabular-nums leading-none">{Math.round((mySiteDPRs.filter(d => d.submitted).length / 30) * 100)}%</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Target Integrity: 100%</span>
                    </div>
                    <div className="space-y-4 pt-10 border-t border-white/10 relative z-10">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <span>Sync Ratio</span>
                          <span>12/14 Units</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.4)]" style={{ width: '85%' }} />
                       </div>
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pt-2 animate-pulse">Critical: 2 Intervals Missing Sync</p>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl rounded-[3.5rem] border border-white/20 dark:border-slate-800/50 shadow-premium space-y-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Tactical Feed</h3>
                 <div className="space-y-8">
                    {mySiteDPRs.slice(0, 4).map(report => (
                      <div key={report.id} className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 group/item">
                         <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-black text-slate-950 dark:text-white text-xl italic shadow-inner rotate-3 group-hover/item:rotate-0 transition-transform">
                               {format(new Date(report.date), 'dd')}
                            </div>
                            <div className="space-y-0.5">
                               <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{format(new Date(report.date), 'MMM d')}</span>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Secured</p>
                            </div>
                         </div>
                         <Button variant="ghost" asChild className="h-10 w-10 p-0 rounded-xl hover:bg-primary hover:text-white transition-all">
                            <Link href={`/contractor/dpr/${report.id}`}><ChevronRight className="h-5 w-5" /></Link>
                         </Button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
