"use client"

import * as React from "react"
import {
  Search,
  Plus,
  Package,
  Calendar,
  IndianRupee,
  Store,
  CreditCard,
  FileText,
  ImagePlus,
  Trash2,
  X,
  Filter as FilterIcon,
  Camera,
  Receipt,
  Briefcase,
  StickyNote,
  Truck,
  Wrench,
  Activity,
  Shield,
  Fuel,
  User,
  Settings,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn, formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { useFinanceStore } from "@/lib/store/useStore"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUserId } from "@/lib/auth/mockAuth"
import {
  MaterialPurchase,
  MachineryAsset,
  PurchaseCategory,
  PaymentMode
} from "@/lib/services/mockData"

const CATEGORIES: PurchaseCategory[] = [
  "Cement", "Steel", "Sand", "Bricks", "Tiles",
  "Paint", "Plumbing", "Electrical", "Wood", "Other"
]

const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Bank Transfer", "Credit"]
const UNITS = ["Bags", "Tons", "Kg", "Cu.Ft", "Pieces", "Sq.Ft", "Litres", "Metres", "Rolls", "Boxes", "Loads", "Other"]

const CATEGORY_COLORS: Record<PurchaseCategory, { bg: string; text: string; border: string }> = {
  Cement: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
  Steel: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Sand: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Bricks: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  Tiles: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  Paint: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  Plumbing: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
  Electrical: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  Wood: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  Other: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
}

