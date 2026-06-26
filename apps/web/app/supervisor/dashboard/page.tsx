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
import { mockWorkers, mockTransactions, mockMaterials } from "@/lib/services/mockData"
import { getCurrentUserId } from "@/lib/auth/mockAuth"

export default function SupervisorDashboard() {
  const [siteData, setSiteData] = React.useState<any>(null)
  const [attendanceLogs, setAttendanceLogs] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [workers, setWorkers] = React.useState<any[]>([])

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const userId = await getCurrentUserId()
        
        // Fetch Site Context
        const siteRes = await fetch("/api/supervisor/site-context", {
          headers: { "x-user-id": userId }
        })
        const siteJson = await siteRes.json()
        setSiteData(siteJson)

        // Fetch Attendance Logs
        const attRes = await fetch("/api/supervisor/attendance", {
          headers: { "x-user-id": userId }
        })
        const attJson = await attRes.json()
        setAttendanceLogs(attJson)

        // Fetch Workers
        const workersRes = await fetch("/api/supervisor/workers", {
          headers: { "x-user-id": userId }
        })
        const workersJson = await workersRes.json()
        setWorkers(workersJson)
      } catch (err) {
        console.error("Error loading supervisor dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Tactical Operations: Site Center">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing telemetry data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Fallback / default data structured for the components
  const mySite = siteData || {
    id: "site-1",
    name: "Green Valley Residency",
    location: "Sector 62, Noida, UP",
    supervisor: "Supervisor User",
    progress: 65.4,
    status: "active",
    health: "green"
  }

  const todayStr = new Date().toISOString().split("T")[0]
  const supervisorCheckedInToday = attendanceLogs.some((log: any) => log.date === todayStr)

  const attendanceStatus = {
    completed: supervisorCheckedInToday,
    present: workers.length > 0 ? 3 : 0, // Mock status of worker attendance
    total: workers.length || 3
  }

  const dprStatus = {
    completed: false,
    time: "Pending Submission"
  }

  // Filter low stock and expenses based on current site
  const siteWorkers = workers.length > 0 ? workers : mockWorkers.filter(w => w.assignedSiteId === 'site-1')
  const siteExpenses = mockTransactions.filter(t => t.siteId === 'site-1').slice(0, 5)
  const lowStock = mockMaterials.filter(m => m.siteId === 'site-1' && m.currentStock < m.minStock)

  const materialAlertItems = lowStock.map(m => ({
    title: `Low Stock: ${m.name}`,
    desc: `Current Node Inventory: ${m.currentStock} ${m.unit} | Critical Threshold: ${m.minStock} ${m.unit}`
  }))

  const expenseItems = siteExpenses.map(e => ({
    title: e.category,
    desc: `${e.description} • ₹${e.amount} Strategic Outlay`
  }))

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
