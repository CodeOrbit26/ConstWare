import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { SitesRegistryView } from "@/components/sites/SitesRegistryView"

export default function SitesConsolidatedPage() {
  return (
    <DashboardLayout title="Sites / Project Registry">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-32">
        <SitesRegistryView />
      </div>
    </DashboardLayout>
  )
}
