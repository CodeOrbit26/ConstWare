"use client"

import * as React from "react"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  ArrowLeft, 
  Wallet, 
  Clock, 
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  Download,
  AlertCircle
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { formatCurrency, cn } from "@/lib/utils"

export default function WorkerDetailPortal() {
  const router = useRouter()
  const params = useParams()
  const workerCode = params?.worker_code as string

  // Mock data for the worker (in a real app, this would be a fetch using workerCode)
  const workerData = {
    name: "Arjun Kumar",
    id: workerCode,
    site: "Green Valley Residency",
    role: "Senior Mason",
    wagesEarned: 24500,
    advancesTaken: 4500,
    netPayable: 20000,
    daysPresent: 18,
    daysAbsent: 2,
    payoutHistory: [
      { date: "12 Apr, 2024", amount: 4500, status: 'Paid', type: 'Weekly Wage' },
      { date: "05 Apr, 2024", amount: 4500, status: 'Paid', type: 'Weekly Wage' },
      { date: "28 Mar, 2024", amount: 1500, status: 'Paid', type: 'Advance' },
    ]
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-navy text-white p-6 md:p-10 rounded-b-[3rem] shadow-2xl shadow-navy/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl -mr-32 -mt-32" />
         
         <div className="max-w-xl mx-auto space-y-8 relative z-10">
            <Button 
               variant="ghost" 
               onClick={() => router.push('/check-wages')}
               className="text-white/60 hover:text-white hover:bg-white/10 -ml-2 h-8 px-2 text-[10px] font-black uppercase tracking-widest gap-2"
            >
               <ArrowLeft size={14} /> Back to Lookup
            </Button>

            <div className="flex items-center gap-6">
               <div className="h-20 w-20 rounded-[2rem] bg-white/10 border border-white/10 flex items-center justify-center text-3xl font-black text-primary backdrop-blur-md">
                  {workerData.name.charAt(0)}
               </div>
               <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tighter italic uppercase">{workerData.name}</h1>
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-white/20 text-white/60">ID: {workerData.id}</Badge>
                     <span className="h-1 w-1 rounded-full bg-white/20" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{workerData.site}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-xl mx-auto -mt-10 p-6 space-y-6">
         
         {/* FINANCE CARD */}
         <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center space-y-6">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Payable Amount</p>
               <h2 className="text-5xl font-black text-navy tracking-tighter italic">{formatCurrency(workerData.netPayable)}</h2>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Earned</p>
                  <p className="text-lg font-black text-navy">{formatCurrency(workerData.wagesEarned)}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Advances</p>
                  <p className="text-lg font-black text-danger">-{formatCurrency(workerData.advancesTaken)}</p>
               </div>
            </div>

            <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 gap-2">
               <Download size={18} /> Download Receipt
            </Button>
         </div>

         {/* ATTENDANCE SUMMARY */}
         <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/40 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-navy uppercase tracking-widest">Attendance April</h3>
               <Badge variant="success" className="text-[8px] font-black tracking-widest">ACTIVE ON SITE</Badge>
            </div>
            
            <div className="flex items-center justify-around">
               <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full border-4 border-success flex items-center justify-center">
                     <span className="text-xl font-black text-success">{workerData.daysPresent}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">PRESENT</span>
               </div>
               <div className="h-10 w-px bg-slate-100" />
               <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full border-4 border-danger/20 flex items-center justify-center">
                     <span className="text-xl font-black text-danger/40">{workerData.daysAbsent}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">ABSENT</span>
               </div>
            </div>
         </div>

         {/* RECENT TRANSACTIONS */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Recent Payouts</h3>
            <div className="space-y-3">
               {workerData.payoutHistory.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                           <Wallet size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-navy uppercase tracking-tighter">{item.type}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-navy">{formatCurrency(item.amount)}</span>
                        <div className="flex items-center gap-1">
                           <div className="h-1 w-1 rounded-full bg-success" />
                           <span className="text-[8px] font-black text-success uppercase tracking-widest">{item.status}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* HELP FOOTER */}
         <div className="p-6 bg-navy/5 border border-dashed border-navy/10 rounded-[2.5rem] flex items-center gap-4">
            <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-navy shadow-sm">
               <AlertCircle size={20} />
            </div>
            <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
               Your records are automatically verified by <span className="text-primary font-black">ConstWare Guard</span>. If you see an error, contact your site manager.
            </p>
         </div>

      </div>

    </div>
  )
}
