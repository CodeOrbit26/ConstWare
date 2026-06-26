import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: LucideIcon
  iconClassName?: string
  premium?: boolean
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
}

export function StatCard({ 
  className, 
  title, 
  value, 
  icon: Icon, 
  iconClassName,
  premium,
  trend, 
  ...props 
}: StatCardProps) {
  return (
    <div className={cn(
      "relative group p-6 rounded-[2rem] border transition-all duration-300",
      premium 
        ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-premium hover:shadow-2xl" 
        : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800",
      className
    )} {...props}>
      {/* Icon top-right */}
      {Icon && (
        <div className={cn("absolute top-6 right-6 bg-white p-2 rounded-xl flex items-center h-10 w-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110", iconClassName)}>
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
      )}

      <div className="space-y-4 pt-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {title}
        </p>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            {value}
          </h3>
          
          {trend && (
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-[10px] font-black flex items-center gap-0.5",
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
