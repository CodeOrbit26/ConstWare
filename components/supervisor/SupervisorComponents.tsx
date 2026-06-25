import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { Avatar } from "@/components/shared/Avatar"
import { 
  Users, 
  ClipboardCheck, 
  Package, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Camera,
  AlertTriangle,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { SiteDetail, Worker } from "@/lib/services/mockData"

// Site Identity Banner - CINEMATIC
export function SiteIdentityBanner({ site }: { site: SiteDetail }) {
  return (
    <div className="relative overflow-hidden rounded-[3.5rem] bg-slate-950 p-12 text-white shadow-premium group">
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl transition-all duration-1000 group-hover:scale-110" />
      <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
         <MapPin className="h-40 w-40" />
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Command: Site Lead
            </span>
            <Badge variant="outline" className={cn(
               "uppercase font-black text-[10px] tracking-[0.2em] px-5 py-2 rounded-full border",
               site.health === 'green' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            )}>
              {site.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
             <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">{site.name}</h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4">
                Operational Node: <span className="text-white">Active</span> <div className="h-1 w-12 bg-white/10 rounded-full" /> 
             </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="flex items-center gap-3 group/loc cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover/loc:bg-primary group-hover/loc:text-white transition-all">
                 <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">{site.location}</span>
            </div>
            <div className="flex items-center gap-3 group/cal cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover/cal:bg-primary group-hover/cal:text-white transition-all">
                 <Calendar className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Target: Dec 2025</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 flex flex-col items-center gap-6 shadow-premium-dark">
           <div className="relative h-24 w-24 scale-125">
              <svg className="h-full w-full -rotate-90 overflow-visible">
                 <circle cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                 <circle cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={276} strokeDashoffset={276 * (1 - site.progress/100)} className="text-primary transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="font-black text-2xl italic tracking-tighter tabular-nums">{site.progress}%</span>
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Mission Progress</p>
        </div>
      </div>
    </div>
  )
}

// Quick Actions - HIGH FIDELITY
export function QuickActionGrid() {
  const actions = [
    { label: "Deployment Archive", sub: "Attendance V2", icon: Users, color: "text-blue-500", bg: "bg-blue-500/5", href: "/supervisor/attendance" },
    { label: "Daily Intelligence", sub: "New DPR Report", icon: ClipboardCheck, color: "text-orange-500", bg: "bg-orange-500/5", href: "/supervisor/dpr/new" },
    { label: "Resource Payload", sub: "Material Usage", icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/5", href: "/supervisor/materials" },
    { label: "Capital Outlay", sub: "Add Site Expense", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/5", href: "/supervisor/finance" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {actions.map((action) => (
        <Link key={action.label} href={action.href} className="group transition-all hover:translate-y-[-4px] active:scale-[0.98]">
          <div className="h-full p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-primary/20 hover:shadow-premium transition-all flex flex-col items-start gap-6 relative overflow-hidden">
            <div className={cn("h-16 w-16 rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", action.bg, action.color)}>
              <action.icon className="h-8 w-8" />
            </div>
            <div className="space-y-1 relative z-10">
               <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none italic">{action.label}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{action.sub}</p>
            </div>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full opacity-50 group-hover:scale-150 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  )
}

// Today's Status Card - SOPHISTICATED
export function TodayStatusCard({ type, status }: { type: 'Attendance' | 'DPR', status: { completed: boolean, present?: number, total?: number, time?: string } }) {
  const isAttendance = type === 'Attendance'
  
  return (
    <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[3rem] overflow-hidden h-full flex flex-col shadow-premium group">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-950 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-950">
               {isAttendance ? <Users className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Today&apos;s {type} Status</h3>
         </div>
         {status.completed ? (
           <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-emerald-500/20 text-emerald-500 bg-emerald-500/5">COMPLETED</Badge>
         ) : (
           <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-rose-500/20 text-rose-500 bg-rose-500/5 animate-pulse">PENDING</Badge>
         )}
      </div>
      <div className="p-10 flex-1 flex flex-col justify-center">
         {isAttendance ? (
           <div className="space-y-8 w-full">
              <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-6">
                 <div>
                    <span className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter tabular-nums">{status.present}</span>
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 italic px-2">/</span>
                    <span className="text-2xl font-black text-slate-400 uppercase tracking-tighter">50</span>
                 </div>
                 <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cap Reached</span>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Deployment Grid</span>
                    <span>84% Capacity</span>
                 </div>
                 <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 p-0.5">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '84%' }} />
                 </div>
              </div>
              {!status.completed && (
                <Button className="w-full h-16 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-premium-primary">Initialize Roll Call</Button>
              )}
           </div>
         ) : (
           <div className="space-y-6 flex flex-col items-center">
              {status.completed ? (
                <div className="flex flex-col items-center gap-8 text-center group/res">
                   <div className="h-24 w-24 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover/res:scale-110 transition-transform">
                      <ClipboardCheck className="h-12 w-12" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Intelligence Committed</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Timestamp: {status.time}</p>
                   </div>
                   <Link href="/supervisor/dpr" className="h-14 px-8 border border-slate-100 dark:border-slate-800 rounded-2xl inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">Review Protocol Output</Link>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 text-center">
                   <div className="h-24 w-24 rounded-[2rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-200">
                      <ClipboardCheck className="h-10 w-10" />
                   </div>
                   <p className="text-sm text-slate-400 font-black uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">Capture site progress and mission challenges.</p>
                   <Button className="h-16 px-10 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-premium-primary">Commit DPR Intelligence</Button>
                </div>
              )}
           </div>
         )}
      </div>
    </div>
  )
}

// Workers at Site - REFINED
export function WorkerStatusList({ workers }: { workers: Worker[] }) {
  return (
    <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[3.5rem] shadow-premium overflow-hidden group">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-950 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-950">
               <Users className="h-5 w-5" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Operational Crew</h3>
         </div>
         <Button variant="ghost" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all rounded-xl">Full Registry</Button>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[500px] overflow-y-auto no-scrollbar p-2">
        {workers.map((worker) => (
          <div key={worker.id} className="p-6 flex items-center justify-between group/item hover:bg-slate-50 dark:hover:bg-slate-900 transition-all rounded-[2rem]">
            <div className="flex items-center gap-6">
              <div className="relative">
                 <Avatar initials={worker.name.charAt(0)} size="md" className="bg-slate-900 text-white font-black border-4 border-white dark:border-slate-800" />
                 <div className={cn(
                   "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white dark:border-slate-800",
                   worker.attendanceToday === 'present' ? "bg-emerald-500" : 
                   worker.attendanceToday === 'half_day' ? "bg-amber-500" : "bg-rose-500"
                 )} />
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight italic uppercase">{worker.name}</p>
                <div className="flex items-center gap-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{worker.skill}</p>
                   <div className="h-1 w-1 rounded-full bg-slate-200" />
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest">{worker.id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-10">
               <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-slate-900 dark:text-white italic tabular-nums">₹{worker.dailyWage}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Rate</span>
               </div>
               <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-slate-400" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Recent Activity Card - CINEMATIC
export function RecentActivityCard({ title, items, type }: { title: string, items: { title: string, desc: string }[], type: 'material' | 'expense' }) {
  return (
    <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[3rem] shadow-premium h-full group">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800">
         <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">{title}</h3>
      </div>
      <div className="p-8 space-y-8">
         {items.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                 <ClipboardCheck className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Grid Synchronized</p>
           </div>
         ) : (
           items.map((item, i) => (
             <div key={i} className="flex items-start gap-6 group/act cursor-pointer">
                <div className={cn(
                  "mt-1 h-10 w-10 rounded-xl flex items-center justify-center shadow-inner group-hover/act:scale-110 transition-transform",
                  type === 'material' ? "bg-amber-500/10 text-amber-500" : "bg-purple-500/10 text-purple-500"
                )}>
                   {type === 'material' ? <AlertTriangle className="h-5 w-5" /> : <History className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                   <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight italic truncate group-hover/act:text-primary transition-colors">{item.title}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  )
}

// Photo Upload Section - HIGH FIDELITY
export function PhotoUploadSection() {
  return (
    <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] p-16 transition-all hover:border-primary/40 hover:bg-white dark:hover:bg-slate-900 group shadow-inner">
       <div className="flex flex-col items-center gap-10 text-center">
          <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:rotate-12 transition-all duration-700 shadow-premium">
             <Camera className="h-10 w-10" />
          </div>
          <div className="space-y-4">
             <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Site Evidence Quick Upload</h3>
             <p className="text-xs text-slate-400 font-black uppercase tracking-[0.4em] max-w-[400px]">Capture today&apos;s site progress and mission critical milestones.</p>
          </div>
          <Button className="h-16 px-12 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-premium-primary transition-all active:scale-95">
             Provision Files
          </Button>
       </div>
    </div>
  )
}
