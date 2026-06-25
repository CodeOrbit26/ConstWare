"use client"

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { TransactionTable } from "@/components/finance/FinanceComponents"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TransactionHistoryPage() {
  return (
    <DashboardLayout title="Ledger History">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-32 pt-4">
        
        <div className="flex items-center gap-4 px-2">
           <Link href="/contractor/finance" className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5" />
           </Link>
           <div>
             <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Transaction Log</h1>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Complete historical records</p>
           </div>
        </div>
        
        <TransactionTable />
      </div>
    </DashboardLayout>
  )
}
