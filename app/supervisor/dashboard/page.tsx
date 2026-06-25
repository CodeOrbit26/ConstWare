"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { 
  SiteIdentityBanner, 
  QuickActionGrid, 
  TodayStatusCard, 
  WorkerStatusList, 
  RecentActivityCard,
  PhotoUploadSection
} from "@/components/supervisor/SupervisorComponents"
import { mockSites, mockWorkers, mockTransactions, mockMaterials } from "@/lib/services/mockData"

export default function SupervisorDashboard() {
  // Demo site: Green Valley Residency (site-1)
  const mySite = mockSites.find(s => s.id === 'site-1')
  const siteWorkers = mockWorkers.filter(w => w.assignedSiteId === 'site-1')
  const siteExpenses = mockTransactions.filter(t => t.siteId === 'site-1').slice(0, 5)
  const lowStock = mockMaterials.filter(m => m.siteId === 'site-1' && m.currentStock < m.minStock)

  const attendanceStatus = {
    completed: true,
    present: 42,
    total: 50
  }

  const dprStatus = {
    completed: true,
    time: "06:45 PM"
  }

  const materialAlertItems = lowStock.map(m => ({
    title: `Low Stock: ${m.name}`,
    desc: `Current Node Inventory: ${m.currentStock} ${m.unit} | Critical Threshold: ${m.minStock} ${m.unit}`
  }))

  const expenseItems = siteExpenses.map(e => ({
    title: e.category,
    desc: `${e.description} • ₹${e.amount} Strategic Outlay`
  }))

  if (!mySite) return null

  return (
    <DashboardLayout title="Tactical Operations: Site Center">
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* Top Site Identity - CINEMATIC */}
        <SiteIdentityBanner site={mySite} />

        {/* Quick Operations - HIGH FIDELITY */}
        <div className="space-y-10">
           <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Tactical Controls</h2>
              <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
           </div>
           <QuickActionGrid />
        </div>

        {/* Today's Stats - SOPHISTICATED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <TodayStatusCard type="Attendance" status={attendanceStatus} />
           <TodayStatusCard type="DPR" status={dprStatus} />
        </div>

        {/* Workers & Activity Grid - REFINED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8">
              <WorkerStatusList workers={siteWorkers} />
           </div>
           <div className="lg:col-span-4 space-y-10">
              <RecentActivityCard 
                title="Critical Material Telemetry" 
                items={materialAlertItems} 
                type="material" 
              />
              <RecentActivityCard 
                title="Recent Capital Movements" 
                items={expenseItems} 
                type="expense" 
              />
           </div>
        </div>

        {/* Resource Collection - HIGH FIDELITY */}
        <div className="space-y-10">
           <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Intelligence Acquisition</h2>
              <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
           </div>
           <PhotoUploadSection />
        </div>

      </div>
    </DashboardLayout>
  )
}
