"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Minus, 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Search
} from "lucide-react"
import { 
  mockMaterials, 
  mockMaterialTransactions, 
  Material 
} from "@/lib/services/mockData"
import { InventoryTable } from "@/components/materials/MaterialComponents"
import { AddStockModal, LogUsageModal } from "@/components/materials/MaterialModals"
import { AlertBanner } from "@/components/shared/AlertBanner"
import { Input } from "@/components/ui/input"
import { formatCurrency, cn } from "@/lib/utils"

export default function SupervisorMaterialsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false)
  const [selectedMaterial, setSelectedMaterial] = React.useState<Material | undefined>(undefined)

  // In real app, filter by supervisor's assigned site. For now, site-1.
  const mySiteMaterials = mockMaterials.filter(m => m.siteId === 'site-1')
  const lowStockMaterials = mySiteMaterials.filter(m => m.currentStock <= m.minStock)
  const totalValue = mySiteMaterials.reduce((acc, m) => acc + (m.currentStock * m.unitPrice), 0)

  const handleAddStock = (m?: Material) => {
    setSelectedMaterial(m)
    setIsAddModalOpen(true)
  }

  const handleLogUsage = (m?: Material) => {
    setSelectedMaterial(m)
    setIsLogModalOpen(true)
  }

  return (
    <DashboardLayout title="Logistics: Resource Management">
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-100 dark:border-slate-800 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <Package className="h-3.5 w-3.5" /> Site Inventory Hub
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Payload <br /> <span className="text-primary not-italic">Logistics</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Global Resource Tracking & Consumption Intelligence</p>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <Button 
                 variant="outline" 
                 className="h-16 px-8 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl shadow-premium-sm text-emerald-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                 onClick={() => handleAddStock()}
              >
                <Plus className="h-5 w-5 mr-3" /> New Material Entry
              </Button>
              <Button 
                 className="h-16 px-10 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-premium-dark border border-white/10 transition-all active:scale-95"
                 onClick={() => handleLogUsage(mySiteMaterials[0])}
              >
                <Minus className="h-5 w-5 mr-3" /> Log Consumption
              </Button>
           </div>
        </div>

        {/* STATS DECK - HIGH FIDELITY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Site Inventory", val: mySiteMaterials.length, icon: Package, color: "text-primary", bg: "bg-primary/5" },
             { label: "Critical Stock", val: lowStockMaterials.length, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5" },
             { label: "Asset Valuation", val: formatCurrency(totalValue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/5", isCurrency: true },
             { label: "Waste Deviation", val: "3.8%", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/5" }
           ].map(stat => (
             <div key={stat.label} className={cn("p-10 rounded-[3rem] shadow-premium border border-white/20 dark:border-slate-800/50 transition-all duration-500 hover:translate-y-[-4px]", stat.bg)}>
                <div className="flex items-center justify-between mb-8">
                   <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner", stat.bg)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                   </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                <p className={cn("text-3xl font-black italic tracking-tighter tabular-nums", stat.color)}>{stat.val}</p>
             </div>
           ))}
        </div>

        {/* CRITICAL ALERTS - CINEMATIC */}
        {lowStockMaterials.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-10 rounded-[3.5rem] shadow-premium flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
             <div className="absolute top-0 right-0 h-full w-64 bg-amber-500/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
             <div className="flex items-center gap-8 relative z-10">
                <div className="h-20 w-20 rounded-[1.75rem] bg-amber-500 text-white flex items-center justify-center shadow-premium-amber">
                   <AlertTriangle className="h-10 w-10 animate-pulse" />
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-amber-600 dark:text-amber-400 italic tracking-tighter">Inventory Sync Crisis</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Critical shortfall detected in {lowStockMaterials.length} primary resource categories.</p>
                </div>
             </div>
             <Button className="h-16 px-10 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-premium-amber relative z-10" onClick={() => handleAddStock(lowStockMaterials[0])}>
                Authorize Emergency Indent
             </Button>
          </div>
        )}

        <Tabs defaultValue="inventory" className="space-y-12">
          <TabsList className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-premium w-fit">
            <TabsTrigger value="inventory" className="h-14 px-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-slate-950 data-[state=active]:text-white transition-all">
              Live Registry
            </TabsTrigger>
            <TabsTrigger value="history" className="h-14 px-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-slate-950 data-[state=active]:text-white transition-all">
              Consumption Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center justify-between gap-6">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                   placeholder="Search tactical inventory..." 
                   className="h-16 pl-16 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-slate-100 dark:border-slate-800 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-inner placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary/20" 
                />
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[4rem] border border-white/20 dark:border-slate-800/50 shadow-premium overflow-hidden">
               <InventoryTable 
                  data={mySiteMaterials} 
                  onAddStock={handleAddStock}
                  onLogUsage={handleLogUsage}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isReadOnly={true}
               />
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
             <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[4rem] border border-white/20 dark:border-slate-800/50 shadow-premium overflow-hidden">
                <table className="w-full text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-white/10">
                      <tr>
                         <th className="px-10 py-8 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] italic">Timeline</th>
                         <th className="px-10 py-8 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] italic">Resource Asset</th>
                         <th className="px-10 py-8 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] italic">Protocol</th>
                         <th className="px-10 py-8 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] italic">Payload</th>
                         <th className="px-10 py-8 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] italic">Operational Node</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {mockMaterialTransactions.filter(tx => mySiteMaterials.find(m => m.id === tx.materialId)).map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                           <td className="px-10 py-8 font-black text-slate-500 uppercase tracking-tighter tabular-nums">{tx.date}</td>
                           <td className="px-10 py-8 font-black text-slate-900 dark:text-white text-lg italic tracking-tight uppercase group-hover:text-primary transition-colors">
                              {mockMaterials.find(m => m.id === tx.materialId)?.name}
                           </td>
                           <td className="px-10 py-8">
                              <span className={cn(
                                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                tx.type === 'in' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                              )}>
                                {tx.type === 'in' ? 'Payload Received' : 'Active Consumption'}
                              </span>
                           </td>
                           <td className="px-10 py-8 font-black text-slate-900 dark:text-white text-xl italic tabular-nums">{tx.quantity}</td>
                           <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{tx.purpose || tx.supplier}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </TabsContent>
        </Tabs>

        {/* Modals - INTEGRATE PREMIUM STYLING via their component files if needed, or rely on shadcn defaults */}
        <AddStockModal 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen} 
          material={selectedMaterial} 
        />
        <LogUsageModal 
          open={isLogModalOpen} 
          onOpenChange={setIsLogModalOpen} 
          material={selectedMaterial} 
        />
      </div>
    </DashboardLayout>
  )
}
