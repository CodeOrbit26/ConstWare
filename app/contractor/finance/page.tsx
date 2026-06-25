"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { KhataBookView } from "@/components/finance/KhataBookView"

export default function FinanceConsolidatedPage() {

  return (
    <DashboardLayout title="Finance">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
        
        <KhataBookView />

      </div>
    </DashboardLayout>
  )
}
