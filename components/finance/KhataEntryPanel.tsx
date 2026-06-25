"use client"

import * as React from "react"
import { Plus, Package, HardHat, Settings, HelpCircle, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { mockSites, mockMaterials } from "@/lib/services/mockData"
import { toast } from "sonner"
import { useFinanceStore } from "@/lib/store/useStore"

type Category = 'Material' | 'Labour' | 'Machinery' | 'Misc'

export function KhataEntryPanel({ onSuccess }: { onSuccess?: () => void }) {
  const [category, setCategory] = React.useState<Category>('Material')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const addTransaction = useFinanceStore(state => state.addTransaction)
  const [amount, setAmount] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [selectedSite, setSelectedSite] = React.useState(mockSites[0].id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) {
      toast.error("Please provide both amount and description.")
      return
    }

    setIsSubmitting(true)
    
    // Simulate real-time update
    setTimeout(() => {
      addTransaction({
        type: 'expense',
        category: category as any,
        amount: Number(amount),
        description: description,
        siteId: selectedSite,
        loggedBy: 'Abhay Sharma' // Current User
      })

      setIsSubmitting(false)
      toast.success(`Fiscal Log Committed: ${category} Expenditure Authenticated`, {
        description: "Global Master Ledger synchronizing.",
      })
      
      // Reset form
      setAmount('')
      setDescription('')
      onSuccess?.()
    }, 1000)
  }

  const categoryTabs = [
    { id: 'Material' as Category, icon: Package },
    { id: 'Labour' as Category, icon: HardHat },
    { id: 'Machinery' as Category, icon: Settings },
    { id: 'Misc' as Category, icon: HelpCircle },
  ]

  return (
    <div className="p-10 rounded-[4rem] border border-white/20 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl shadow-premium animate-in slide-in-from-right-8 duration-1000">
      <div className="flex items-center gap-5 mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="h-14 w-14 rounded-2xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 shadow-premium">
          <Plus className="h-7 w-7" />
        </div>
        <div className="space-y-1">
           <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter italic">Tactical Ledger</h3>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Initialize Expenditure Entry</p>
        </div>
      </div>

      {/* Category Tabs - Refined */}
      <div className="flex p-2 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] gap-2 mb-10 shadow-inner">
        {categoryTabs.map(tab => {
          const Icon = tab.icon
          const isActive = category === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-500",
                isActive 
                  ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-premium-dark italic" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.id}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Operational Node (Site)</Label>
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold italic shadow-inner px-6 text-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-premium p-4">
              {mockSites.map(s => (
                <SelectItem key={s.id} value={s.id} className="rounded-xl my-2 font-bold">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Transaction Payload (₹)</Label>
          <div className="relative group">
            <Input 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-20 rounded-2.5rem bg-slate-50 dark:bg-slate-900 border-none font-black italic text-3xl tabular-nums shadow-inner px-10 focus:ring-primary/20"
                required
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl italic opacity-50">INR</div>
          </div>
        </div>

        {category === 'Material' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Resource Classification</Label>
              <Select>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold italic shadow-inner px-6">
                  <SelectValue placeholder="Identify Manifest..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-premium p-4">
                  {mockMaterials.map(m => (
                    <SelectItem key={m.id} value={m.id} className="rounded-xl my-2 font-bold">{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Quantity</Label>
                 <Input placeholder="000" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic tabular-nums shadow-inner px-6" />
               </div>
               <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Unit</Label>
                 <Input placeholder="Metric" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic shadow-inner px-6" />
               </div>
            </div>
          </div>
        )}

        {category === 'Labour' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Personnel / Squad Designation</Label>
              <Input placeholder="E.g. Structural Crew Alpha" className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black italic shadow-inner px-8" />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Fiscal Evidence (Receipt)</Label>
          <div className="h-32 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-primary/40 transition-all duration-700 group shadow-inner">
            <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-primary transition-all shadow-premium">
               <Camera className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Authorize Receipt Sync</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Addendum Notes</Label>
          <Textarea 
            placeholder="Document any tactical anomalies or specific spend reasons..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-none italic font-bold placeholder:text-slate-300 shadow-inner p-8 focus:ring-primary/20"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-20 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-premium-dark border border-white/10 transition-all active:scale-95 italic group"
        >
          {isSubmitting ? (
             <div className="flex items-center gap-4">
                <Settings className="h-5 w-5 animate-spin text-primary" /> Synchronizing Ledger...
             </div>
          ) : (
             <div className="flex items-center gap-4 group-hover:scale-105 transition-transform">
                Commit Fiscal Record <Plus className="h-5 w-5 text-primary" />
             </div>
          )}
        </Button>
      </form>
    </div>
  )
}
