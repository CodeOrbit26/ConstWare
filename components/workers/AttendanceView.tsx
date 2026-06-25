"use client"

import * as React from "react"
import { Search, MapPin, CheckCircle2, RefreshCw, UserCheck, Sparkles, Building2, Calendar, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockWorkers, mockSites } from "@/lib/services/mockData"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { useFinanceStore } from "@/lib/store/useStore"

interface WorkerAttendance {
  status: 'Present' | 'Half Day' | 'Absent' | null
  overtimeHours: number
  note: string
}

export function AttendanceView() {
  const addTransaction = useFinanceStore(state => state.addTransaction)
  const saveAttendance = useFinanceStore(state => state.saveAttendance)
  const getAttendance = useFinanceStore(state => state.getAttendance)

  const [siteId, setSiteId] = React.useState('all')
  const [search, setSearch] = React.useState('')
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = React.useState<Record<string, WorkerAttendance>>({})
  const [globalStatus, setGlobalStatus] = React.useState<'Present' | 'Half Day' | 'Absent' | null>(null)
  const [gpsValid, setGpsValid] = React.useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)
  const [hasSubmitted, setHasSubmitted] = React.useState(false)

  // Load from store on site/date change
  React.useEffect(() => {
    const log = getAttendance(siteId, date)
    if (log) {
      setAttendance(log.records)
      setHasSubmitted(log.submitted)
    } else {
      setAttendance({})
      setHasSubmitted(false)
      setGlobalStatus(null)
    }
  }, [siteId, date, getAttendance])

  // Save to store whenever attendance or submission state changes
  React.useEffect(() => {
    if (Object.keys(attendance).length > 0 || hasSubmitted) {
      saveAttendance(siteId, date, attendance, hasSubmitted)
    }
  }, [attendance, hasSubmitted, siteId, date, saveAttendance])

  const activeWorkers = React.useMemo(() => {
    return mockWorkers.filter(w => 
      w.status !== 'unavailable' && (siteId === 'all' || w.assignedSiteId === siteId) &&
      (w.name.toLowerCase().includes(search.toLowerCase()) || w.skill.toLowerCase().includes(search.toLowerCase()))
    )
  }, [siteId, search])

  const stats = React.useMemo(() => {
    let present = 0, half = 0, absent = 0, cost = 0, overtimeCost = 0, overtimeHours = 0
    activeWorkers.forEach(w => {
      const rec = attendance[w.id]
      const status = rec?.status
      const wage = w.dailyWage || 0
      if (status === 'Present') { present++; cost += wage }
      if (status === 'Half Day') { half++; cost += (wage / 2) }
      if (status === 'Absent') absent++
      
      if (rec?.overtimeHours) {
        overtimeHours += rec.overtimeHours
        const otVal = rec.overtimeHours * (wage / 8)
        overtimeCost += otVal
        cost += otVal
      }
    })
    return { 
      present, 
      half, 
      absent, 
      unmarked: activeWorkers.length - (present + half + absent), 
      cost, 
      overtimeCost, 
      overtimeHours 
    }
  }, [attendance, activeWorkers])

  const setWorkerStatus = (id: string, status: 'Present' | 'Half Day' | 'Absent') => {
    if (hasSubmitted) return
    setAttendance(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { overtimeHours: 0, note: '' }), status }
    }))
  }

  const updateWorkerOvertime = (id: string, hoursDelta: number) => {
    if (hasSubmitted) return
    setAttendance(prev => {
      const cur = prev[id] || { status: null, overtimeHours: 0, note: '' }
      return { 
        ...prev, 
        [id]: { ...cur, overtimeHours: Math.max(0, cur.overtimeHours + hoursDelta) } 
      }
    })
  }

  const markAll = (status: 'Present' | 'Half Day' | 'Absent') => {
    if (hasSubmitted) return
    const newAtt = { ...attendance }
    let markedCount = 0
    activeWorkers.forEach(w => {
      newAtt[w.id] = { ...(newAtt[w.id] || { overtimeHours: 0, note: '' }), status }
      markedCount++
    })
    setAttendance(newAtt)
    setGlobalStatus(status)
    toast.success(`Marked all ${markedCount} workers as ${status}.`)
  }

  const resetAttendance = () => {
    if (hasSubmitted) return
    setAttendance({})
    setGlobalStatus(null)
    toast.success('Attendance records cleared.')
  }

  const captureGps = () => {
    toast('Acquiring high-precision GPS fix...')
    setTimeout(() => {
      setGpsValid(true)
      toast.success('Location verified within authorized site boundary.')
    }, 800)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    toast("Encrypting and saving attendance logs...")
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200)) 
    
    // Inject into Finance Ledger in real-time
    addTransaction({
      type: 'expense',
      category: 'Labour',
      amount: stats.cost,
      date: date,
      description: `Daily attendance payout: ${stats.present} Present, ${stats.half} Half-day. Site: ${siteId === 'all' ? 'All' : siteId}`,
      siteId: siteId === 'all' ? 'multiple' : siteId,
      loggedBy: 'System (Attendance Auto-Sync)'
    })

    toast.success(`Attendance successfully logged! Total daily wages: ₹${stats.cost.toLocaleString('en-IN')}`)
    setIsSubmitting(false)
    setShowConfirmModal(false)
    setHasSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700 w-full pb-36 xl:pb-0">
      
      {/* ------------------------------------------------ */}
      {/* 1. COMBINED TOP PANEL: CONTROLS & SEARCH         */}
      {/* ------------------------------------------------ */}
      <div className="bg-[#111827] rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col shrink-0">
         {/* Top dynamic gradient accent line removed as requested */}
         
         {/* Integrated Search Bar & Live Counter Chips Section */}
         <div className="p-3 md:p-4 bg-[#0A0F1E]/40 flex flex-col gap-2.5">
            {/* Search Input */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
               <Input 
                  placeholder="Search worker by name or skill..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 bg-[#111827] border border-white/5 rounded-xl text-white placeholder:text-slate-500 text-xs font-medium tracking-wide focus:ring-1 focus:ring-[#F97316]/50 shadow-inner"
               />
            </div>


         </div>

         {/* Internal Divider */}
         <div className="h-px bg-white/5 w-full" />

         {/* Upper Form Controls Section - Highly Compact Mobile Design */}
         <div className="p-3 md:p-4 flex flex-col gap-2.5">
            {/* Row 1: Site and Date Selector Side-by-Side */}
            <div className="grid grid-cols-2 gap-2 w-full">
               {/* Site Dropdown */}
               <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-0.5 truncate">
                     <Building2 className="h-3 w-3 text-[#F97316] shrink-0" /> <span className="truncate">Site Location</span>
                  </label>
                  <Select value={siteId} onValueChange={setSiteId}>
                    <SelectTrigger className="w-full h-10 bg-[#0A0F1E] border border-white/5 rounded-xl text-xs font-bold text-white truncate focus:ring-1 focus:ring-[#F97316]">
                      <SelectValue placeholder="Select Site" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-slate-800 text-slate-200 rounded-xl shadow-xl">
                      <SelectItem value="all" className="font-bold text-[#F97316]">🏢 All Active Sites</SelectItem>
                      {mockSites.map(s => <SelectItem key={s.id} value={s.id} className="font-medium text-xs">{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>

               {/* Date Picker */}
               <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-0.5 truncate">
                     <Calendar className="h-3 w-3 text-emerald-500 shrink-0" /> <span className="truncate">Attendance Date</span>
                  </label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 bg-[#0A0F1E] border border-white/5 rounded-xl text-xs font-bold text-white [&::-webkit-calendar-picker-indicator]:filter-invert px-2 focus:ring-1 focus:ring-emerald-500"
                  />
               </div>
            </div>
         </div>

      </div>

      {/* Horizontal live summary chips - Single line non-scrollable */}
      <div className="flex items-center justify-between w-full gap-1 text-[10px] sm:text-[11px] md:text-xs font-bold tracking-tight py-1 select-none">
         <div className="flex-1 px-1 py-1.5 rounded-lg bg-[#111827] border border-white/5 text-slate-400 flex items-center justify-center gap-1 shadow-sm overflow-hidden">
            <span className="truncate">Total</span> 
            <span className="text-white font-black">{activeWorkers.length}</span>
         </div>
         <div className="flex-1 px-1 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-1 shadow-sm overflow-hidden">
            <span className="truncate">Present</span> 
            <span className="text-emerald-300 font-black">{stats.present}</span>
         </div>
         <div className="flex-1 px-1 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center gap-1 shadow-sm overflow-hidden">
            <span className="truncate">Half</span> 
            <span className="text-amber-300 font-black">{stats.half}</span>
         </div>
         <div className="flex-1 px-1 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center gap-1 shadow-sm overflow-hidden">
            <span className="truncate">Absent</span> 
            <span className="text-rose-300 font-black">{stats.absent}</span>
         </div>
         {stats.unmarked > 0 && (
           <div className="flex-1 px-1 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center gap-1 shadow-sm animate-pulse overflow-hidden">
              <span className="truncate hidden sm:inline">Unmarked</span>
              <span className="truncate sm:hidden">None</span> 
              <span className="text-orange-300 font-black">{stats.unmarked}</span>
           </div>
         )}
      </div>

      {/* ------------------------------------------------ */}
      {/* 2. MAIN WORKFORCE LIST AREA (NATIVE PAGE SCROLL) */}
      {/* ------------------------------------------------ */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-start gap-6 w-full flex-1">
         
         {/* Center Column: Unified seamlessly rendered Worker Cards */}
         <div className="flex-1 min-w-0 md:bg-[#111827] md:rounded-xl md:border md:border-white/5 md:shadow-2xl md:overflow-hidden shrink-0">
            
            {/* Global Bulk Action Toggle */}
            {stats.unmarked > 0 && !hasSubmitted && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#0A0F1E] border-b border-white/5 select-none shrink-0 animate-in slide-in-from-top duration-300">
                 <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Mark All</span>
                 <div className="w-[210px] md:w-[240px]">
                    <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-full border border-white/5">
                       <button 
                          onClick={() => markAll('Present')} 
                          className={cn("flex-1 py-1.5 px-1 rounded-full text-xs font-black transition-all tracking-tight", globalStatus === 'Present' ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-slate-800")}
                       >
                          Present
                       </button>
                       <button 
                          onClick={() => markAll('Half Day')} 
                          className={cn("flex-1 py-1.5 px-1 rounded-full text-xs font-black transition-all tracking-tight", globalStatus === 'Half Day' ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white hover:bg-slate-800")}
                       >
                          Half
                       </button>
                       <button 
                          onClick={() => markAll('Absent')} 
                          className={cn("flex-1 py-1.5 px-1 rounded-full text-xs font-black transition-all tracking-tight", globalStatus === 'Absent' ? "bg-rose-500/20 text-rose-400" : "text-slate-400 hover:text-white hover:bg-slate-800")}
                       >
                          Absent
                       </button>
                       
                       <div className="w-px h-5 bg-white/10 ml-1 mr-0.5 shrink-0" />
                       
                       <button 
                          onClick={resetAttendance}
                          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                          title="Reset Attendance"
                       >
                          <RotateCcw className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {stats.unmarked === 0 && !hasSubmitted && (
               <div className="flex items-center justify-between px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10 animate-in fade-in duration-500">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">All Workers Marked</span>
                  </div>
                  <Button 
                     variant="ghost" 
                     onClick={resetAttendance}
                     className="h-7 px-3 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                     RESET ALL
                  </Button>
               </div>
            )}

            {/* Desktop-only List Column Header */}
            <div className="hidden md:flex items-center px-4 py-3 bg-[#0A0F1E] border-b border-white/5 shrink-0">
                <span className="flex-[2] text-[10px] font-black text-slate-500 uppercase tracking-widest">Worker Identity</span>
                <span className="w-[130px] text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Overtime</span>
                <span className="w-[220px] text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Attendance Action</span>
            </div>

            {/* List Body flowing naturally with the page layout (no nested overflow-y scrolling box) */}
            <div className="space-y-3 md:space-y-0 md:divide-y md:divide-white/5">
               {activeWorkers.map(worker => {
                 const rec = attendance[worker.id] || { status: null, overtimeHours: 0, note: '' }
                 const wage = worker.dailyWage || 0

                 return (
                   <div 
                      key={worker.id} 
                      className={cn(
                         "flex flex-col md:flex-row md:items-center justify-between p-3.5 md:py-3 md:px-4 rounded-xl md:rounded-none border border-white/5 md:border-none transition-all gap-3 group relative overflow-hidden shadow-md md:shadow-none",
                         rec.status === 'Present' ? "bg-emerald-950/15 md:bg-transparent" :
                         rec.status === 'Half Day' ? "bg-amber-950/15 md:bg-transparent" :
                         rec.status === 'Absent' ? "bg-rose-950/15 md:bg-transparent" :
                         "bg-[#111827] md:bg-transparent hover:bg-slate-800/20"
                      )}
                   >
                      {/* Active Status Ribbon left edge for high mobile visibility */}
                      <div className={cn(
                         "absolute left-0 top-0 bottom-0 w-1 md:hidden transition-colors",
                         rec.status === 'Present' ? "bg-emerald-500" :
                         rec.status === 'Half Day' ? "bg-amber-500" :
                         rec.status === 'Absent' ? "bg-rose-500" :
                         "bg-transparent"
                      )} />

                      {/* Worker Profile Details */}
                      <div className="flex-[2] flex items-center gap-3 min-w-0 pl-1 md:pl-0">
                         <div className={cn(
                            "h-10 w-10 md:h-9 md:w-9 rounded-full border flex items-center justify-center shrink-0 transition-all font-black text-xs",
                            rec.status === 'Present' ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-inner" :
                            rec.status === 'Half Day' ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-inner" :
                            rec.status === 'Absent' ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-inner" :
                            "bg-[#0A0F1E] border-white/10 text-slate-400"
                         )}>
                            {worker.name.substring(0, 2).toUpperCase()}
                         </div>
                         
                         <div className="flex flex-col min-w-0">
                            <span className={cn(
                               "text-sm font-extrabold truncate transition-colors tracking-wide", 
                               rec.status ? "text-white" : "text-slate-200 group-hover:text-white"
                            )}>
                               {worker.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/5">
                                  {worker.skill}
                               </span>
                               <span className="text-slate-600 font-bold">•</span>
                               <span className="text-xs font-extrabold text-slate-300">
                                  ₹{wage}<span className="text-[9px] font-normal text-slate-500">/d</span>
                               </span>
                            </div>
                         </div>
                      </div>
                      
                      {/* Overtime & Status Controls Layout */}
                       <div className="flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-2.5 pt-2.5 border-t border-white/5 md:pt-0 md:border-none w-full md:w-auto shrink-0">
                          
                          {/* Primary Status Selector Buttons or Status Label */}
                          <div className="md:w-[220px] shrink-0 order-1 md:order-2">
                             {rec.status && !hasSubmitted ? (
                               <div className="flex items-center justify-between bg-[#0A0F1E] px-3 py-1.5 rounded-xl border border-white/5 animate-in zoom-in-95 duration-300">
                                  <div className="flex items-center gap-2">
                                     <div className={cn(
                                        "h-2 w-2 rounded-full shadow-[0_0_8px_rgba(var(--color))] animate-pulse",
                                        rec.status === 'Present' ? "bg-emerald-500 [--color:16,185,129]" :
                                        rec.status === 'Half Day' ? "bg-amber-500 [--color:245,158,11]" :
                                        "bg-rose-500 [--color:244,63,94]"
                                     )} />
                                     <span className={cn(
                                        "text-xs font-black uppercase tracking-widest",
                                        rec.status === 'Present' ? "text-emerald-400" :
                                        rec.status === 'Half Day' ? "text-amber-400" :
                                        "text-rose-400"
                                     )}>
                                        {rec.status}
                                     </span>
                                  </div>
                                  <button 
                                     onClick={() => setAttendance(prev => ({ ...prev, [worker.id]: { ...prev[worker.id], status: null } }))}
                                     className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
                                     title="Edit Status"
                                  >
                                     <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                             ) : rec.status && hasSubmitted ? (
                               <div className="flex items-center justify-between bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-in fade-in duration-300">
                                  <div className="flex items-center gap-2">
                                     <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Logged</span>
                                  </div>
                                  <button 
                                     onClick={() => {
                                        setAttendance(prev => ({ ...prev, [worker.id]: { ...prev[worker.id], status: null } }));
                                        setHasSubmitted(false);
                                     }}
                                     className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-90"
                                     title="Revert & Edit"
                                  >
                                     <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                             ) : (
                               <div className="grid grid-cols-3 gap-1 bg-[#0A0F1E] p-1 rounded-xl border border-white/5">
                                  <button
                                     onClick={() => setWorkerStatus(worker.id, 'Present')}
                                     className={cn(
                                        "py-1.5 px-1 rounded-lg text-xs font-black transition-all flex items-center justify-center tracking-tight",
                                        "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                     )}
                                  >
                                     Present
                                  </button>
                                  <button
                                     onClick={() => setWorkerStatus(worker.id, 'Half Day')}
                                     className={cn(
                                        "py-1.5 px-1 rounded-lg text-xs font-black transition-all flex items-center justify-center tracking-tight",
                                        "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                     )}
                                  >
                                     Half
                                  </button>
                                  <button
                                     onClick={() => setWorkerStatus(worker.id, 'Absent')}
                                     className={cn(
                                        "py-1.5 px-1 rounded-lg text-xs font-black transition-all flex items-center justify-center tracking-tight",
                                        "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                     )}
                                  >
                                     Absent
                                  </button>
                               </div>
                             )}
                          </div>

                          {/* Secondary Premium Overtime Control */}
                          {!hasSubmitted && (
                            <div className="flex items-center justify-between md:justify-center gap-2 md:w-[130px] bg-[#0A0F1E] md:bg-transparent px-2.5 py-1 md:p-0 rounded-lg border border-white/5 md:border-none shrink-0 order-2 md:order-1">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider md:hidden">
                                  Overtime (Hrs)
                               </span>
                               <div className="flex items-center bg-[#111827] md:bg-[#0A0F1E] rounded-md border border-white/10 p-0.5 shadow-inner shrink-0">
                                  <button 
                                     onClick={() => updateWorkerOvertime(worker.id, -1)} 
                                     className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded font-bold text-xs transition-colors active:scale-90"
                                  >
                                     −
                                  </button>
                                  <span className={cn(
                                     "w-7 text-center text-xs font-black tracking-wider", 
                                     rec.overtimeHours > 0 ? "text-[#F97316]" : "text-slate-500"
                                  )}>
                                     {rec.overtimeHours > 0 ? `${rec.overtimeHours}h` : '0'}
                                  </span>
                                  <button 
                                     onClick={() => updateWorkerOvertime(worker.id, 1)} 
                                     className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded font-bold text-xs transition-colors active:scale-90"
                                  >
                                     +
                                  </button>
                               </div>
                            </div>
                          )}

                       </div>     </div>

                 )
               })}
               
               {activeWorkers.length === 0 && (
                 <div className="p-12 text-center flex flex-col items-center justify-center bg-[#111827] rounded-xl border border-white/5">
                    <span className="text-slate-400 font-extrabold uppercase tracking-widest text-xs">
                       No workers found matching your query
                    </span>
                    <span className="text-slate-500 text-xs mt-1.5">
                       Try clearing the search field or switching site assignments.
                    </span>
                 </div>
               )}
            </div>
         </div>

             {/* ------------------------------------------------ */}
             {/* Right Column: Premium Summary Desktop Sidebar    */}
             {/* ------------------------------------------------ */}
             <div className="hidden xl:block w-[260px] shrink-0 sticky top-4">
                <div className="bg-[#111827] rounded-[1.5rem] p-5 border border-white/5 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#F97316] to-amber-500" />
                   
                   <div className="flex items-center gap-1.5 mb-6 pl-2">
                      <Sparkles className="h-4 w-4 text-[#F97316]" />
                      <h3 className="text-xs font-black text-slate-200 tracking-widest uppercase">
                         LIVE COST TRACKER
                      </h3>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#0A0F1E] border border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                           Present ({stats.present})
                        </span>
                        <span className="text-sm font-black text-emerald-400 tracking-wide">
                           ₹{(stats.cost - stats.overtimeCost - (stats.half * 400)).toLocaleString('en-IN')}
                        </span>
                     </div>
                     <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#0A0F1E] border border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                           Half Day ({stats.half})
                        </span>
                        <span className="text-sm font-black text-amber-400 tracking-wide">
                           ₹{(stats.half * 400).toLocaleString('en-IN')}
                        </span>
                     </div>
                     <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#0A0F1E] border border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                           Overtime ({stats.overtimeHours}h)
                        </span>
                        <span className="text-sm font-black text-[#F97316] tracking-wide">
                           ₹{stats.overtimeCost.toLocaleString('en-IN')}
                        </span>
                     </div>
                   </div>
                   
                   <div className="h-px bg-white/5 my-5" />
    
                   <div className="mb-5 bg-[#0A0F1E] p-3 rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">
                         TOTAL LABOUR TODAY
                      </span>
                      <span className="text-2xl font-black text-[#F97316] tracking-tight leading-none block">
                         ₹{stats.cost.toLocaleString('en-IN')}
                      </span>
                   </div>
    
                   <div className="space-y-2 mb-6 text-[11px] font-bold tracking-wider px-1">
                      <div className="flex justify-between text-slate-400">
                         <span>Workers:</span>
                         <span className="font-black text-slate-200">{activeWorkers.length} TOTAL</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                         <span>Marked:</span>
                         <span className="font-black text-emerald-400">{activeWorkers.length - stats.unmarked}</span>
                      </div>
                      <div className={cn("flex justify-between", stats.unmarked > 0 ? "text-orange-400" : "text-slate-500")}>
                         <span>Unmarked:</span>
                         <span className="font-black">{stats.unmarked} ⚠️</span>
                      </div>
                   </div>
    
                   {hasSubmitted ? (
                     <div className="bg-[#052E16]/40 border border-emerald-500/20 p-5 rounded-2xl text-center space-y-4 shadow-inner relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in duration-500">
                           <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Submission Verified</p>
                           <p className="text-xs font-medium text-slate-400">Total of ₹{stats.cost.toLocaleString('en-IN')} has been securely logged to site ledger.</p>
                        </div>
                        <Button 
                           onClick={() => window.location.href = '/contractor/finance'}
                           variant="outline"
                           className="w-full h-10 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 font-black rounded-xl text-[10px] tracking-widest uppercase transition-all"
                        >
                           OPEN FINANCE LEDGER
                        </Button>
                     </div>
                   ) : (
                     <Button 
                        disabled={(activeWorkers.length === stats.unmarked) && !(getAttendance(siteId, date)?.records && Object.keys(getAttendance(siteId, date)!.records).length > 0)}
                        onClick={() => setShowConfirmModal(true)}
                        className="w-full h-12 bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-[#EA580C] hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-black rounded-xl tracking-widest shadow-xl shadow-[#F97316]/20 transition-all uppercase"
                     >
                        SUBMIT
                     </Button>
                   )}
                </div>
             </div>
    
          </div>
    
          {/* ------------------------------------------------ */}
          {/* 3. PERSISTENT MOBILE FLOATING BOTTOM BAR         */}
          {/* ------------------------------------------------ */}
          {!hasSubmitted && (
             <div className="xl:hidden fixed bottom-[72px] left-0 right-0 p-4 border-t border-slate-800 bg-[#0A0F1E]/95 backdrop-blur-xl z-40 shadow-2xl animate-in slide-in-from-bottom duration-500">
                <Button 
                   disabled={(activeWorkers.length === stats.unmarked) && !(getAttendance(siteId, date)?.records && Object.keys(getAttendance(siteId, date)!.records).length > 0)}
                   onClick={() => setShowConfirmModal(true)}
                   className="w-full h-[54px] text-xs sm:text-sm bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-[#EA580C] hover:to-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl tracking-wider shadow-xl shadow-[#F97316]/25 transition-all flex items-center justify-center gap-2"
                >
                   <span>SUBMIT ATTENDANCE</span>
                   <span className="opacity-40">•</span>
                   <span className="font-extrabold text-white">₹{stats.cost.toLocaleString('en-IN')}</span>
                </Button>
             </div>
          )}

      {/* 3. PREMIUM MOBILE SUCCESS PILL (FLOATING) */}
      {hasSubmitted && (
        <div className="xl:hidden fixed bottom-[88px] left-4 right-4 z-50 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-[#052E16]/80 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">
                       Attendance Synced
                    </span>
                    <span className="text-sm font-black text-white tracking-tight">
                       ₹{stats.cost.toLocaleString('en-IN')} logged to ledger
                    </span>
                 </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/contractor/finance'}
                className="h-10 px-4 bg-emerald-500 hover:bg-emerald-400 text-[#052E16] font-black rounded-xl text-[10px] tracking-widest uppercase transition-all active:scale-95"
              >
                View Ledger
              </Button>
           </div>
        </div>
      )}

      {/* 4. CONFIRMATION SUBMISSION DIALOG MODAL          */}
      {/* ------------------------------------------------ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-slate-700 rounded-[1.5rem] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             
             <div className="p-6 text-center border-b border-slate-800 bg-[#0A0F1E]/50">
                <h3 className="text-lg font-black text-white flex justify-center items-center gap-2 uppercase tracking-wide">
                   ✅ Finalize Daily Attendance
                </h3>
             </div>

             <div className="p-6 space-y-6">
                {/* Summary Metadata */}
                <div className="grid grid-cols-3 gap-2 text-center bg-[#0A0F1E] p-3 rounded-xl border border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Site</span>
                      <span className="text-xs text-slate-200 font-bold truncate mt-0.5">
                         {siteId === 'all' ? 'All Sites' : mockSites.find(s => s.id === siteId)?.name}
                      </span>
                   </div>
                   <div className="flex flex-col border-x border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Date</span>
                      <span className="text-xs text-slate-200 font-bold mt-0.5">{date}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">GPS Fix</span>
                      <span className={cn("text-xs font-bold mt-0.5", gpsValid ? "text-emerald-400" : "text-slate-500")}>
                         {gpsValid ? "Verified" : "Bypassed"}
                      </span>
                   </div>
                </div>

                {/* Worker counts & sub-costs */}
                <div className="space-y-3 px-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-emerald-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present ({stats.present} workers)
                     </span>
                     <span className="text-white">
                        ₹{(stats.cost - stats.overtimeCost - (stats.half * 400)).toLocaleString('en-IN')}
                     </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-amber-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Half Day ({stats.half} worker)
                     </span>
                     <span className="text-white">
                        ₹{(stats.half * 400).toLocaleString('en-IN')}
                     </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-rose-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent ({stats.absent} workers)
                     </span>
                     <span className="text-slate-500">₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-[#F97316] flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#F97316]" /> Overtime ({stats.overtimeHours} hours)
                     </span>
                     <span className="text-white">
                        ₹{stats.overtimeCost.toLocaleString('en-IN')}
                     </span>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Grand total */}
                <div className="flex flex-col items-center pt-2">
                   <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">
                      TOTAL LABOUR PAYOUT
                   </span>
                   <span className="text-3xl font-black text-[#F97316] tracking-tight leading-none block">
                      ₹{stats.cost.toLocaleString('en-IN')}
                   </span>
                   <span className="text-[10px] font-medium text-slate-400 mt-2">
                      Logs securely synced to enterprise Khata records.
                   </span>
                </div>
             </div>

             <div className="p-4 flex gap-3 bg-[#0A0F1E] border-t border-slate-800">
               <Button 
                  disabled={isSubmitting} 
                  variant="ghost" 
                  onClick={() => setShowConfirmModal(false)} 
                  className="flex-1 text-slate-400 hover:text-white hover:bg-slate-800 font-bold h-12 rounded-xl text-xs"
               >
                  CANCEL
               </Button>
               <Button 
                  disabled={isSubmitting} 
                  onClick={handleSubmit} 
                  className="flex-[2] bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-[#EA580C] hover:to-amber-500 text-white font-black h-12 rounded-xl shadow-lg shadow-[#F97316]/20 text-xs tracking-wide"
               >
                  {isSubmitting ? "SAVING LOGS..." : "✅ CONFIRM & SUBMIT"}
               </Button>
             </div>

          </div>
        </div>
      )}

    </div>
  )
}
