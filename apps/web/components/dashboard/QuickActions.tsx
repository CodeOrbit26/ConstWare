"use client"

import * as React from "react"
import { 
  Clock, 
  PlusCircle, 
  MapPin, 
  UserPlus, 
  FileBox,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const actions = [
  {
    title: "MARK ATTENDANCE",
    icon: Clock,
    href: "/contractor/workers?tab=attendance",
    color: "bg-blue-50 text-blue-500",
    id: "action-attendance"
  },
  {
    title: "LOG EXPENSE",
    icon: PlusCircle,
    href: "/contractor/resources",
    color: "bg-orange-50 text-orange-500",
    id: "action-expense"
  },
  {
    title: "CREATE SITE",
    icon: MapPin,
    href: "/contractor/sites",
    color: "bg-orange-50 text-orange-600",
    id: "action-site"
  },
  {
    title: "ASSIGN WORKER",
    icon: UserPlus,
    href: "/contractor/workers",
    color: "bg-indigo-50 text-indigo-500",
    id: "action-worker"
  },
  {
    title: "STRATEGY AUDIT",
    icon: FileBox,
    href: "/contractor/strategy",
    color: "bg-emerald-50 text-emerald-500",
    id: "action-report"
  }
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className="group relative flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <div className={cn(
            "h-10 w-10 sm:h-14 sm:w-14 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:scale-110",
            action.color
          )}>
            <action.icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-black text-slate-600 dark:text-slate-300 tracking-widest text-center leading-tight">
            {action.title}
          </span>
        </Link>
      ))}
    </div>
  )
}
