"use client"

import * as React from "react"
import { 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Clock,
  Calendar,
  Filter as FilterIcon,
  Briefcase,
  Layers,
  Settings as SettingsIcon,
  Zap,
  ArrowUpRight,
  Trash2,
  Plus
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTransactions, mockPagarRecords, Transaction, PagarRecord } from "@/lib/services/mockData"
import { toast } from "sonner"
import { useFinanceStore } from "@/lib/store/useStore"

// ── Category Config ──────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { bg: string; icon: React.ElementType; color: string; badgeBg: string; badgeText: string }> = {
  Labour:          { bg: "bg-blue-50",    icon: Briefcase,    color: "text-blue-600",   badgeBg: "bg-blue-50",    badgeText: "text-blue-700" },
  Material:        { bg: "bg-emerald-50", icon: Layers,       color: "text-emerald-600",badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  Machinery:       { bg: "bg-amber-50",   icon: SettingsIcon, color: "text-amber-600",  badgeBg: "bg-amber-50",   badgeText: "text-amber-700" },
  Misc:            { bg: "bg-slate-100",  icon: Zap,          color: "text-slate-500",  badgeBg: "bg-slate-100",  badgeText: "text-slate-600" },
  "Client Payment":{ bg: "bg-violet-50",  icon: ArrowUpRight, color: "text-violet-600", badgeBg: "bg-violet-50",  badgeText: "text-violet-700" },
}

const DEFAULT_CAT = { bg: "bg-slate-100", icon: Zap, color: "text-slate-500", badgeBg: "bg-slate-100", badgeText: "text-slate-600" }

// ── Transaction Item ─────────────────────────────────────────────
function TransactionItem({ item, isLast }: { item: Transaction; isLast: boolean }) {
  const cfg = CATEGORY_CONFIG[item.category] ?? DEFAULT_CAT
  const IconComp = cfg.icon

  const isCredit = item.category === "Client Payment"

  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 active:bg-slate-100/80 dark:active:bg-slate-800/50",
      !isLast && "border-b border-slate-100 dark:border-white/5"
    )}>
      {/* Icon */}
      <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 dark:bg-opacity-10", cfg.bg)}>
        <IconComp className={cn("h-5 w-5 dark:opacity-90", cfg.color)} />
      </div>

      {/* Middle */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight truncate">{item.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.loggedBy}</span>
          <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
          <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={cn(
          "text-sm font-black tabular-nums",
          isCredit ? "text-[#16A34A]" : "text-[#DC2626]"
        )}>
          {isCredit ? "+" : "-"}{formatCurrency(item.amount)}
        </span>
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#DCFCE7] text-[#16A34A]">
          <ArrowUpRight className="h-2.5 w-2.5" />Normal
        </span>
      </div>
    </div>
  )
}

// ── Filter Chip ──────────────────────────────────────────────────
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight whitespace-nowrap transition-all duration-200 border",
        active
          ? "bg-[#F97316] text-white border-[#F97316] shadow-md shadow-orange-500/20"
          : "bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
      )}
    >
      {label}
    </button>
  )
}

