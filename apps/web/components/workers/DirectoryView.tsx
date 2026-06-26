"use client"

import * as React from "react"
import { Search, ChevronDown, ChevronUp, Phone, Calendar, Clock, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/shared/Badge"
import { Worker, mockSites } from "@/lib/services/mockData"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getCurrentUserId } from "@/lib/auth/mockAuth"
import { useFinanceStore } from "@/lib/store/useStore"

export function DirectoryView() {
  const [search, setSearch] = React.useState("")
  const [skillFilter, setSkillFilter] = React.useState("All Skills")
  const [siteFilter, setSiteFilter] = React.useState("All Sites")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "available">("all")
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)
  
  const getWorkerName = (w: any) => {
    if (w.name) return w.name;
    return `${w.firstName || ""} ${w.lastName || ""}`.trim() || "Unknown Worker";
  }

  const addTransaction = useFinanceStore((state: any) => state.addTransaction)

  const skills = ["Mason", "Carpenter", "Bar Bender", "Electrician", "Helper", "Plumber", "Painter", "Welder"]

  const { data: workers = [], isLoading } = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      const res = await fetch('/api/workers', {
        headers: {
          'x-user-id': userId
        }
      })
      if (!res.ok) throw new Error('Failed to fetch workers')
      return res.json()
    }
  })

  const stats = {
    total: workers.length,
    onSiteToday: workers.filter(w => w.attendanceToday === 'present').length,
    available: workers.filter(w => w.status === 'available').length,
    avgWage: workers.length > 0 ? workers.reduce((sum, w) => sum + w.dailyWage, 0) / workers.length : 0
  }

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = getWorkerName(w).toLowerCase().includes(search.toLowerCase()) || 
                          w.phone.includes(search) || 
                          w.id.toLowerCase().includes(search.toLowerCase());
    const matchesSkill = skillFilter === 'All Skills' || w.skill === skillFilter;
    const matchesSite = siteFilter === 'All Sites' || w.assignedSiteId === siteFilter;
    const matchesStatus = statusFilter === 'all' || w.status === 'available';
    return matchesSearch && matchesSkill && matchesSite && matchesStatus;
  })

  const getSiteName = (siteId: string) => mockSites.find(s => s.id === siteId)?.name || 'Unknown Site'

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedRow(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-end w-full mt-4">
        <div className="flex flex-col gap-1.5 flex-1 w-full">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-1">Search Database</label>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search workers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 bg-[#0A0F1E] border-none h-12 rounded-xl text-slate-200 placeholder:text-slate-500 font-medium w-full focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 w-full md:w-auto shrink-0 items-end">
          <div className="flex bg-[#0A0F1E] rounded-xl p-1 h-12 w-full lg:w-[220px]">
            <button 
              onClick={() => setStatusFilter('all')}
              className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", statusFilter === 'all' ? "bg-[#111827] text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('available')}
              className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", statusFilter === 'available' ? "bg-[#22C55E]/10 text-[#22C55E] shadow-sm" : "text-slate-500 hover:text-slate-300")}
            >
              Available
            </button>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="flex flex-col gap-1.5 flex-1 lg:flex-none lg:w-[110px]">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-1">Skill</label>
              <Select value={skillFilter} onValueChange={(val) => setSkillFilter(val || "All Skills")}>
                <SelectTrigger className="w-full h-12 bg-[#0A0F1E] border-none rounded-xl text-xs font-medium text-slate-300">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-slate-800 text-slate-200">
                  <SelectItem value="All Skills">All Skills</SelectItem>
                  {skills.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 lg:flex-none lg:w-[130px]">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-1">Site</label>
              <Select value={siteFilter} onValueChange={(val) => setSiteFilter(val || "All Sites")}>
                <SelectTrigger className="w-full h-12 bg-[#0A0F1E] border-none rounded-xl text-xs font-medium text-slate-300">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-slate-800 text-slate-200">
                  <SelectItem value="All Sites">All Sites</SelectItem>
                  {mockSites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* WORKER LIST */}
      <div className="space-y-2 mt-4">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredWorkers.length > 0 ? (
          filteredWorkers.map(worker => (
            <div 
              key={worker.id} 
              className="bg-[#111827] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition-colors cursor-pointer"
              onClick={(e) => toggleExpand(worker.id, e)}
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white font-semibold text-sm shadow-lg shadow-[#F97316]/20">
                    {getWorkerName(worker).split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-[15px]">{getWorkerName(worker)}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-[#F97316] border-[#F97316]/30 bg-[#F97316]/10 px-2 py-0.5 rounded-full">
                        {worker.skill}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-semibold text-slate-400 border-slate-700 bg-slate-800/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <MapPin className="h-3 w-3 inline mr-1 opacity-50" />
                        {getSiteName(worker.assignedSiteId)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap text-xs font-medium text-slate-400 pr-2">
                       <span className="flex items-center gap-1">Daily: <span className="text-slate-200">₹{worker.dailyWage}</span></span>
                       <span className="h-4 border-l border-slate-700"></span>
                       <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {worker.rating}</span>
                       <span className="h-4 border-l border-slate-700 hidden sm:block"></span>
                       <span className="flex items-center gap-1.5">
                         <div className={cn("h-2 w-2 rounded-full",
                           worker.attendanceToday === 'present' ? "bg-[#22C55E]" :
                           worker.attendanceToday === 'absent' ? "bg-[#EF4444]" :
                           worker.attendanceToday === 'half_day' ? "bg-[#EAB308]" : "bg-slate-500 border border-slate-400"
                         )} />
                         {worker.attendanceToday === 'present' ? 'Present today' : 
                          worker.attendanceToday === 'absent' ? 'Absent today' : 
                          worker.attendanceToday === 'half_day' ? 'Half day' : 'Not marked'}
                       </span>
                       <span className="h-4 border-l border-slate-700"></span>
                       <span className={cn("font-bold tracking-wide uppercase text-[10px]", worker.status === 'available' ? "text-[#22C55E]" : "text-slate-500")}>
                         {worker.status === 'available' ? 'Available' : 'Assigned'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                  <Button 
                     onClick={(e) => { e.stopPropagation(); toggleExpand(worker.id, e) }} 
                     variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    View
                  </Button>
                  <Button 
                     onClick={(e) => { e.stopPropagation(); toast(`Assignment modal: Reallocate ${getWorkerName(worker)} to another site`) }}
                     variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Assign
                  </Button>
                  <Button 
                     onClick={(e) => { 
                       e.stopPropagation(); 
                       addTransaction({
                         type: 'expense',
                         category: 'Labour',
                         amount: worker.dailyWage,
                         date: new Date().toISOString().split('T')[0],
                         description: `Quick Pay payout: ${getWorkerName(worker)} (${worker.skill})`,
                         siteId: worker.assignedSiteId || 'unassigned',
                         loggedBy: 'System (Quick Pay Sync)'
                       });
                       toast.success(`Quick Pay: ₹${worker.dailyWage} processed for ${getWorkerName(worker)}`);
                     }}
                     variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#F97316] hover:bg-[#F97316]/10 hover:text-[#F97316]"
                  >
                    Quick Pay
                  </Button>
                </div>
              </div>

              {expandedRow === worker.id && (
                <div className="px-5 pb-5 pt-0 bg-[#0A0F1E]/50 border-t border-white/[0.05] animate-in slide-in-from-top-2 duration-300 cursor-default" onClick={e => e.stopPropagation()}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                    
                    {/* Contact info */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact</p>
                      <a href={`tel:${worker.phone}`} className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-white/[0.05] w-fit">
                        <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-300">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{worker.phone}</span>
                      </a>
                    </div>

                    {/* Monthly Stats */}
                    <div className="space-y-3">
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <Calendar className="h-3 w-3" /> This Month
                       </p>
                       <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 rounded-lg bg-slate-800/50 border border-white/[0.05] flex flex-col items-center">
                            <span className="text-lg font-bold text-white">0</span>
                            <span className="text-[10px] text-slate-400 font-medium">Days</span>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-800/50 border border-white/[0.05] flex flex-col items-center">
                            <span className="text-lg font-bold text-[#F97316]">₹0</span>
                            <span className="text-[10px] text-slate-400 font-medium">Earned</span>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-800/50 border border-white/[0.05] flex flex-col items-center">
                            <span className="text-lg font-bold text-amber-500">₹0</span>
                            <span className="text-[10px] text-slate-400 font-medium">Advance</span>
                          </div>
                       </div>
                    </div>

                    {/* Weekly Attendance */}
                    <div className="space-y-4 flex flex-col">
                       <div className="flex items-center justify-between">
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Clock className="h-3 w-3" /> Last 7 Days
                         </p>
                       </div>
                       <div className="flex items-center justify-between px-2">
                         {Array.from({length: 7}).map((_, i) => (
                           <div key={i} className="flex flex-col items-center gap-1.5">
                              <span className="text-[9px] text-slate-500 font-bold uppercase">{['M','T','W','T','F','S','S'][i]}</span>
                              <div className={cn("h-3 w-3 rounded-full",
                                i === 6 ? "bg-[#22C55E]" : i === 5 ? "bg-[#EF4444]" : i === 2 ? "bg-[#EAB308]" : "bg-[#22C55E]"
                              )} />
                           </div>
                         ))}
                       </div>
                       <Button size="sm" className="mt-auto h-9 w-full bg-[#374151] hover:bg-[#4B5563] text-white rounded-lg font-semibold text-xs transition-colors">
                         Mark Attendance
                       </Button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center rounded-2xl border border-dashed border-slate-800 bg-[#0A0F1E]/50">
             <div className="font-medium text-slate-400">No workers match the filters</div>
          </div>
        )}
      </div>

    </div>
  )
}
