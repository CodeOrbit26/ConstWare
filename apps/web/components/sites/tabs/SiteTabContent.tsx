"use client"

import * as React from "react"
import { mockWorkers, mockMaterials } from "@/lib/services/mockData"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/shared/DataTable"
import { Plus, Users, Package, AlertTriangle } from "lucide-react"

export function WorkforceTab({ siteId }: { siteId: string }) {
  const workers = mockWorkers.filter(w => w.assignedSiteId === siteId)

  const columns: Column<typeof workers[0]>[] = [
    {
      header: "Worker Name",
      accessorKey: "name",
      cell: (w) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
            {w.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-semibold">{w.name}</span>
        </div>
      )
    },
    {
      header: "Role",
      cell: (w) => <Badge variant="outline" className="text-[10px]">{w.skill}</Badge>
    },
    {
      header: "Today Status",
      cell: (w) => {
        const statuses = {
          present: { label: "Present", variant: "success" as const },
          half_day: { label: "Half Day", variant: "warning" as const },
          absent: { label: "Absent", variant: "danger" as const },
        }
        const status = statuses[w.attendanceToday || 'absent']
        return <Badge variant={status.variant}>{status.label}</Badge>
      }
    },
    {
      header: "GPS Check",
      cell: (w) => w.lastGpsDistance && w.lastGpsDistance > 500 ? (
        <Badge variant="warning" className="animate-pulse">Suspicious</Badge>
      ) : (
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success" /> Valid
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Users className="h-4 w-4" /> Assigned Workforce
        </h3>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Worker to Site
        </Button>
      </div>
      <DataTable 
        data={workers} 
        columns={columns} 
        keyExtractor={w => w.id}
      />
    </div>
  )
}

export function MaterialsTab({ siteId }: { siteId: string }) {
  const materials = mockMaterials.filter(m => m.siteId === siteId)

  const columns: Column<typeof materials[0]>[] = [
    { header: "Material Name", accessorKey: "name", cell: (m) => <span className="font-semibold">{m.name}</span> },
    { 
      header: "Current Stock", 
      cell: (m) => (
        <div className="flex items-center gap-2">
          <span className={m.currentStock < m.minStock ? "font-bold text-danger" : "font-medium"}>
            {m.currentStock} {m.unit}
          </span>
          {m.currentStock < m.minStock && <AlertTriangle className="h-3 w-3 text-danger animate-bounce" />}
        </div>
      )
    },
    { header: "Min. Threshold", cell: (m) => <span className="text-muted-foreground">{m.minStock} {m.unit}</span> },
    { 
      header: "Status", 
      cell: (m) => m.currentStock < m.minStock ? 
        <Badge variant="danger">Low Stock</Badge> : 
        <Badge variant="success">Available</Badge> 
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Package className="h-4 w-4" /> Material Inventory
        </h3>
        <Button size="sm" variant="outline" className="text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Material
        </Button>
      </div>
      <DataTable 
        data={materials} 
        columns={columns} 
        keyExtractor={m => m.id}
      />
    </div>
  )
}
