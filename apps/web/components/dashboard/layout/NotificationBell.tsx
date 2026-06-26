"use client"

import * as React from "react"
import { Bell, Check, ChevronRight, AlertCircle, Megaphone, TriangleAlert, Info } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockAlerts, Alert } from "@/lib/services/mockData"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function NotificationBell() {
  const [alerts, setAlerts] = React.useState<Alert[]>(mockAlerts)
  const unreadCount = alerts.filter(a => !a.isRead).length

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })))
  }

  const getAlertIcon = (type: string, severity: string) => {
    const className = severity === 'critical' ? "text-danger" : "text-warning"
    switch (type) {
      case 'labour_shortage': return <Megaphone className={cn("h-4 w-4", className)} />
      case 'material_low': return <TriangleAlert className={cn("h-4 w-4", className)} />
      case 'cost_overrun': return <AlertCircle className={cn("h-4 w-4", className)} />
      default: return <Info className={cn("h-4 w-4", className)} />
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative group hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-danger text-white text-[8px] font-black flex items-center justify-center border-2 border-background animate-in zoom-in">
                {unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-[340px] p-0 mr-4 mt-2 shadow-2xl rounded-2xl overflow-hidden border-none" align="end">
        <div className="bg-navy p-4 flex items-center justify-between text-white">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black uppercase tracking-tight">Notifications</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unreadCount} New Alerts</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] font-black uppercase text-primary hover:text-primary hover:bg-white/10 h-7"
            onClick={markAllRead}
          >
            <Check className="h-3 w-3 mr-1" /> Mark all read
          </Button>
        </div>

        <ScrollArea className="h-[380px]">
          {alerts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {alerts.slice(0, 8).map((alert) => (
                <Link 
                  key={alert.id} 
                  href={alert.href}
                  className={cn(
                    "flex gap-3 p-4 hover:bg-slate-50 transition-colors relative group",
                    !alert.isRead && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    alert.severity === 'critical' ? "bg-danger" : "bg-warning"
                  )} />
                  
                  <div className="shrink-0 mt-1">
                     {getAlertIcon(alert.type, alert.severity)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{alert.site}</p>
                       <span className="text-[9px] font-bold text-slate-400 italic">{alert.timeAgo}</span>
                    </div>
                    <p className="text-xs font-bold text-navy leading-snug group-hover:text-primary transition-colors">
                      {alert.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0 self-center">
                    <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 px-10 text-center space-y-2">
               <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-success" />
               </div>
               <p className="text-sm font-black text-navy uppercase tracking-tight">All caught up!</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed text-center">Your sites are operational with no critical alerts today.</p>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 bg-slate-50 border-t">
           <Link 
             href="/contractor/alerts" 
             className={cn(
               buttonVariants({ variant: "ghost" }), 
               "w-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary h-8 flex items-center justify-center"
             )}
           >
              View all alerts <ChevronRight className="h-3 w-3 ml-1" />
           </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
