"use client"

import * as React from "react"
import { TrendingUp, Wallet, HardHat, Package, Settings as GearIcon, ChevronDown } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { mockSites } from "@/lib/services/mockData"
import { useFinanceStore } from "@/lib/store/useStore"

/** Animated counter hook */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = React.useState(0)
  React.useEffect(() => {
    let start = 0
    const step = Math.max(target / (duration / 16), 1)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN")
}

interface CompactStatProps {
  label: string
  amount: number
  percent: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

function CompactStat({ label, amount, percent, icon: Icon, iconBg, iconColor }: CompactStatProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
      <div className={cn(
        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg",
        iconBg
      )}>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="text-center space-y-0.5">
        <p className={cn("text-xs font-black", iconColor)}>{percent}%</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-sm font-black text-[#0F172A] dark:text-white">{formatCurrency(amount)}</p>
      </div>
    </div>
  )
}

export function ExpenditureOverview() {
  const [selectedSite, setSelectedSite] = React.useState("Site Portfolio")
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const transactions = useFinanceStore(state => state.transactions)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  // For demo purposes, we'll treat totalIncome as the starting "Wallet"
  const currentBalance = totalIncome - totalExpense
  const animatedAmount = useCountUp(currentBalance)

  const labourTotal = transactions
    .filter(t => t.category === 'Labour')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const materialTotal = transactions
    .filter(t => t.category === 'Material')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const operationsTotal = totalExpense - labourTotal - materialTotal

  const labourPct = Math.round((labourTotal / totalExpense) * 100) || 0
  const materialPct = Math.round((materialTotal / totalExpense) * 100) || 0
  const operationsPct = 100 - labourPct - materialPct

  const sites = ["Global Portfolio", ...mockSites.map(s => s.name)]

  return (
    <div className="space-y-4">
      {/* === MAIN PORTFOLIO CARD === */}
      <div
        className="relative overflow-hidden rounded-[3rem] p-10 bg-slate-950 text-white shadow-premium shadow-slate-950/30 group transition-all duration-700"
      >
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent blur-3xl rounded-full translate-x-1/2 transition-transform group-hover:scale-110" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 bg-red-600/5 blur-3xl rounded-full" />

        <div className="relative z-10 space-y-10">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Exposure</p>
              {/* Site selector */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 text-xl font-extrabold text-white group/btn transition-all"
                >
                  <span className="group-hover/btn:text-primary transition-colors">{selectedSite}</span>
                  <ChevronDown className={cn("h-5 w-5 text-primary/60 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute top-full mt-4 left-0 z-50 min-w-[240px] bg-slate-900 rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    {sites.map(site => (
                      <button
                        key={site}
                        onClick={() => { setSelectedSite(site); setIsDropdownOpen(false) }}
                        className={cn(
                          "w-full text-left px-5 py-4 text-xs font-bold transition-all border-b border-white/5 last:border-none",
                          selectedSite === site ? "text-primary bg-primary/5" : "text-slate-300 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {site}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Wallet className="h-7 w-7 text-primary" />
            </div>
          </div>

           {/* Amount Display */}
          <div className="space-y-4">
             <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-2">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-none tabular-nums italic truncate w-full">
                  {formatINR(animatedAmount)}
                </h2>
                <div className="flex items-center gap-1.5 bg-primary/20 text-primary border border-primary/20 rounded-full px-4 py-1.5 mb-0 sm:mb-1.5 backdrop-blur-sm group-hover:scale-105 transition-transform w-fit">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">+12.4%</span>
                </div>
             </div>

            <div className="flex items-center gap-4">
               <div className="h-px bg-white/10 flex-1" />
               <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap">Portfolio Allocation Balance</p>
               <div className="h-px bg-white/10 flex-1" />
            </div>
          </div>

          {/* Compact Category Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2">
            <CompactStatItem
              label="Human Capital"
              amount={labourTotal}
              percent={labourPct}
              icon={HardHat}
              color="text-blue-400"
              bg="bg-blue-400/10"
            />
            <CompactStatItem
              label="Raw Material"
              amount={materialTotal}
              percent={materialPct}
              icon={Package}
              color="text-emerald-400"
              bg="bg-emerald-400/10"
            />
            <CompactStatItem
              label="Operations"
              amount={operationsTotal}
              percent={operationsPct}
              icon={GearIcon}
              color="text-amber-400"
              bg="bg-amber-400/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface CompactStatItemProps {
  label: string
  amount: number
  percent: number
  icon: React.ElementType
  color: string
  bg: string
}

function CompactStatItem({ label, amount, percent, icon: Icon, color, bg }: CompactStatItemProps) {
  return (
    <div className="space-y-3 sm:space-y-4 group/item cursor-pointer">
       <div className="flex flex-col xl:flex-row xl:items-center gap-2 sm:gap-3">
          <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 shrink-0", bg)}>
             <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", color)} />
          </div>
          <div className="space-y-0.5 min-w-0">
             <p className={cn("text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap", color)}>{percent}% <span className="hidden lg:inline">allocation</span></p>
             <p className="text-[9px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-tighter truncate leading-tight">{label}</p>
          </div>
       </div>
       <p className="text-[13px] sm:text-lg xl:text-xl font-black text-white tracking-tight truncate">{formatCurrency(amount)}</p>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-1000", color.replace('text', 'bg'))} style={{ width: `${percent}%` }} />
       </div>
    </div>
  )
}
