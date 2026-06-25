"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Minus, ArrowRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

import { fetchMarketPrices } from "@/lib/services/apiServices"

interface PriceData {
  name: string
  unit: string
  price: number
  change: number
  trend: "up" | "down" | "stable"
  currentPrice: number
  lastUpdate: string
}

export function MaterialPriceTicker() {
  const { data: prices, isLoading } = useQuery<PriceData[]>({
    queryKey: ["material-prices"],
    queryFn: fetchMarketPrices,
    refetchInterval: 1000 * 60 * 60, // 1 hour
  })

  if (isLoading || !prices) return <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />

  return (
    <div className="w-full bg-navy text-white overflow-hidden py-3 rounded-2xl relative border border-white/5 shadow-2xl">
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-navy z-10 flex items-center border-r border-white/10">
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Market</span>
         </div>
      </div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render twice for seamless loop */}
        {[...prices, ...prices].map((price, i) => (
          <div key={i} className="flex items-center gap-6 px-8 border-r border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{price.name}</span>
            <div className="flex items-center gap-2">
               <span className="text-xs font-black">₹{Math.round(price.currentPrice)}</span>
               <span className={cn(
                 "text-[9px] font-bold flex items-center",
                 price.trend === "up" ? "text-danger" : price.trend === "down" ? "text-success" : "text-slate-400"
               )}>
                 {price.trend === "up" ? <TrendingUp className="h-3 w-3 mr-0.5" /> : price.trend === "down" ? <TrendingDown className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
                 {Math.abs(price.change)}%
               </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  )
}

export function MarketTrends() {
  const { data: prices } = useQuery<PriceData[]>({
    queryKey: ["material-prices"],
  })

  if (!prices) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       {prices.slice(0, 4).map((price, i) => (
         <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 group hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{price.unit}</p>
               <div className={cn(
                 "h-8 w-8 rounded-xl flex items-center justify-center",
                 price.trend === "up" ? "bg-danger/10 text-danger" : price.trend === "down" ? "bg-success/10 text-success" : "bg-slate-100 text-slate-400"
               )}>
                  {price.trend === "up" ? <TrendingUp className="h-4 w-4" /> : price.trend === "down" ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
               </div>
            </div>
            <div>
               <h4 className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">{price.name}</h4>
               <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-navy dark:text-white">₹{Math.round(price.currentPrice)}</span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    price.trend === "up" ? "text-danger" : price.trend === "down" ? "text-success" : "text-slate-400"
                  )}>
                    {price.change > 0 ? "+" : ""}{price.change}%
                  </span>
               </div>
            </div>
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
               <button className="text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  Procure Now <ArrowRight className="h-3 w-3" />
               </button>
               <Info className="h-3 w-3 text-slate-300" />
            </div>
         </div>
       ))}
    </div>
  )
}
