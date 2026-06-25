"use client"

import * as React from "react"
import { mockExpenseHistory, mockSites } from "@/lib/services/mockData"
import { formatCurrency } from "@/lib/utils"
import { ExpenditureOverview } from "@/components/finance/ExpenditureOverview"
import { TransactionTable, PagarBook } from "@/components/finance/FinanceComponents"
import { KhataEntryPanel } from "@/components/finance/KhataEntryPanel"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function KhataBookView() {
  const [activeSubTab, setActiveSubTab] = React.useState<"khata" | "pagar">("khata")
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-full w-full max-w-md mx-auto border border-slate-200/50">
        {["khata", "pagar"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab as any)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-full transition-all",
              activeSubTab === tab 
                ? "bg-slate-950 text-white shadow-md shadow-slate-900/20" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap">
              {tab === "khata" ? "Financial Ledger" : "Workforce Payroll"}
            </span>
            <span className={cn(
              "text-[9px] sm:text-[10px] font-bold tracking-widest opacity-70 whitespace-nowrap",
            )}>
              {tab === "khata" ? "Khata Book" : "Pagar Book"}
            </span>
          </button>
        ))}
      </div>

      {activeSubTab === "khata" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-10">
            <ExpenditureOverview />
            <Link 
              href="/contractor/finance/history"
              className="group flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-slate-950 dark:bg-slate-900 rounded-[2rem] border border-white/5 hover:border-primary/50 transition-all hover:shadow-lg shadow-black/20 gap-4"
            >
               <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-black text-white tracking-tight">Transaction Ledger History</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View all detailed records & logs</p>
               </div>
               <div className="h-12 px-6 rounded-xl bg-[#F97316] text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 group-hover:scale-105 transition-transform shrink-0">
                  <span>View History</span>
                  <ArrowRight className="h-4 w-4" />
               </div>
            </Link>
          </div>
          <div className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="bg-slate-950 rounded-[2.5rem] shadow-premium overflow-hidden">
               <div className="p-8 text-white"><h3 className="font-extrabold text-xl tracking-tight">Ledger Injection</h3></div>
               <div className="bg-white dark:bg-slate-900 p-8"><KhataEntryPanel /></div>
            </div>
          </div>
        </div>
      ) : (
        <PagarBook />
      )}
    </div>
  )
}
