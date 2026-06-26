"use client"

import * as React from "react"
import { Badge } from "@/components/shared/Badge"
import { cn, formatCurrency } from "@/lib/utils"
import { Material, MaterialCategory } from "@/lib/services/mockData"
import { DataTable, Column } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Edit, Trash2 } from "lucide-react"

export function CategoryBadge({ category }: { category: MaterialCategory }) {
  const styles: Record<MaterialCategory, string> = {
    Cement: "bg-slate-200 text-slate-800 border-slate-300",
    Steel: "bg-blue-100 text-blue-800 border-blue-200",
    Sand: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Bricks: "bg-red-100 text-red-800 border-red-200",
    Other: "bg-slate-100 text-slate-700 border-slate-200"
  }

  return (
    <Badge className={cn("font-bold uppercase text-[10px]", styles[category])}>
      {category}
    </Badge>
  )
}

export function StockLevelBar({ current, threshold }: { current: number, threshold: number }) {
  const percentage = Math.min((current / (threshold * 2)) * 100, 100)
  
  let color = "bg-success"
  if (current <= threshold * 0.5) color = "bg-danger"
  else if (current <= threshold) color = "bg-warning"

  return (
    <div className="w-full space-y-1">
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
        {current <= threshold ? (current <= threshold * 0.5 ? "Critical" : "Low") : "Healthy"}
      </p>
    </div>
  )
}

interface InventoryTableProps {
  data: Material[]
  onAddStock: (m: Material) => void
  onLogUsage: (m: Material) => void
  onEdit: (m: Material) => void
  onDelete: (m: Material) => void
  isReadOnly?: boolean
}

export function InventoryTable({ data, onAddStock, onLogUsage, onEdit, onDelete, isReadOnly }: InventoryTableProps) {
  const columns: Column<Material>[] = [
    {
      header: "Material Name",
      cell: (m) => (
        <div className="font-bold text-navy dark:text-white">{m.name}</div>
      )
    },
    {
      header: "Category",
      cell: (m) => <CategoryBadge category={m.category} />
    },
    {
      header: "Current Stock",
      cell: (m) => (
        <div className="flex flex-col">
          <span className="font-black text-navy dark:text-white uppercase text-xs">
            {m.currentStock} {m.unit}
          </span>
        </div>
      )
    },
    {
      header: "Unit Price",
      cell: (m) => <span className="text-xs font-bold text-slate-500">{formatCurrency(m.unitPrice)}</span>
    },
    {
      header: "Total Value",
      cell: (m) => (
        <span className="text-xs font-black text-primary">
          {formatCurrency(m.currentStock * m.unitPrice)}
        </span>
      )
    },
    {
      header: "Stock Level",
      cell: (m) => <StockLevelBar current={m.currentStock} threshold={m.minStock} />
    },
    {
      header: "Actions",
      cell: (m) => !isReadOnly && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-success/10 hover:text-success hover:border-success/50"
            onClick={() => onAddStock(m)}
            title="Add Stock"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-danger/10 hover:text-danger hover:border-danger/50"
            onClick={() => onLogUsage(m)}
            title="Log Usage"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-navy"
            onClick={() => onEdit(m)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-danger"
            onClick={() => onDelete(m)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DataTable 
      data={data} 
      columns={columns} 
      keyExtractor={(m) => m.id} 
    />
  )
}