const PAYMENT_COLORS: Record<PaymentMode, string> = {
  Cash: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  UPI: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Bank Transfer": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Credit: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

// ── Combined Logging Modal ──────────────────────────────────────────
function AddResourceModal({
  open,
  onClose,
  initialTab,
  sites
}: {
  open: boolean
  onClose: () => void
  initialTab: "material" | "machinery"
  sites: any[]
}) {
  const [activeTab, setActiveTab] = React.useState<"material" | "machinery">(initialTab)
  const addMaterialPurchase = useFinanceStore(s => s.addMaterialPurchase)
  const addMachineryAsset = useFinanceStore(s => s.addMachineryAsset)
  const [loading, setLoading] = React.useState(false)
  const [proofPreview, setProofPreview] = React.useState<string | null>(null)

  // Material Form
  const [materialForm, setMaterialForm] = React.useState({
    materialName: "",
    category: "Cement" as PurchaseCategory,
    quantity: "",
    unit: "Bags",
    totalAmount: "",
    supplierName: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    siteId: "all",
    paymentMode: "Cash" as PaymentMode,
    notes: ""
  })

  // Machinery Form
  const [machineryForm, setMachineryForm] = React.useState({
    name: "",
    type: "Excavator",
    siteId: "all",
    status: "Operational" as MachineryAsset["status"],
    fuelLevel: "80",
    lastService: new Date().toISOString().split("T")[0],
    nextService: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    operator: ""
  })

  React.useEffect(() => {
    if (open) {
      setActiveTab(initialTab)
    }
  }, [open, initialTab])

  const updateMaterialField = (field: string, value: string) => {
    setMaterialForm(prev => ({ ...prev, [field]: value }))
  }

  const updateMachineryField = (field: string, value: string) => {
    setMachineryForm(prev => ({ ...prev, [field]: value }))
  }

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setProofPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const selectedSite = sites.find(s => s.id === (activeTab === "material" ? materialForm.siteId : machineryForm.siteId))
    const siteName = selectedSite?.name || "General / Main Site"

    if (activeTab === "material") {
      if (!materialForm.materialName.trim() || !materialForm.totalAmount || !materialForm.supplierName.trim()) {
        toast.error("Please fill Material Name, Amount, and Supplier")
        setLoading(false)
        return
      }

      addMaterialPurchase({
        materialName: materialForm.materialName.trim(),
        category: materialForm.category,
        quantity: parseFloat(materialForm.quantity) || 0,
        unit: materialForm.unit,
        totalAmount: parseFloat(materialForm.totalAmount),
        supplierName: materialForm.supplierName.trim(),
        purchaseDate: materialForm.purchaseDate,
        siteId: materialForm.siteId === "all" ? "all" : materialForm.siteId,
        siteName: materialForm.siteId === "all" ? "General / Main Site" : siteName,
        paymentMode: materialForm.paymentMode,
        notes: materialForm.notes.trim(),
        proofUrl: proofPreview || undefined
      })

      toast.success("Purchase logged to ledger!", {
        description: `${materialForm.materialName} — ${formatCurrency(parseFloat(materialForm.totalAmount))}`
      })

      // Reset Material form
      setMaterialForm({
        materialName: "", category: "Cement", quantity: "", unit: "Bags",
        totalAmount: "", supplierName: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        siteId: "all", paymentMode: "Cash", notes: ""
      })
      setProofPreview(null)
    } else {
      if (!machineryForm.name.trim() || !machineryForm.operator.trim()) {
        toast.error("Please fill Machine Name and Operator Name")
        setLoading(false)
        return
      }

      addMachineryAsset({
        name: machineryForm.name.trim(),
        type: machineryForm.type,
        siteId: machineryForm.siteId === "all" ? "all" : machineryForm.siteId,
        siteName: machineryForm.siteId === "all" ? "General / Main Site" : siteName,
        status: machineryForm.status,
        fuelLevel: parseInt(machineryForm.fuelLevel) || 100,
        lastService: machineryForm.lastService,
        nextService: machineryForm.nextService,
        operator: machineryForm.operator.trim()
      })

      toast.success("Machinery asset added to fleet!", {
        description: `${machineryForm.name} — Status: ${machineryForm.status}`
      })

      // Reset Machinery form
      setMachineryForm({
        name: "",
        type: "Excavator",
        siteId: "all",
        status: "Operational",
        fuelLevel: "80",
        lastService: new Date().toISOString().split("T")[0],
        nextService: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        operator: ""
      })
    }

    setLoading(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-700/60 rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0A0F1E]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
              {activeTab === "material" ? <Receipt className="h-5 w-5 text-[#F97316]" /> : <Truck className="h-5 w-5 text-cyan-400" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Log Resource</h3>
              <p className="text-[10px] text-slate-500 font-bold">Add materials purchase or machinery to ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 p-2 bg-[#0A0F1E]/30 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("material")}
            className={cn(
              "flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
              activeTab === "material"
                ? "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            )}
          >
            Material Purchase
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("machinery")}
            className={cn(
              "flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
              activeTab === "machinery"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            )}
          >
            Fleet Asset
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "material" ? (
            /* Material Form Fields */
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Package className="h-3 w-3 text-[#F97316]" /> Material Name
                </label>
                <Input
                  value={materialForm.materialName}
                  onChange={(e) => updateMaterialField("materialName", e.target.value)}
                  placeholder="e.g. Ultratech Cement, TMT Steel Bars..."
                  className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-[#F97316]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={materialForm.category}
                    onChange={(e) => updateMaterialField("category", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#F97316]/50"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111827] text-slate-300">{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Unit</label>
                  <select
                    value={materialForm.unit}
                    onChange={(e) => updateMaterialField("unit", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#F97316]/50"
                  >
                    {UNITS.map(u => <option key={u} value={u} className="bg-[#111827] text-slate-300">{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Quantity</label>
                  <Input
                    type="number"
                    value={materialForm.quantity}
                    onChange={(e) => updateMaterialField("quantity", e.target.value)}
                    placeholder="0"
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-[#F97316]/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <IndianRupee className="h-3 w-3 text-emerald-500" /> Total Amount
                  </label>
                  <Input
                    type="number"
                    value={materialForm.totalAmount}
                    onChange={(e) => updateMaterialField("totalAmount", e.target.value)}
                    placeholder="₹0"
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Store className="h-3 w-3 text-sky-500" /> Supplier
                  </label>
                  <Input
                    value={materialForm.supplierName}
                    onChange={(e) => updateMaterialField("supplierName", e.target.value)}
                    placeholder="Supplier or shop name"
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-sky-500/50"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-violet-500" /> Purchase Date
                  </label>
                  <Input
                    type="date"
                    value={materialForm.purchaseDate}
                    onChange={(e) => updateMaterialField("purchaseDate", e.target.value)}
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold [&::-webkit-calendar-picker-indicator]:filter-invert focus:ring-1 focus:ring-violet-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-[#F97316]" /> Assigned Site
                  </label>
                  <select
                    value={materialForm.siteId}
                    onChange={(e) => updateMaterialField("siteId", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#F97316]/50"
                  >
                    <option value="all" className="bg-[#111827] text-slate-300">General / Main Site</option>
                    {sites.map(s => <option key={s.id} value={s.id} className="bg-[#111827] text-slate-300">{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-emerald-500" /> Payment Mode
                  </label>
                  <select
                    value={materialForm.paymentMode}
                    onChange={(e) => updateMaterialField("paymentMode", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-emerald-500/50"
                  >
                    {PAYMENT_MODES.map(m => <option key={m} value={m} className="bg-[#111827] text-slate-300">{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <StickyNote className="h-3 w-3 text-slate-400" /> Notes / Remarks
                </label>
                <Textarea
                  value={materialForm.notes}
                  onChange={(e) => updateMaterialField("notes", e.target.value)}
                  placeholder="Any additional details..."
                  className="min-h-[60px] bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-medium placeholder:text-slate-500 resize-none focus:ring-1 focus:ring-slate-500/50"
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Camera className="h-3 w-3 text-amber-500" /> Upload Bill / Receipt
                </label>
                {proofPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0A0F1E]">
                    <img src={proofPreview} alt="Proof" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => setProofPreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-red-600 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/10 bg-[#0A0F1E]/50 cursor-pointer hover:border-[#F97316]/30 hover:bg-[#F97316]/5 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImagePlus className="h-5 w-5 text-[#F97316]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                      Upload proof bill image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </>
          ) : (
            /* Machinery Form Fields */
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck className="h-3 w-3 text-cyan-400" /> Machine Asset Name
                </label>
                <Input
                  value={machineryForm.name}
                  onChange={(e) => updateMachineryField("name", e.target.value)}
                  placeholder="e.g. CAT 320D Excavator, Tata Tipper 2825..."
                  className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Asset Type</label>
                  <select
                    value={machineryForm.type}
                    onChange={(e) => updateMachineryField("type", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-cyan-500/50"
                  >
                    <option value="Excavator" className="bg-[#111827] text-slate-300">Excavator</option>
                    <option value="Tipper Truck" className="bg-[#111827] text-slate-300">Tipper Truck</option>
                    <option value="Backhoe Loader" className="bg-[#111827] text-slate-300">Backhoe Loader</option>
                    <option value="Concrete Mixer" className="bg-[#111827] text-slate-300">Concrete Mixer</option>
                    <option value="Tower Crane" className="bg-[#111827] text-slate-300">Tower Crane</option>
                    <option value="Road Roller" className="bg-[#111827] text-slate-300">Road Roller</option>
                    <option value="Generator" className="bg-[#111827] text-slate-300">Diesel Generator</option>
                    <option value="Other" className="bg-[#111827] text-slate-300">Other heavy equipment</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="h-3 w-3 text-violet-500" /> Operator Name
                  </label>
                  <Input
                    value={machineryForm.operator}
                    onChange={(e) => updateMachineryField("operator", e.target.value)}
                    placeholder="Name of pilot/operator"
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-cyan-400" /> Assigned Cluster/Site
                  </label>
                  <select
                    value={machineryForm.siteId}
                    onChange={(e) => updateMachineryField("siteId", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-cyan-500/50"
                  >
                    <option value="all" className="bg-[#111827] text-slate-300">General / Main Site</option>
                    {sites.map(s => <option key={s.id} value={s.id} className="bg-[#111827] text-slate-300">{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={machineryForm.status}
                    onChange={(e) => updateMachineryField("status", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs font-bold text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-cyan-500/50"
                  >
                    <option value="Operational" className="bg-[#111827] text-slate-300 text-emerald-400">Operational</option>
                    <option value="Maintenance" className="bg-[#111827] text-slate-300 text-amber-400">Maintenance</option>
                    <option value="Idle" className="bg-[#111827] text-slate-300 text-slate-400">Idle</option>
                    <option value="Broken" className="bg-[#111827] text-slate-300 text-rose-500">Broken / Off-line</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5 text-amber-500" /> Fuel Reserve</span>
                  <span>{machineryForm.fuelLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={machineryForm.fuelLevel}
                  onChange={(e) => updateMachineryField("fuelLevel", e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Last Serviced</label>
                  <Input
                    type="date"
                    value={machineryForm.lastService}
                    onChange={(e) => updateMachineryField("lastService", e.target.value)}
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold [&::-webkit-calendar-picker-indicator]:filter-invert focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Next Service</label>
                  <Input
                    type="date"
                    value={machineryForm.nextService}
                    onChange={(e) => updateMachineryField("nextService", e.target.value)}
                    className="h-11 bg-[#0A0F1E] border-white/5 rounded-xl text-white text-xs font-bold [&::-webkit-calendar-picker-indicator]:filter-invert focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0A0F1E]/60 flex gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 text-slate-400 hover:text-white hover:bg-slate-800 font-bold rounded-xl text-xs"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={cn(
              "flex-[2] h-12 text-white font-black rounded-xl tracking-wider shadow-lg text-xs transition-all active:scale-95",
              activeTab === "material"
                ? "bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-[#EA580C] hover:to-amber-500 shadow-[#F97316]/20"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20"
            )}
          >
            {loading ? "SAVING..." : activeTab === "material" ? "✅ LOG PURCHASE" : "🚀 PROVISION ASSET"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main View ────────────────────────────────────────────────────────
export function ProcurementFleetView() {
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<"all" | "material" | "machinery">("all")
  const [siteFilter, setSiteFilter] = React.useState("all")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"material" | "machinery">("material")

  // Store selections
  const {
    materialPurchases,
    machineryAssets,
    deleteMaterialPurchase,
    deleteMachineryAsset,
    updateMachineryStatus
  } = useFinanceStore()

  // Fetch sites for filter dropdown
  const { data: sites = [] } = useQuery<any[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      try {
        const userId = await getCurrentUserId()
        const res = await fetch("/api/sites", {
          headers: { "x-user-id": userId }
        })
        if (!res.ok) throw new Error("Failed to fetch sites")
        return res.json()
      } catch {
        return []
      }
    }
  })

  // Open modal helper
  const handleOpenModal = (mode: "material" | "machinery") => {
    setModalMode(mode)
    setIsModalOpen(true)
  }

  // Combined stats
  const stats = React.useMemo(() => {
    const totalMaterialsSpend = materialPurchases.reduce((sum, p) => sum + p.totalAmount, 0)
    const operationalCount = machineryAssets.filter(m => m.status === "Operational").length
    const totalMachines = machineryAssets.length
    const missingProofs = materialPurchases.filter(p => !p.proofUrl).length
    const inMaintenanceCount = machineryAssets.filter(m => m.status === "Maintenance").length

    const fleetUptime = totalMachines > 0 ? Math.round((operationalCount / totalMachines) * 100) : 0

    return {
      totalSpend: totalMaterialsSpend,
      totalAssets: totalMachines,
      fleetUptime,
      operationalCount,
      inMaintenanceCount,
      missingProofs,
      totalEntries: materialPurchases.length + machineryAssets.length
    }
  }, [materialPurchases, machineryAssets])

  // Filtered mixed list
  const mixedList = React.useMemo(() => {
    const materials = materialPurchases.map(p => ({
      ...p,
      rowType: "material" as const,
      timestamp: new Date(p.purchaseDate).getTime()
    }))

    const machinery = machineryAssets.map(m => ({
      ...m,
      rowType: "machinery" as const,
      timestamp: new Date(m.lastService).getTime() // Sort by service date
    }))

    let combined = []
    if (typeFilter === "all") {
      combined = [...materials, ...machinery]
    } else if (typeFilter === "material") {
      combined = materials
    } else {
      combined = machinery
    }

    // Apply Site Filter
    if (siteFilter !== "all") {
      combined = combined.filter(item => item.siteId === siteFilter)
    }

    // Apply Search Filter
    if (search.trim() !== "") {
      const q = search.toLowerCase()
      combined = combined.filter(item => {
        if (item.rowType === "material") {
          const m = item as any
          return (
            m.materialName.toLowerCase().includes(q) ||
            m.supplierName.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q)
          )
        } else {
          const mach = item as any
          return (
            mach.name.toLowerCase().includes(q) ||
            mach.type.toLowerCase().includes(q) ||
            mach.operator.toLowerCase().includes(q)
          )
        }
      })
    }

    // Sort chronologically (latest first)
    return combined.sort((a, b) => b.timestamp - a.timestamp)
  }, [materialPurchases, machineryAssets, typeFilter, siteFilter, search])

  // Handle item deletions
  const handleDeleteItem = (id: string, rowType: "material" | "machinery") => {
    if (rowType === "material") {
      deleteMaterialPurchase(id)
      toast.success("Purchase entry removed from ledger")
    } else {
      deleteMachineryAsset(id)
      toast.success("Machinery asset removed from fleet")
    }
  }

  // Toggle status cycle
  const handleToggleStatus = (id: string, currentStatus: MachineryAsset["status"]) => {
    const statuses: MachineryAsset["status"][] = ["Operational", "Maintenance", "Idle", "Broken"]
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length
    updateMachineryStatus(id, statuses[nextIdx])
    toast.success(`Asset status updated to ${statuses[nextIdx]}`)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. COMPACT ACTION BAR */}
      <div className="flex items-center justify-end gap-3 pb-2">
        <Button
          onClick={() => handleOpenModal("material")}
          className="h-11 px-4 bg-gradient-to-r from-[#F97316] to-amber-600 hover:from-[#EA580C] hover:to-amber-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Log Purchase
        </Button>
        <Button
          onClick={() => handleOpenModal("machinery")}
          className="h-11 px-4 bg-[#0F172A] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center gap-2"
        >
          <Truck className="h-4 w-4 text-cyan-400" /> Provision Fleet
        </Button>
      </div>

      {/* 2. COMBINED METRICS DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Procurement */}
        <div className="p-5 rounded-[2rem] bg-[#111827] border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <IndianRupee className="h-32 w-32 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Spend</p>
            <p className="text-2xl font-black text-amber-500 mt-2 tabular-nums">{formatCurrency(stats.totalSpend)}</p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-4 block">Material procurements</span>
        </div>

        {/* Card 2: Fleet Status */}
        <div className="p-5 rounded-[2rem] bg-[#111827] border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Truck className="h-32 w-32 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fleet Uptime</p>
            <p className="text-2xl font-black text-cyan-400 mt-2 tabular-nums">{stats.fleetUptime}%</p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-4 block">
            {stats.operationalCount} of {stats.totalAssets} assets active
          </span>
        </div>

        {/* Card 3: Combined ledger count */}
        <div className="p-5 rounded-[2rem] bg-[#111827] border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Receipt className="h-32 w-32 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Logs</p>
            <p className="text-2xl font-black text-white mt-2 tabular-nums">{stats.totalEntries}</p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-4 block">Items registered in database</span>
        </div>

        {/* Card 4: Critical alerts */}
        <div className="p-5 rounded-[2rem] bg-[#111827] border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <AlertCircle className="h-32 w-32 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attention Required</p>
            <p className={cn("text-2xl font-black mt-2", (stats.missingProofs > 0 || stats.inMaintenanceCount > 0) ? "text-rose-500 animate-pulse" : "text-emerald-400")}>
              {stats.missingProofs + stats.inMaintenanceCount}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-4 block">
            {stats.missingProofs} no-bill, {stats.inMaintenanceCount} in maintenance
          </span>
        </div>
      </div>

      {/* 3. SEARCH & INTEGRATED FILTERS */}
      <div className="bg-[#111827] rounded-[2rem] border border-slate-800 p-4 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search registry by material name, supplier, asset type, or operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 h-12 bg-[#0A0F1E] border-slate-800 rounded-xl text-white text-xs font-bold placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>

          {/* Site selection */}
          {sites.length > 0 && (
            <div className="relative min-w-[200px]">
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#0A0F1E] border border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-300 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-cyan-500/40"
              >
                <option value="all" className="bg-[#111827]">All Sites / Clusters</option>
                {sites.map(s => <option key={s.id} value={s.id} className="bg-[#111827]">{s.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Ledger Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/60 pt-3">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
            <FilterIcon className="h-3 w-3 text-slate-600" /> Filter Feed:
          </span>
          <button
            onClick={() => setTypeFilter("all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all border shrink-0",
              typeFilter === "all"
                ? "bg-white text-slate-950 border-white"
                : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700"
            )}
          >
            All Ledger
          </button>
          <button
            onClick={() => setTypeFilter("material")}
            className={cn(
              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all border shrink-0",
              typeFilter === "material"
                ? "bg-[#F97316] text-white border-[#F97316]"
                : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700"
            )}
          >
            Material Purchases
          </button>
          <button
            onClick={() => setTypeFilter("machinery")}
            className={cn(
              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all border shrink-0",
              typeFilter === "machinery"
                ? "bg-cyan-500 text-slate-950 border-cyan-500"
                : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700"
            )}
          >
            Machinery Fleet
          </button>
        </div>
      </div>

      {/* 4. MIXED TIMELINE LEDGER */}
      <div className="bg-[#111827] rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-5 py-4 bg-[#0A0F1E]/50 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coherent Resource Feed</h3>
          <span className="text-[10px] font-bold text-slate-500">{mixedList.length} items logged</span>
        </div>

        {mixedList.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-[#0A0F1E] border border-slate-800 flex items-center justify-center text-slate-700 animate-pulse">
              <Activity className="h-8 w-8" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No resources match filters</p>
              <p className="text-[10px] text-slate-500 font-medium">Try checking your search terms or register a new resource above.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {mixedList.map((item: any) => {
              if (item.rowType === "material") {
                const entry = item as MaterialPurchase
                const catColor = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Other
                const payColor = PAYMENT_COLORS[entry.paymentMode] || ""
                const dateFormatted = new Date(entry.purchaseDate).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })

                return (
                  <div key={entry.id} className="p-5 hover:bg-slate-800/10 transition-colors group">
                    <div className="flex items-start gap-4">
                      {/* Left icon box: Material */}
                      <div className={cn("h-12 w-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border shadow-inner", catColor.bg, catColor.border)}>
                        <Package className={cn("h-5 w-5", catColor.text)} />
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black text-white leading-tight uppercase tracking-tight flex items-center gap-2">
                              {entry.materialName}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", catColor.bg, catColor.text, catColor.border)}>
                                {entry.category}
                              </span>
                              {entry.quantity > 0 && (
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  {entry.quantity} {entry.unit}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right Amount */}
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-amber-500 leading-none tabular-nums">
                              {formatCurrency(entry.totalAmount)}
                            </p>
                            <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{dateFormatted}</p>
                          </div>
                        </div>

                        {/* Meta logs */}
                        <div className="flex items-center gap-3 mt-3 flex-wrap text-slate-400">
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <Store className="h-3.5 w-3.5 text-slate-500" /> {entry.supplierName}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-800 shrink-0" />
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-slate-500" /> {entry.siteName}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-800 shrink-0" />
                          <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", payColor)}>
                            {entry.paymentMode}
                          </span>
                        </div>

                        {/* Notes */}
                        {entry.notes && (
                          <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed bg-[#0A0F1E]/40 p-2 rounded-xl border border-white/5">
                            &ldquo;{entry.notes}&rdquo;
                          </p>
                        )}

                        {/* Receipt Attachment */}
                        {entry.proofUrl && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="relative rounded-lg overflow-hidden border border-slate-800 h-10 w-14 group/img cursor-pointer">
                              <img src={entry.proofUrl} alt="Bill proof" className="h-full w-full object-cover transition-transform group-hover/img:scale-110" />
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" /> Receipt Uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteItem(entry.id, "material")}
                        className="p-2 rounded-xl text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        title="Delete log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              } else {
                const asset = item as MachineryAsset
                const fuelPercent = asset.fuelLevel

                return (
                  <div key={asset.id} className="p-5 hover:bg-slate-800/10 transition-colors group">
                    <div className="flex items-start gap-4">
                      {/* Left icon box: Machinery */}
                      <div className="h-12 w-12 rounded-[1.25rem] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-inner">
                        <Truck className="h-5 w-5" />
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black text-white leading-tight uppercase tracking-tight flex items-center gap-2">
                              {asset.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                              {asset.type}
                            </p>
                          </div>

                          {/* Registry Status Badge */}
                          <div className="text-right shrink-0">
                            <button
                              onClick={() => handleToggleStatus(asset.id, asset.status)}
                              className={cn(
                                "text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95",
                                asset.status === 'Operational' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                asset.status === 'Maintenance' ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse" :
                                asset.status === 'Broken' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                "bg-slate-800 border-slate-700 text-slate-400"
                              )}
                              title="Click to toggle status"
                            >
                              {asset.status}
                            </button>
                            <p className="text-[8px] text-slate-500 font-bold mt-1.5 uppercase tracking-wider">TAP TO TOGGLE</p>
                          </div>
                        </div>

                        {/* Metadata row */}
                        <div className="flex items-center gap-3 mt-3 flex-wrap text-slate-400">
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-slate-500" /> Operator: {asset.operator}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-800 shrink-0" />
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-slate-500" /> Cluster: {asset.siteName}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-800 shrink-0" />
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" /> Next Service: {new Date(asset.nextService).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>

                        {/* Fuel progress bar */}
                        <div className="mt-3.5 flex items-center gap-3 max-w-xs">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">Fuel:</span>
                          <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden p-0">
                            <div
                              className={cn(
                                "h-full transition-all duration-500",
                                fuelPercent > 50 ? "bg-emerald-500" : fuelPercent > 20 ? "bg-cyan-400" : "bg-rose-500 animate-pulse"
                              )}
                              style={{ width: `${fuelPercent}%` }}
                            />
                          </div>
                          <span className={cn("text-[9px] font-black tabular-nums", fuelPercent > 20 ? "text-slate-400" : "text-rose-500 font-bold")}>
                            {fuelPercent}%
                          </span>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteItem(asset.id, "machinery")}
                        className="p-2 rounded-xl text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        title="Decommission machine"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        )}
      </div>

      {/* 5. MODAL FORM */}
      <AddResourceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalMode}
        sites={sites}
      />
    </div>
  )
}
