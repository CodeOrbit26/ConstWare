"use client"

import * as React from "react"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  ArrowUpRight, 
  BarChart,
  Download,
  Calendar,
  IndianRupee,
  Shield,
  ArrowRight,
  Wallet
} from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Cell,
  Pie
} from "recharts"
import { cn } from "@/lib/utils"

const expenseCategories = [
  { name: 'Materials', value: 450000, color: '#F97316' },
  { name: 'Labour', value: 320000, color: '#3B82F6' },
  { name: 'Equipment', value: 180000, color: '#8B5CF6' },
  { name: 'Overheads', value: 65000, color: '#10B981' },
]

const monthlyTrend = [
  { month: 'Jan', total: 420000 },
  { month: 'Feb', total: 580000 },
  { month: 'Mar', total: 460000 },
  { month: 'Apr', total: 720000 },
  { month: 'May', total: 680000 },
  { month: 'Jun', total: 840000 },
]

export function ExpensesView() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      
      {/* HEADER SECTION - CINEMATIC */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-slate-100 dark:border-slate-800 pb-12">
         <div className="space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Global Finance Oversight</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
               <h3 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">₹12.45 <span className="text-primary not-italic">Lakhs</span></h3>
               <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] gap-2 py-2 px-6 border-emerald-500/20 text-emerald-500 bg-emerald-500/5 rounded-full animate-pulse self-start sm:self-center">
                  <ArrowUpRight className="h-4 w-4" /> 14% vs Last Cycle
               </Badge>
            </div>
         </div>
         <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" className="h-16 px-8 border-slate-100 dark:border-slate-800 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] gap-3 bg-white dark:bg-slate-950 hover:bg-slate-50 transition-all shadow-sm">
               <Calendar className="h-5 w-5 text-primary" /> Q2 FY2025
            </Button>
            <Button className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-premium-primary">
               Detailed Statement
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <section className="lg:col-span-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-[3.5rem] border border-white/20 dark:border-slate-800/50 shadow-premium p-12 h-[480px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full -mr-40 -mt-40" />
            <div className="flex items-center justify-between mb-12 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-slate-950 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-950 rotate-3 group-hover:rotate-0 transition-transform">
                     <BarChart className="h-7 w-7" />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Cash Flow Analytics</h4>
                     <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Strategic Trajectory</p>
                  </div>
               </div>
            </div>
            <div className="h-[280px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                     <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                     <YAxis hide />
                     <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '24px', border: 'none' }} />
                     <Area type="monotone" dataKey="total" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </section>

         <section className="lg:col-span-4 bg-slate-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden flex flex-col justify-between h-[480px] shadow-premium group">
            <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative z-10 space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Capital Allocation</h4>
               <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Primary <span className="text-primary not-italic">Outlay</span></h3>
            </div>
            <div className="relative z-10 flex-1 flex items-center justify-center">
               <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={expenseCategories} innerRadius={75} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                           {expenseCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', color: '#fff' }} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </section>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard title="Capital Deployed" value="₹12.4L" icon={IndianRupee} trend={{ value: 14, isPositive: true, label: "this quarter" }} premium />
         <StatCard title="Budget Conformity" value="92%" icon={Shield} iconClassName="text-emerald-500" premium />
         <StatCard title="Efficiency Gains" value="₹45k" icon={TrendingUp} iconClassName="text-primary" premium />
         <StatCard title="Unrealized Liabilities" value="₹1.2L" icon={Wallet} iconClassName="text-amber-500" premium />
      </section>

      <div className="p-12 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl rounded-[4rem] border border-white/20 dark:border-slate-800/50 shadow-premium">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Recent Settlements</p>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all group/btn">
               Access Full Ledger <ArrowRight className="ml-3 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
         </div>
         <div className="space-y-6">
            {[
              { name: 'UltraTech Cement Platinum Grade', desc: '500 Units Procurement', date: '12 Apr, 2024', amount: '₹145,000', status: 'PAID' },
              { name: 'Site Liquidity Advance: Green Valley', desc: 'Strategic Resource Funding', date: '10 Apr, 2024', amount: '₹40,000', status: 'PAID' },
              { name: 'Steel TMT Infrastructure Reinforcement', desc: 'Tier 1 Supply Chain Settlement', date: '08 Apr, 2024', amount: '₹380,000', status: 'PENDING' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-transparent hover:border-primary/10 transition-all hover:shadow-premium group/item">
                 <div className="flex items-center gap-8">
                    <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl shadow-inner italic uppercase">
                       {i + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{item.name}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.desc} — {item.date}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-12 mt-6 lg:mt-0">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter italic">{item.amount}</span>
                    <Badge variant={item.status === 'PAID' ? 'success' : 'warning'} className="text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full">
                       {item.status}
                    </Badge>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}
