"use client"

import * as React from "react"
import { 
  FileText, 
  Download, 
  Share2, 
  Users, 
  IndianRupee, 
  Package, 
  AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { 
  mockDPRs, 
  mockTransactions, 
  mockAlerts,
  mockSites 
} from "@/lib/services/mockData"
import { formatCurrency } from "@/lib/utils"

export function DailyReportTab({ selectedSite }: { selectedSite: string }) {
  // Aggregate data for today/selected day (mocking today as Apr 10)
  const dpr = mockDPRs.find(d => d.date === '2026-04-10' && (selectedSite === 'all' || d.siteId === selectedSite))
  const expenses = mockTransactions.filter(t => t.date === '2026-04-10' && t.type === 'expense' && (selectedSite === 'all' || t.siteId === selectedSite))
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0)
  const alerts = mockAlerts.filter(a => (selectedSite === 'all' || a.siteId === selectedSite))
  
  const siteName = selectedSite === 'all' ? 'All Sites' : mockSites.find(s => s.id === selectedSite)?.name || 'Selected Site'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
       {/* Report Sidebar: Metadata */}
       <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm p-6 space-y-6">
             <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <FileText size={48} className="text-slate-200 group-hover:text-primary/20 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">Auto-Generated Preview</p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-black text-navy dark:text-white uppercase tracking-tighter">Daily Ledger</h3>
                   <Badge variant="success" className="text-[9px] font-black">Ready</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Date</p>
                      <p className="text-xs font-bold text-navy dark:text-white">Apr 10, 2026</p>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Site</p>
                      <p className="text-xs font-bold text-navy dark:text-white truncate">{siteName}</p>
                   </div>
                </div>

                <div className="space-y-2 pt-4">
                   <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-primary/25">
                      <Download size={14} className="mr-2" /> Export PDF (Renderer)
                   </Button>
                   <Button variant="outline" className="w-full h-12 border-slate-200 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] rounded-xl">
                      <Share2 size={14} className="mr-2" /> Share Direct Link
                   </Button>
                </div>
             </div>
          </div>
       </div>

       {/* Main Preview: Document View */}
       <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-2xl p-8 md:p-12 space-y-10 min-h-[800px] border-t-[12px] border-t-navy">
             {/* Document Header */}
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                   <h1 className="text-4xl font-black text-navy dark:text-white tracking-widest flex items-center gap-2">
                      LEOPARD <span className="text-primary font-black italic">CONSTRUCTION</span>
                   </h1>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Intelligence Report</p>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-xs font-black text-navy dark:text-white uppercase tracking-widest">Serial: #R-2026-0410-01</p>
                   <p className="text-[10px] text-slate-400 font-bold italic lowercase">gen_time: 2026-04-11 13:45 IST</p>
                </div>
             </div>

             {/* Summary Stats Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1 border border-slate-100">
                   <div className="flex items-center gap-2 mb-1">
                      <Users size={12} className="text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Attendance</span>
                   </div>
                   <p className="text-xl font-black text-navy dark:text-white">{dpr?.attendance?.present ?? 0} <span className="text-[10px] text-slate-400">/ {dpr?.attendance?.total ?? 0}</span></p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1 border border-slate-100">
                   <div className="flex items-center gap-2 mb-1">
                      <IndianRupee size={12} className="text-danger" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Expenditure</span>
                   </div>
                   <p className="text-xl font-black text-navy dark:text-white">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1 border border-slate-100">
                   <div className="flex items-center gap-2 mb-1">
                      <Package size={12} className="text-warning" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Usage Tags</span>
                   </div>
                   <p className="text-xl font-black text-navy dark:text-white">{dpr?.workDoneTags?.length ?? 0}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1 border border-slate-100">
                   <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={12} className="text-danger" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Flags</span>
                   </div>
                   <p className="text-xl font-black text-navy dark:text-white">{alerts.length}</p>
                </div>
             </div>

             {/* Work Details Component */}
             <div className="space-y-6">
                <h2 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em] border-l-4 border-primary pl-3">I. Work Progress Summary</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-b pb-6 border-slate-100 dark:border-slate-800">
                   "{dpr?.summary ?? 'No summary data available for this date.'}"
                </p>

                <div className="space-y-6">
                   <h2 className="text-sm font-black text-navy dark:text-white uppercase tracking-[0.2em] border-l-4 border-primary pl-3">II. Expense Breakdown</h2>
                   <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                               <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Category</th>
                               <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Description</th>
                               <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 dark:divide-slate-800 group">
                            {expenses.map((t) => (
                              <tr key={t.id} className="text-xs group-hover:bg-slate-50/50">
                                 <td className="p-4 font-black uppercase tracking-tighter text-navy dark:text-white">{t.category}</td>
                                 <td className="p-4 text-slate-500 font-medium">{t.description}</td>
                                 <td className="p-4 font-black text-navy dark:text-white text-right">{formatCurrency(t.amount)}</td>
                              </tr>
                            ))}
                            {expenses.length === 0 && (
                              <tr>
                                 <td colSpan={3} className="p-8 text-center text-slate-400 uppercase text-[10px] font-black italic">No expense data recorded</td>
                              </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             {/* Footer / Disclaimer */}
             <div className="pt-20 text-center space-y-2 opacity-50">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">VERIFIED BY SUPERVISOR: {dpr?.submittedBy ?? 'PENDING'}</p>
                <div className="flex items-center justify-center gap-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-success" />
                   <p className="text-[8px] font-medium text-slate-400">Electronic report generated by ConstWare Enterprise</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
