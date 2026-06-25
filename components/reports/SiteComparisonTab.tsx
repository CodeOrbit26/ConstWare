"use client"

import * as React from "react"
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend 
} from "recharts"
import { GitCompare, MapPin, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react"
import { mockSites } from "@/lib/services/mockData"
import { Badge } from "@/components/shared/Badge"
import { cn } from "@/lib/utils"

export function SiteComparisonTab() {
  const [selectedSites, setSelectedSites] = React.useState<string[]>(mockSites.map(s => s.id).slice(0, 3))

  const toggleSite = (id: string) => {
    setSelectedSites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Aggregate radar data
  const metrics = [
    { name: 'Progress', key: 'progress' },
    { name: 'Health', key: 'health_score' }, // Simulated
    { name: 'Efficiency', key: 'efficiency' }, // Simulated
    { name: 'Budget Adherence', key: 'budget' }, // Simulated
    { name: 'Worker Compliance', key: 'compliance' } // Simulated
  ]

  const radarData = metrics.map(m => {
    const data: any = { subject: m.name }
    selectedSites.forEach(id => {
      const site = mockSites.find(s => s.id === id)
      // Simulate normalized values 0-100
      data[site?.name || id] = site ? (m.key === 'progress' ? site.progress : Math.floor(Math.random() * 40) + 60) : 0
    })
    return data
  })

  const COLORS = ['#0F172A', '#3B82F6', '#F59E0B', '#EF4444', '#10B981']

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
       
       {/* Site Multi-Selector */}
       <div className="flex flex-wrap gap-3">
          {mockSites.map((site) => (
             <button
                key={site.id}
                onClick={() => toggleSite(site.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all active:scale-95",
                  selectedSites.includes(site.id) 
                    ? "bg-navy border-navy text-white shadow-xl shadow-navy/20" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                )}
             >
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  selectedSites.includes(site.id) ? "bg-primary" : "bg-slate-200"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest">{site.name}</span>
             </button>
          ))}
       </div>

       {/* Comparison Grid */}
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          
          {/* Radar Visualization */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm p-10 space-y-8 min-h-[500px] flex flex-col items-center justify-center">
             <div className="w-full text-center space-y-1 mb-6">
                <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Efficiency Radar</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multi-dimensional project health comparison</p>
             </div>
             
             <div className="flex-1 w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis 
                         dataKey="subject" 
                         tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                      {selectedSites.map((id, idx) => {
                         const site = mockSites.find(s => s.id === id)
                         return (
                            <Radar
                               key={id}
                               name={site?.name}
                               dataKey={site?.name || id}
                               stroke={COLORS[idx % COLORS.length]}
                               fill={COLORS[idx % COLORS.length]}
                               fillOpacity={0.15}
                               strokeWidth={3}
                            />
                         )
                      })}
                      <Legend 
                         formatter={(val) => <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{val}</span>}
                      />
                   </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Metrics Table */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm p-10 space-y-10 overflow-hidden">
              <div className="space-y-1">
                 <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Side-by-Side Analysis</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Direct metric comparison between targets</p>
              </div>

              <div className="space-y-6">
                 {metrics.map((metric) => (
                   <div key={metric.name} className="space-y-3">
                      <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{metric.name}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         {selectedSites.map((id, idx) => {
                            const site = mockSites.find(s => s.id === id)
                            // Simulate or use real progress
                            const val = site ? (metric.key === 'progress' ? site.progress : Math.floor(Math.random() * 40) + 60) : 0
                            return (
                              <div key={id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 flex flex-col justify-center">
                                 <p className="text-[8px] font-black uppercase text-slate-400 mb-1 truncate">{site?.name}</p>
                                 <div className="flex items-end justify-between">
                                    <p className="text-xl font-black text-navy dark:text-white">{val}%</p>
                                    <TrendingUp size={12} className={cn(val > 80 ? "text-success" : "text-warning")} />
                                 </div>
                              </div>
                            )
                         })}
                      </div>
                   </div>
                 ))}
              </div>
          </div>
       </div>

       {/* Competitive Insights Bar */}
       <div className="bg-navy rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 border-t-[8px] border-t-primary shadow-2xl">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                <GitCompare size={28} />
             </div>
             <div className="space-y-1">
                <h4 className="text-xl font-black uppercase tracking-tight italic tracking-widest">Global Benchmarking</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top performer: <span className="text-white font-black">Skyline Towers (Efficiency 98%)</span></p>
             </div>
          </div>
          <div className="h-1 w-full md:w-48 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-primary animate-pulse w-[85%]" />
          </div>
       </div>

    </div>
  )
}
