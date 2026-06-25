"use client"

import * as React from "react"
import { Modal } from "@/components/shared/Modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Material, mockMaterials } from "@/lib/services/mockData"
import { toast } from "sonner"
import { PackageOpen, PackageCheck } from "lucide-react"

interface MaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material?: Material
}

export function AddStockModal({ open, onOpenChange, material }: MaterialModalProps) {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(`Inventory Synchronized: ${material?.name || 'Asset'}`)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      title="Resource: Payload In"
      description="Record a new tactical delivery or site replenishment."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Material Asset</Label>
          <Select defaultValue={material?.id}>
            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold italic shadow-inner">
              <SelectValue placeholder="Identify Resource" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-premium">
              {mockMaterials.map(m => (
                <SelectItem key={m.id} value={m.id} className="rounded-xl my-1 font-bold">{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Volume Received</Label>
            <Input type="number" placeholder="00" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic tabular-nums shadow-inner px-6" required />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Unit Valuation (₹)</Label>
            <Input type="number" placeholder="₹" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic tabular-nums shadow-inner px-6" required defaultValue={material?.unitPrice} />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Logistical Source (Supplier)</Label>
          <Input placeholder="Enter high-fidelity origin details..." className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic shadow-inner px-6" required />
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Telemetry Evidence (Photo)</Label>
          <div className="border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-primary/40 transition-all duration-700 group shadow-inner">
            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-primary transition-all shadow-premium">
               <PackageOpen className="h-8 w-8" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Capture Proof of Delivery</span>
          </div>
        </div>

        <Button type="submit" className="w-full h-16 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-2.5rem shadow-premium-dark border border-white/10 transition-all active:scale-95 italic" disabled={loading}>
          {loading ? "Synchronizing..." : "Commit Transaction"}
        </Button>
      </form>
    </Modal>
  )
}

export function LogUsageModal({ open, onOpenChange, material }: MaterialModalProps) {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(`Audit Updated: ${material?.name || 'Asset'} Consumption Logged`)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      title="Resource: Payload Out"
      description="Authorize tactical consumption & depleting site stock."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Material Identity</Label>
          <div className="p-6 rounded-2.5rem bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-premium flex justify-between items-center group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-xl font-black italic tracking-tighter uppercase relative z-10">{material?.name}</span>
            <div className="flex flex-col items-end relative z-10">
               <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Live Reserve</span>
               <span className="text-lg font-black italic tabular-nums">{material?.currentStock} {material?.unit}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Consumption Volume</Label>
          <Input type="number" placeholder={`Max Capacity: ${material?.currentStock}`} className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic text-xl tabular-nums shadow-inner px-8" required />
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Operational Purpose</Label>
          <Select>
            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold italic shadow-inner">
              <SelectValue placeholder="Define Deployment Area" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-premium">
              <SelectItem value="foundation" className="rounded-xl my-1 font-bold">Structural Foundation</SelectItem>
              <SelectItem value="slab" className="rounded-xl my-1 font-bold">Vertical Expansion / Slab</SelectItem>
              <SelectItem value="walls" className="rounded-xl my-1 font-bold">Enclosure / Wall Systems</SelectItem>
              <SelectItem value="finishing" className="rounded-xl my-1 font-bold">Architectural Finishing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-full w-32 bg-amber-500/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="flex gap-5 relative z-10">
             <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-premium-amber shrink-0 animate-pulse">
                <PackageCheck className="h-6 w-6" />
             </div>
             <div className="space-y-1">
                <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Protocol Warning</p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ledger will sync immediately. Critical alerts trigger if reserves fall below <span className="text-slate-900 dark:text-white font-black italic">{material?.minStock} {material?.unit}</span>.
                </p>
             </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-20 bg-primary hover:bg-primary/95 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-[2rem] shadow-premium-primary transition-all active:scale-95 italic" disabled={loading}>
          {loading ? "Processing Sync..." : "Authorize Resource Deployment"}
        </Button>
      </form>
    </Modal>
  )
}
