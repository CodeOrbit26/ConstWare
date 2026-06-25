"use client"

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { DocumentsView } from "@/components/finance/DocumentsView"

export default function DocumentsPage() {
  return (
    <DashboardLayout title="Document Hub">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32 pt-4">
        <DocumentsView />
      </div>
    </DashboardLayout>
  )
}
