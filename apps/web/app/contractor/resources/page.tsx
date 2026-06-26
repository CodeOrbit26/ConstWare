"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { ProcurementFleetView } from "@/components/resources/ProcurementFleetView"

export default function ResourcesConsolidatedPage() {
  return (
    <DashboardLayout title="Procurement & Fleet">
      <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700 pb-32">
        <ProcurementFleetView />
      </div>
    </DashboardLayout>
  )
}
