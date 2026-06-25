"use client"

import * as React from "react"
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieChartIcon,
  Download,
  FileSpreadsheet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { mockTransactions, mockSites } from "@/lib/services/mockData"
import { formatCurrency } from "@/lib/utils"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip,
  Legend
} from "recharts"

export function MonthlyPNLTab({ selectedSite }: { selectedSite: string }) {
  const transactions = mockTransactions.filter(t => selectedSite === 'all' || t.siteId === selectedSite)
  
  const revenue = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  
  const categories = ['Labour', 'Material', 'Machinery', 'Misc']
  const expenseBreakdown = categories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.category === cat).reduce((acc, t) => acc + t.amount, 0)
  })).filter(c => c.value > 0)

  const COLORS = ['#0F172A', '#3B82F6', '#F59E0B', '#EF4444']
  
  const grossProfit = revenue - expenses
  const margin = revenue > 0 ? (grossProfit / revenue) * 100 : 0
  const siteName = selectedSite === 'all' ? 'Consolidated' : mockSites.find(s => s.id === selectedSite)?.name

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
       
       {/* Financial Hero Board */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Revenue</span>
                <Badge variant="success" className="bg-success/5 text-success border-success/10"><ArrowUpRight size={10} className="mr-1" /> CREDITED</Badge>
             </div>
             <p className="text-3xl font-black text-navy dark:text-white">{formatCurrency(revenue)}</p>
             <p className="text-[10px] font-bold text-slate-400">Milestone payments & advances</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Expenses</span>
                <Badge variant="danger" className="bg-danger/5 text-danger border-danger/10"><ArrowDownRight size={10} className="mr-1" /> DEBITED</Badge>
             </div>
             <p className="text-3xl font-black text-navy dark:text-white">{formatCurrency(expenses)}</p>
             <p className="text-[10px] font-bold text-slate-400">Labour, Materials, and Rentals</p>
          </div>

          <div className="bg-navy rounded-3xl shadow-xl p-6 space-y-4 text-white relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
                <IndianRupee size={120} />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gross Profit</span>
                <div className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black text-primary uppercase">
                   {margin.toFixed(1)}% MARGIN
                </div>
             </div>
             <p className="text-3xl font-black relative z-10">{formatCurrency(grossProfit)}</p>
             <p className="text-[10px] font-bold text-slate-400 relative z-10">Operational Net Gain (Apr)</p>
          </div>
       </div>

       {/* Detailed Reconciliation */}
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Section: Expenses by Category */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border shadow-sm p-8 space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Expense Reconciliation</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Category-wise utilization</p>
                </div>
                <PieChartIcon size={20} className="text-slate-200" />
             </div>

             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-[220px] w-full md:w-1/2">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={expenseBreakdown}
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {expenseBreakdown.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                         </Pie>
                         <ChartTooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                         />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                   {expenseBreakdown.map((item, idx) => (
                     <div key={item.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter group-hover:text-navy transition-colors">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-navy dark:text-white">{formatCurrency(item.value)}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Section: Revenue Stream */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border shadow-sm p-8 space-y-6">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em]">Inflow History</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recent client payments</p>
                </div>
                <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-slate-100 dark:border-slate-800">
                   <FileSpreadsheet size={12} className="mr-2" /> Export XLSX
                </Button>
             </div>

             <div className="space-y-3">
                {transactions.filter(t => t.type === 'income').map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 group hover:border-success/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                           <IndianRupee size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-navy dark:text-white uppercase tracking-tighter">{t.description}</p>
                           <p className="text-[10px] font-bold text-slate-400">{t.date}</p>
                        </div>
                     </div>
                     <span className="text-sm font-black text-success group-hover:scale-105 transition-transform">{formatCurrency(t.amount)}</span>
                  </div>
                ))}
                {transactions.filter(t => t.type === 'income').length === 0 && (
                   <div className="py-12 text-center text-slate-400 text-xs font-black uppercase italic italic opacity-50">
                      No income records detected for this period
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* MoM Comparison Bar */}
       <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border flex items-center justify-center text-navy dark:text-white shadow-sm font-black">
                P/L
             </div>
             <div>
                <p className="text-xs font-black text-navy dark:text-white uppercase tracking-widest">Month-over-Month Growth</p>
                <p className="text-[10px] font-bold text-slate-400">Compared to March 2026 performance</p>
             </div>
          </div>
          <div className="flex items-center gap-12">
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                <p className="text-sm font-black text-success">+18.4%</p>
             </div>
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expenditure</p>
                <p className="text-sm font-black text-danger">+12.1%</p>
             </div>
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Profit</p>
                <p className="text-sm font-black text-primary">+6.8%</p>
             </div>
          </div>
       </div>

    </div>
  )
}
