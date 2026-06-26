"use client"

import * as React from "react"
import { 
  Users, 
  Search, 
  ArrowUpDown, 
  Star, 
  Award, 
  Clock, 
  FileDown 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/shared/Badge"
import { mockWorkers, mockPagarRecords } from "@/lib/services/mockData"
import { Avatar } from "@/components/shared/Avatar"
import { cn } from "@/lib/utils"

export function WorkerPerformanceTab({ selectedSite }: { selectedSite: string }) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'rating', direction: 'desc' })

  const getWorkerName = (w: any) => `${w.firstName || ""} ${w.lastName || ""}`.trim() || "Unknown Worker"

  // Merge worker data with performance stats from Pagar
  const workerStats = mockWorkers
    .filter(w => selectedSite === 'all' || w.assignedSiteId === selectedSite)
    .map(w => {
      const performance = mockPagarRecords.find(p => p.workerId === w.id)
      return {
        ...w,
        daysPresent: performance?.daysPresent ?? 0,
        attendanceRate: ((performance?.daysPresent ?? 0) / 15) * 100, // Assuming 15 day cycle
        overtime: performance?.overtimeHours ?? 0,
      }
    })
    .filter(w => getWorkerName(w).toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const sortedWorkers = [...workerStats].sort((a, b) => {
    const valA = (a as any)[sortConfig.key]
    const valB = (b as any)[sortConfig.key]
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
       
       {/* Filters & Actions */}
       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input 
                placeholder="Search by worker name..." 
                className="pl-10 h-11 bg-white border-none rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Button variant="outline" className="h-11 font-black text-[10px] uppercase tracking-widest border-slate-200 bg-white">
             <FileDown size={14} className="mr-2" /> Export Performance CSV
          </Button>
       </div>

       {/* Overview Stats */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Size</p>
                <p className="text-lg font-black text-navy">{workerStats.length}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <Award size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Attendance</p>
                <p className="text-lg font-black text-navy">91.2%</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                <Clock size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overtime Hrs</p>
                <p className="text-lg font-black text-navy">{workerStats.reduce((acc, w) => acc + w.overtime, 0)}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
                <Star size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety Score</p>
                <p className="text-lg font-black text-navy">4.8</p>
             </div>
          </div>
       </div>

       {/* Data Table */}
       <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                   <tr>
                      <th className="p-4 pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker Profile</th>
                      <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer group" onClick={() => handleSort('daysPresent')}>
                         Days Present <ArrowUpDown size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </th>
                      <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer group" onClick={() => handleSort('attendanceRate')}>
                         Attendance % <ArrowUpDown size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </th>
                      <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Reliability</th>
                      <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer group" onClick={() => handleSort('rating')}>
                         Rating <ArrowUpDown size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </th>
                      <th className="p-4 pr-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 italic italic">
                   {sortedWorkers.map((worker) => (
                     <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6">
                           <div className="flex items-center gap-3">
                              <Avatar size="sm" src={worker.photoUrl} initials={getWorkerName(worker).substring(0,2).toUpperCase()} className="rounded-xl" />
                              <div className="space-y-0.5">
                                 <p className="text-xs font-black text-navy uppercase tracking-tight">{getWorkerName(worker)}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{worker.skill}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-4 font-black text-navy">{worker.daysPresent} days</td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs font-black",
                                worker.attendanceRate > 90 ? "text-success" : worker.attendanceRate > 70 ? "text-warning" : "text-danger"
                              )}>{worker.attendanceRate.toFixed(0)}%</span>
                              <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                 <div className={cn(
                                   "h-full rounded-full",
                                   worker.attendanceRate > 90 ? "bg-success" : "bg-warning"
                                 )} style={{ width: `${worker.attendanceRate}%` }} />
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                           <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary uppercase">
                              {worker.reliabilityScore}% RELIABLE
                           </Badge>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-1">
                              <Star size={12} className="fill-warning text-warning" />
                              <span className="text-xs font-black text-navy">{worker.rating}</span>
                           </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                           <Badge variant={worker.status === 'on_site' ? 'success' : 'secondary'} className="rounded-md px-2 py-0.5 text-[8px] font-black uppercase">
                              {worker.status.replace('_', ' ')}
                           </Badge>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  )
}
