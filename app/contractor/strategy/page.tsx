"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { BarChart, Eye } from "lucide-react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { ProjectProjectionsView } from "@/components/strategy/ProjectProjectionsView"
import { SupervisorAuditView } from "@/components/strategy/SupervisorAuditView"

export default function StrategyConsolidatedPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'projections'

  return (
    <DashboardLayout title={tab === 'audit' ? "Strategic Control & Audit" : "Strategic Control & Performance"}>
      <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
        {tab === 'audit' ? <SupervisorAuditView /> : <ProjectProjectionsView />}
      </div>
    </DashboardLayout>
  )
}
