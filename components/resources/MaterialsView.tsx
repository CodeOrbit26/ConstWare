"use client"

import * as React from "react"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Minus, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown, 
  History, 
  BarChart as BarChartIcon,
  Search,
  Download
} from "lucide-react"
import { 
  mockMaterials, 
  mockMaterialTransactions, 
  mockSites, 
  Material 
} from "@/lib/services/mockData"
import { InventoryTable } from "@/components/materials/MaterialComponents"
import { AddStockModal, LogUsageModal } from "@/components/materials/MaterialModals"
import { MaterialPriceTicker, MarketTrends } from "@/components/materials/MaterialPrices"
import { AlertBanner } from "@/components/shared/AlertBanner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, cn } from "@/lib/utils"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts"

export function MaterialsView() {
  const [activeSite, setActiveSite] = React.useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false)
  const [selectedMaterial, setSelectedMaterial] = React.useState<Material | undefined>(undefined)

  const handleSiteChange = (val: string | null) => {
    if (val) setActiveSite(val)
  }

  const lowStockMaterials = mockMaterials.filter(m => m.currentStock <= m.minStock)
  const totalValue = mockMaterials.reduce((acc, m) => acc + (m.currentStock * m.unitPrice), 0)

  const handleAddStock = (m?: Material) => {
    setSelectedMaterial(m)
    setIsAddModalOpen(true)
  }

  const handleLogUsage = (m?: Material) => {
    setSelectedMaterial(m)
    setIsLogModalOpen(true)
  }

  const chartData = [
    { name: 'Cement', ordered: 500, used: 420, wasted: 15 },
    { name: 'Steel', ordered: 10, used: 8, wasted: 0.5 },
    { name: 'Bricks', ordered: 10000, used: 8500, wasted: 300 },
    { name: 'Sand', ordered: 2000, used: 1800, wasted: 80 },
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <MaterialPriceTicker />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
             <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1.5 border border-primary/20">
                <Package className="h-3 w-3" /> Inventory Control
             </span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Materials Management</h2>
          <Select value={activeSite} onValueChange={handleSiteChange}>
            <SelectTrigger className="w-[240px] h-12 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-premium font-bold text-xs uppercase tracking-widest pl-6">
              <SelectValue placeholder="All Active Sites" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-premium">
              <SelectItem value="all" className="rounded-xl my-1">Global Inventory Portfolio</SelectItem>
              {mockSites.map(s => (
                <SelectItem key={s.id} value={s.id} className="rounded-xl my-1">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest shadow-premium" onClick={() => handleAddStock()}>
            <Plus className="h-5 w-5 mr-3" /> Procure Inventory
          </Button>
          <Button className="h-14 px-8 bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-premium" onClick={() => handleLogUsage(mockMaterials[0])}>
            <Minus className="h-5 w-5 mr-3" /> Record Consumption
          </Button>
        </div>
      </div>

      <MarketTrends />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active SKU Assets" value={mockMaterials.length} icon={Package} />
        <StatCard title="Critical Replenishment" value={lowStockMaterials.length} icon={AlertTriangle} iconClassName="text-warning" />
        <StatCard title="Inventory Net Worth" value={formatCurrency(totalValue)} icon={Package} />
        <StatCard title="Wastage Index" value="4.2%" icon={TrendingDown} iconClassName="text-danger" />
      </div>

      <InventoryTable 
        data={mockMaterials} 
        onAddStock={handleAddStock}
        onLogUsage={handleLogUsage}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      <AddStockModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} material={selectedMaterial} />
      <LogUsageModal open={isLogModalOpen} onOpenChange={setIsLogModalOpen} material={selectedMaterial} />
    </div>
  )
}
