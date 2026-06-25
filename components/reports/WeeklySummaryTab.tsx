"use client"

import * as React from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  AreaChart,
  Area
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  FileDown, 
  Printer 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockExpenseHistory } from "@/lib/services/mockData"
import { formatCurrency, cn } from "@/lib/utils"

export function WeeklySummaryTab({ selectedSite }: { selectedSite: string }) {
  // Aggregate data for the week (mocking)
  const totalWeeklyExpense = mockExpenseHistory.reduce((acc, curr) => acc + curr.Labour + curr.Material + curr.Machinery, 0)
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
       
       {/* Weekly Narrative Summary */}
       <div className="bg-navy rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
             <TrendingUp size={120} />
          </div>
          <div className="relative z-10 space-y-6 max-w-2xl">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                   <TrendingUp className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Executive Summary: Week 15</h2>
             </div>
             <p className="text-sm font-medium text-slate-300 leading-relaxed">
                Site operations across {selectedSite === 'all' ? 'all projects' : 'the selected site'} have maintained a <span className="text-white font-black underline decoration-primary underline-offset-4">92% attendance rate</span> this week. Material procurement for "Slab Casting Phase 2" accounted for the largest expenditure at {formatCurrency(totalWeeklyExpense * 0.45)}. 
                <br /><br />
                <span className="text-success font-black uppercase tracking-widest text-[10px]">Projected Outcome:</span> On-track for milestone completion by Apr 22.
             </p>
             <div className="flex gap-4 pt-4">
                <Button variant="outline" className="h-10 border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] px-6">
                   <FileDown size={14} className="mr-2" /> Download Full Digest
                </Button>
                <Button variant="ghost" className="h-10 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[9px]">
                   <Printer size={14} className="mr-2" /> Print Summary
                </Button>
             </div>
          </div>
       </div>

       {/* Charts Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Expense Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border shadow-sm p-8 space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Expense Distribution</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stacked categories by day</p>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-navy dark:text-white">{formatCurrency(totalWeeklyExpense)}</p>
                   <p className="text-[9px] font-black text-danger uppercase tracking-widest flex items-center justify-end gap-1">
                      <TrendingUp size={10} /> +12% VS LAST WEEK
                   </p>
                </div>
             </div>

             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={mockExpenseHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(v) => `₹${v/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Legend 
                        iconType="circle" 
                        formatter={(val) => <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{val}</span>}
                      />
                      <Bar dataKey="Labour" stackId="a" fill="#0F172A" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Material" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Machinery" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Chart 2: Attendance Trends */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border shadow-sm p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Workforce Presence</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active labor vs target</p>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-navy dark:text-white">92.4%</p>
                   <p className="text-[9px] font-black text-success uppercase tracking-widest flex items-center justify-end gap-1">
                      <TrendingUp size={10} /> +2.5% VS LAST WEEK
                   </p>
                </div>
             </div>

             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={mockExpenseHistory}>
                      <defs>
                        <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                      />
                      <YAxis 
                        hide
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Labour" 
                        stroke="#3B82F6" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorPresence)" 
                        animationDuration={1500}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       {/* Materials Inventory Section (Horizontal Bars) */}
       <div className="bg-white dark:bg-slate-900 rounded-[2rem] border shadow-sm p-8 space-y-6">
          <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Resource Consumption</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
             {[
               { name: 'Cement (Ultratech)', usage: 240, total: 500, unit: 'Bags', color: 'bg-navy' },
               { name: 'Steel (TMT 12mm)', usage: 12, total: 15, unit: 'Tons', color: 'bg-primary' },
               { name: 'Coarse Sand', usage: 1200, total: 3000, unit: 'Cu.Ft', color: 'bg-warning' },
               { name: 'Bricks (Std Red)', usage: 45000, total: 100000, unit: 'Pieces', color: 'bg-danger' },
             ].map((m) => (
               <div key={m.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black uppercase text-navy dark:text-white tracking-widest">{m.name}</p>
                        <p className="text-[9px] font-bold text-slate-400">{m.usage} {m.unit} consumed this week</p>
                     </div>
                     <p className="text-xs font-black text-navy dark:text-white">{Math.round((m.usage / m.total) * 100)}%</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className={cn("h-full transition-all duration-1000", m.color)} style={{ width: `${(m.usage / m.total) * 100}%` }} />
                  </div>
               </div>
             ))}
          </div>
       </div>

    </div>
  )
}
