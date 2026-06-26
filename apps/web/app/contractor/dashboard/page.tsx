"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { StatCard } from "@/components/shared/StatCard"
import { PriorityAlerts } from "@/components/dashboard/PriorityAlerts"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { ExpenseTrendChart } from "@/components/dashboard/ExpenseTrendChart"
import { DataTable, Column } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import { Users, Building, Warehouse, Plus, Wallet, IndianRupee } from "lucide-react"
import { 
  mockAlerts, 
  mockStats, 
  mockSites, 
  mockExpenseHistory,
  SiteOverview 
} from "@/lib/services/mockData"

export default function CommandCenterPage() {
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => Promise.resolve(mockAlerts),
    initialData: mockAlerts
  })

  const { data: stats = mockStats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => Promise.resolve(mockStats),
    initialData: mockStats
  })

  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: () => Promise.resolve(mockSites),
    initialData: mockSites
  })

  const columns: Column<SiteOverview>[] = [
    {
      header: "Site Name",
      cell: (site) => (
        <div className="py-2">
          <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{site.name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{site.location}</p>
        </div>
      )
    },
    {
      header: "Supervisor",
      cell: (site) => (
         <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{site.supervisor}</span>
      )
    },
    {
      header: "Workers",
      cell: (site) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="font-bold text-slate-900 dark:text-white">{site.workers}</span>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout title="Command Center">
      <div className="space-y-12 pb-32">
        
        {/* Priority Alerts Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Tactical Alerts</h2>
            <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
               {alerts.length} Pending
            </div>
          </div>
          <PriorityAlerts alerts={alerts} />
        </section>

        {/* Quick Actions Section */}
        <section className="space-y-6">
          <QuickActions />
        </section>

        {/* Stats Section - Horizontal Carousel on Mobile */}
        <section className="space-y-6">
           <div className="px-2">
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Snapshot Status</h2>
           </div>
           
           <div className="flex overflow-x-auto no-scrollbar gap-4 px-2 -mx-2 lg:grid lg:grid-cols-4 lg:gap-6 pb-4 lg:pb-0">
               <div className="min-w-[280px] lg:min-w-0">
                  <StatCard 
                    title="Today Labour Cost" 
                    value={formatCurrency(stats.todayLabourCost)} 
                    icon={Wallet}
                    trend={{ value: 12, isPositive: false, label: "vs yesterday" }}
                    premium
                  />
               </div>
               <div className="min-w-[280px] lg:min-w-0">
                  <StatCard 
                    title="Inventory Volume" 
                    value={formatCurrency(stats.totalExpenses)} 
                    icon={Building}
                    premium
                  />
               </div>
               <div className="min-w-[280px] lg:min-w-0">
                  <StatCard 
                    title="On-Site Active" 
                    value={stats.activeWorkers} 
                    icon={Users}
                    trend={{ value: 5, isPositive: true, label: "at site" }}
                    premium
                  />
               </div>
               <div className="min-w-[280px] lg:min-w-0">
                  <StatCard 
                    title="Managed Sites" 
                    value={stats.activeSites} 
                    icon={Warehouse}
                    premium
                  />
               </div>
           </div>
        </section>

        {/* Sites Overview Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Sites Registry</h2>
            <Button size="sm" className="hidden lg:flex bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6 h-10 shadow-lg shadow-orange-500/20">
              <Plus className="h-4 w-4" /> Add Site
            </Button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
             <DataTable 
               data={sites} 
               columns={columns} 
               keyExtractor={(s) => s.id} 
               emptyState={<EmptyState title="No data found" description="Your dashboard will populate once you add a site and start operations." />}
             />
          </div>
        </section>

        {/* Analytics Section */}
        <section className="space-y-6">
          <div className="px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Operation Pulse</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 shadow-sm">
            <ExpenseTrendChart data={mockExpenseHistory} />
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}