// ── Transaction Table ────────────────────────────────────────────
export function TransactionTable() {
  const [search, setSearch] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState("All")

  const filters = ["All", "Labour", "Material", "Machinery", "Misc"]

  const transactions = useFinanceStore(state => state.transactions)

  const filteredData = transactions.filter(t => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.loggedBy.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === "All" || t.category === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div
      className="overflow-hidden bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.07),0_1px_4px_rgba(15,23,42,0.05)] dark:shadow-premium border border-slate-900/5 dark:border-white/5"
    >
      {/* Utility Bar */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search history..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-0 text-sm font-medium placeholder:text-slate-400 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
          ))}
        </div>

        {/* Subtitle Row */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Ledger History</h3>
          <button className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-wider">
            <Download className="h-3.5 w-3.5" /> Export Data
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        {filteredData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No transactions found</p>
          </div>
        ) : (
          filteredData.map((item, i) => (
            <TransactionItem key={item.id} item={item} isLast={i === filteredData.length - 1} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
        <span className="text-[10px] font-bold text-slate-400">{filteredData.length} entries</span>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" disabled>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 text-[10px] font-black text-slate-900 dark:text-white">1 / 1</span>
          <button className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" disabled>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Worker Card for Pagar ────────────────────────────────────────
function PagarWorkerCard({ record, onPay }: { record: PagarRecord; onPay: (id: string, name: string) => void }) {
  const isPaid = record.status === "paid"
  return (
    <div
      className={cn(
        "p-5 space-y-4 transition-all",
        "border-b border-slate-50 last:border-0"
      )}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#0F172A] flex items-center justify-center">
            <span className="text-white font-black text-lg leading-none">{record.workerName.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-black text-[#0F172A] tracking-tight leading-tight">{record.workerName}</h4>
            <p className="text-[10px] text-slate-400 font-bold">{record.period}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-[#0F172A] leading-none tracking-tighter">{formatCurrency(record.netPayable)}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Net Pay</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#F7F9FC] p-3">
        <div className="text-center">
          <p className="text-xs font-black text-[#16A34A]">{record.daysPresent}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Days</p>
        </div>
        <div className="text-center border-x border-slate-200">
          <p className="text-xs font-black text-amber-600">{record.overtimeHours}h</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">OT</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-black text-[#DC2626]">{formatCurrency(record.advanceDeducted)}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Deducted</p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => !isPaid && onPay(record.id, record.workerName)}
        disabled={isPaid}
        className={cn(
          "w-full h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-200",
          isPaid
            ? "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-default"
            : "bg-[#0F172A] dark:bg-white text-white dark:text-slate-950 hover:bg-[#1E293B] dark:hover:bg-slate-200 active:scale-[0.97] shadow-lg shadow-navy/20"
        )}
      >
        {isPaid ? "Payout Processed" : "Confirm Disbursement"}
      </button>
    </div>
  )
}

// ── PagarBook ────────────────────────────────────────────────────
export function PagarBook() {
  const [activeTab, setActiveTab] = React.useState("pending")
  const { pagarRecords, updatePagarStatus, disburseAllPending } = useFinanceStore()

  const filteredPagar = pagarRecords.filter(p => activeTab === "all" || p.status === activeTab)

  const handlePay = (id: string, name: string) => {
    updatePagarStatus(id, 'paid')
    toast.success(`Payment disbursed to ${name}`, {
      description: "Transaction recorded in wage history."
    })
  }

  const handleDisburseAll = () => {
    const pendingCount = pagarRecords.filter(p => p.status === 'pending').length
    if (pendingCount === 0) {
      toast.info("No pending disbursements found.")
      return
    }
    disburseAllPending()
    toast.success(`Disbursed wages to ${pendingCount} workers`, {
      description: "All pending wages have been cleared."
    })
  }

  const pendingWages = pagarRecords
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.netPayable, 0)

  return (
    <div className="space-y-5 pb-28 lg:pb-6 animate-in fade-in duration-500">
      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pending Banner */}
        <div
          className="relative overflow-hidden p-6 rounded-[24px] flex flex-col gap-4"
          style={{
            background: "linear-gradient(140deg, #0F172A, #1E3A5F)",
            boxShadow: "0 8px 32px rgba(15,23,42,0.2)"
          }}
        >
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unpaid Wages</p>
            <h3 className="text-4xl font-black text-white tracking-tighter italic">₹{pendingWages.toLocaleString('en-IN')}</h3>
          </div>
          <button
            onClick={handleDisburseAll}
            className="relative z-10 w-full h-11 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.97] transition-all"
          >
            Disburse All Pending
          </button>
        </div>

        {/* Period Selector */}
        <div
          className="p-6 rounded-[24px] flex flex-col justify-between gap-4"
          style={{ background: "#ffffff", boxShadow: "0 4px 24px rgba(15,23,42,0.07)", border: "1px solid rgba(15,23,42,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Cycle</p>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <button className="w-full px-4 py-3 rounded-2xl bg-[#F7F9FC] text-sm font-black text-[#0F172A] flex items-center justify-between border border-slate-100">
            Apr 01 – Apr 15
            <FilterIcon className="h-3.5 w-3.5 text-primary" />
          </button>
        </div>
      </div>

      {/* Worker Cards */}
      <div
        className="overflow-hidden"
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 4px 24px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)",
          border: "1px solid rgba(15,23,42,0.06)"
        }}
      >
        {/* Tabs */}
        <div className="flex bg-[#F7F9FC] m-2 rounded-2xl p-1 gap-1">
          {["pending", "paid", "all"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-200",
                activeTab === tab
                  ? "bg-white text-[#0F172A] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filteredPagar.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No records found</p>
          </div>
        ) : (
          filteredPagar.map(record => (
            <PagarWorkerCard key={record.id} record={record} onPay={handlePay} />
          ))
        )}
      </div>
    </div>
  )
}
