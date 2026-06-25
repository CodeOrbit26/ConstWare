"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/shared/Badge"
import { 
  Camera, 
  Users, 
  Hammer, 
  Package, 
  AlertTriangle, 
  CalendarDays,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
  Clock,
  Smartphone,
  Zap,
  BrainCircuit,
  ArrowRight,
  Lock
} from "lucide-react"
import { mockMaterials } from "@/lib/services/mockData"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import imageCompression from "browser-image-compression"
import { getAIAnalysis } from "@/lib/services/apiServices"

interface MaterialRow {
  id: string
  matId: string
  qty: string
  isAiSuggested?: boolean
}

export default function NewDPRPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [isAiProcessing, setIsAiProcessing] = React.useState(false)
  
  // Form State
  const [workDone, setWorkDone] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const [materialsUsed, setMaterialsUsed] = React.useState<MaterialRow[]>([{ id: "1", matId: "", qty: "" }])
  const [photos, setPhotos] = React.useState<{ file: File; preview: string; base64: string }[]>([])
  const [aiAnalysis, setAiAnalysis] = React.useState<any>(null)
  const [issueSeverity, setIssueSeverity] = React.useState("none")
  const [issueDescription, setIssueDescription] = React.useState("")

  const attendance = { present: 42, half: 3, absent: 5, total: 50}
  const commonTags = ["Foundation", "Slab", "Plastering", "Tiling", "Electrical", "Plumbing", "Finishing"]

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const addMaterialRow = (matId = "", qty = "", isAi = false) => {
    setMaterialsUsed(prev => [...prev, { id: Math.random().toString(), matId, qty, isAiSuggested: isAi }])
  }

  const updateMaterialRow = (id: string, updates: Partial<MaterialRow>) => {
    setMaterialsUsed(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const removeMaterialRow = (id: string) => {
    setMaterialsUsed(materialsUsed.filter(m => m.id !== id))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    toast.info("Optimizing high-fidelity captures...")
    try {
      const newPhotos = await Promise.all(
        files.slice(0, 5).map(async (file) => {
          const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true }
          const compressed = await imageCompression(file, options)
          const preview = URL.createObjectURL(compressed)
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(compressed)
          })
          return { file: compressed, preview, base64 }
        })
      )
      setPhotos(prev => [...prev, ...newPhotos])
    } catch (err) {
      toast.error("Failed to process telemetry")
    }
  }

  const handleAIAutoFill = async () => {
    if (photos.length === 0) {
      toast.error("Upload site captures first for AI intelligence")
      return
    }

    setIsAiProcessing(true)
    try {
      const data = await getAIAnalysis("site-analysis", { images: photos.map(p => p.base64) })
      if (data.error) throw new Error(data.error)

      setWorkDone(data.summary || "")
      setTags(data.workDoneTags || [])
      setIssueDescription(data.issues || "")
      setIssueSeverity(data.severity || "none")
      
      if (data.materialsUsed && data.materialsUsed.length > 0) {
        const matRows: MaterialRow[] = data.materialsUsed.map((m: any) => {
          const foundMat = mockMaterials.find(mm => mm.name.toLowerCase().includes(m.name.toLowerCase()))
          return {
            id: Math.random().toString(),
            matId: foundMat?.id || "",
            qty: m.quantity.toString(),
            isAiSuggested: true
          }
        })
        setMaterialsUsed(matRows)
      }

      setAiAnalysis(data)
      toast.success("DPR auto-filled with Multi-modal Intelligence!")
    } catch (error) {
      toast.error("AI analysis failed. Reverting to manual entry.")
    } finally {
      setIsAiProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Daily Progress Report Committed Successfully")
      router.push("/supervisor/dashboard")
    }, 2000)
  }

  return (
    <DashboardLayout title="Deployment: DPR Commit">
      <div className="max-w-5xl mx-auto pb-40">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 border-b border-slate-100 dark:border-slate-800 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" /> Digital Site Journal
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Progress <br /> <span className="text-primary not-italic">Reporting</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Intelligence Node: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • Operational Zone 4</p>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <Button 
                type="button"
                className="h-16 px-10 bg-slate-950 hover:bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-premium-dark border border-white/10 group transition-all"
                onClick={handleAIAutoFill}
                disabled={isAiProcessing || photos.length === 0}
              >
                {isAiProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-3 text-primary" /> : <Sparkles className="h-5 w-5 mr-3 text-primary group-hover:rotate-12 transition-transform" />}
                Trigger Multi-modal Sync
              </Button>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-20">
          
          {/* SECTION 1 - ATTENDANCE - REFINED */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-950 dark:bg-white rounded-[1.25rem] flex items-center justify-center text-white dark:text-slate-950 shadow-premium">
                     <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">01. Workforce Sync Status</h3>
               </div>
               <Badge variant="outline" className="rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5">Deployment Verified</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: "Present Crew", val: attendance.present, color: "text-emerald-500", bg: "bg-emerald-500/5" },
                 { label: "Partial Shift", val: attendance.half, color: "text-amber-500", bg: "bg-amber-500/5" },
                 { label: "Absent Units", val: attendance.absent, color: "text-rose-500", bg: "bg-rose-500/5" },
                 { label: "Total Capacity", val: attendance.total, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-900" }
               ].map(stat => (
                 <div key={stat.label} className={cn("p-10 rounded-[3rem] shadow-premium border border-white/20 dark:border-slate-800/50 transition-all duration-500 hover:translate-y-[-4px]", stat.bg)}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                    <p className={cn("text-5xl font-black italic tracking-tighter tabular-nums", stat.color)}>{stat.val}</p>
                 </div>
               ))}
            </div>
          </section>

          {/* SECTION 2 - PHOTOS - HIGH FIDELITY */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
               <div className="h-12 w-12 bg-slate-950 dark:bg-white rounded-[1.25rem] flex items-center justify-center text-white dark:text-slate-950 shadow-premium">
                  <Camera className="h-6 w-6" />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">02. Visual Evidence Telemetry</h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
               {photos.map((p, i) => (
                 <div key={i} className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-premium group transition-all duration-1000 hover:scale-[1.05]">
                    <img src={p.preview} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="site capture" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         type="button"
                         onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                         className="h-14 w-14 bg-white/20 backdrop-blur-3xl rounded-[1.25rem] flex items-center justify-center text-white hover:bg-rose-500 transition-all active:scale-90"
                       >
                          <Trash2 className="h-6 w-6" />
                       </button>
                    </div>
                 </div>
               ))}
               {photos.length < 5 && (
                 <label className="aspect-square rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-primary/40 transition-all duration-700 group shadow-inner">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    <div className="h-20 w-20 rounded-[1.75rem] bg-slate-50 dark:bg-slate-800 shadow-premium flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-primary transition-all">
                       <Plus className="h-10 w-10 transition-transform group-hover:rotate-180 duration-1000" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Provision Capture</span>
                 </label>
               )}
            </div>

            {photos.length > 0 && !aiAnalysis && !isAiProcessing && (
              <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-premium-dark flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group border border-white/5">
                 <div className="absolute top-0 right-0 h-full w-64 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                 <div className="space-y-2 relative z-10">
                    <p className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                       <Sparkles className="h-6 w-6 text-primary" /> Multi-modal Sync Ready
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Intelligence node can auto-synthesize from current captures</p>
                 </div>
                 <Button type="button" onClick={handleAIAutoFill} className="h-16 px-10 bg-primary hover:bg-primary/95 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-premium-primary transition-all hover:scale-105 active:scale-95">
                    Sync via AI Intelligence
                 </Button>
              </div>
            )}
          </section>

          {/* SECTION 3 - WORK DONE - SOPHISTICATED */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
               <div className="h-12 w-12 bg-slate-950 dark:bg-white rounded-[1.25rem] flex items-center justify-center text-white dark:text-slate-950 shadow-premium">
                  <Hammer className="h-6 w-6" />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">03. Operational Log Archive</h3>
            </div>
            
            <div className="space-y-10">
               <div className="flex flex-wrap gap-4">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 shadow-premium-sm group/tag",
                        tags.includes(tag) 
                          ? "bg-slate-950 border-white/10 text-white shadow-premium-dark italic" 
                          : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary/40 hover:text-primary"
                      )}
                    >
                      {tag}
                      {aiAnalysis && aiAnalysis.workDoneTags?.includes(tag) && <Sparkles className="h-3.5 w-3.5 ml-3 text-primary inline-block transition-transform group-hover/tag:rotate-12" />}
                    </button>
                  ))}
               </div>
               
               <div className="relative group/text">
                  <Textarea 
                    placeholder="Provide a high-fidelity overview of site milestones achieved during this cycle..." 
                    className={cn(
                      "min-h-[300px] p-12 text-lg font-bold rounded-[4rem] border border-white/20 dark:border-slate-800/50 shadow-premium dark:bg-slate-950/50 backdrop-blur-3xl transition-all duration-1000 focus-visible:ring-primary/20 italic placeholder:text-slate-300 dark:placeholder:text-slate-700",
                      aiAnalysis && "border-primary/40 bg-primary/5 dark:bg-primary/5 ring-4 ring-primary/5"
                    )}
                    value={workDone}
                    onChange={(e) => setWorkDone(e.target.value)}
                    required
                  />
                  {aiAnalysis && (
                    <div className="absolute top-10 right-12 flex items-center gap-3 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-premium-primary italic animate-in fade-in zoom-in duration-500">
                       <Sparkles className="h-4 w-4" /> Synthesized via AI-Node
                    </div>
                  )}
               </div>
            </div>
          </section>

          {/* SECTION 4 - MATERIALS USED - REFINED GRID */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
               <div className="h-12 w-12 bg-slate-950 dark:bg-white rounded-[1.25rem] flex items-center justify-center text-white dark:text-slate-950 shadow-premium">
                  <Package className="h-6 w-6" />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">04. Resource Deployment Log</h3>
            </div>

            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[4rem] p-12 shadow-premium border border-white/20 dark:border-slate-800/50 space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-2 bg-slate-50 dark:bg-slate-900 group-hover:bg-primary transition-colors duration-1000" />
               
               {materialsUsed.map((row) => (
                 <div key={row.id} className="flex flex-col lg:flex-row gap-10 items-end p-8 border border-white/10 dark:border-slate-800/50 rounded-[2.5rem] transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50 group/row relative overflow-hidden">
                     {row.isAiSuggested && <div className="absolute top-0 right-0 p-6 opacity-10"><Sparkles className="h-10 w-10 text-primary" /></div>}
                     
                     <div className="flex-1 w-full space-y-4">
                       <Label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] italic ml-2">Resource Asset</Label>
                       <Select value={row.matId} onValueChange={(val) => updateMaterialRow(row.id, { matId: val })}>
                           <SelectTrigger className={cn("h-16 rounded-2xl border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 font-black italic tracking-tight transition-all text-lg", row.isAiSuggested && "border-primary/40 bg-primary/5 ring-2 ring-primary/5")}>
                             <SelectValue placeholder="Identify Payload" />
                           </SelectTrigger>
                           <SelectContent className="rounded-[2rem] shadow-premium p-4">
                             {mockMaterials.map(m => (
                               <SelectItem key={m.id} value={m.id} className="rounded-xl my-2 text-md font-bold">{m.name}</SelectItem>
                             ))}
                           </SelectContent>
                       </Select>
                     </div>
                     <div className="w-full lg:w-64 space-y-4">
                       <Label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] italic ml-2">Payload Volume</Label>
                       <div className="relative group/qty">
                         <Input 
                             type="number" 
                             placeholder="00" 
                             value={row.qty}
                             onChange={(e) => updateMaterialRow(row.id, { qty: e.target.value })}
                             className={cn("h-16 rounded-2xl border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 font-black italic text-xl tabular-nums focus:ring-primary px-8 shadow-inner", row.isAiSuggested && "border-primary/40 bg-primary/5 ring-2 ring-primary/5")} 
                         />
                         {row.isAiSuggested && <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />}
                       </div>
                     </div>
                     {materialsUsed.length > 1 && (
                       <Button 
                         type="button" 
                         variant="ghost" 
                         className="h-16 w-16 rounded-2xl bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition-all group-hover/row:opacity-100"
                         onClick={() => removeMaterialRow(row.id)}
                       >
                          <Trash2 className="h-6 w-6" />
                       </Button>
                     )}
                 </div>
               ))}
               <Button 
                 type="button" 
                 variant="outline" 
                 className="w-full h-20 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 font-black text-[11px] uppercase tracking-[0.4em] text-slate-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group"
                 onClick={() => addMaterialRow()}
               >
                   <Plus className="h-6 w-6 mr-4 group-hover:rotate-180 transition-transform duration-1000" /> Append Resource Entry
               </Button>
            </div>
          </section>

          {/* SECTION 5 - ISSUES - TACTICAL */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
               <div className="h-12 w-12 bg-slate-950 dark:bg-white rounded-[1.25rem] flex items-center justify-center text-white dark:text-slate-950 shadow-premium">
                  <AlertTriangle className="h-6 w-6" />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">05. Risk & Conflict Matrix</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
               <div className="md:col-span-4 space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Conflict Severity</Label>
                  <Select value={issueSeverity} onValueChange={setIssueSeverity}>
                     <SelectTrigger className={cn(
                        "h-16 rounded-[1.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 font-black italic tracking-tight text-lg shadow-premium-sm",
                        issueSeverity === 'high' ? "text-rose-500" : issueSeverity === 'medium' ? "text-amber-500" : "text-slate-900 dark:text-white"
                     )}>
                        <SelectValue placeholder="Assess impact" />
                     </SelectTrigger>
                     <SelectContent className="rounded-[2rem] p-4">
                        <SelectItem value="none" className="rounded-xl my-1 font-bold">Standard / Nominal</SelectItem>
                        <SelectItem value="low" className="rounded-xl my-1 font-bold text-blue-500">Low Impact Sync</SelectItem>
                        <SelectItem value="medium" className="rounded-xl my-1 font-bold text-amber-500">Medium Priority Risk</SelectItem>
                        <SelectItem value="high" className="rounded-xl my-1 font-bold text-rose-500">Critical Structural Blocker</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="md:col-span-8 space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Observation Intelligence</Label>
                  <Input 
                    placeholder="Elaborate on current site constraints or protocol violations..." 
                    className="h-16 rounded-[1.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold italic text-lg shadow-premium-sm focus:ring-primary/20"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
               </div>
            </div>
          </section>

          {/* SUBMIT - STICKY CINEMATIC */}
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
            <Button 
              type="submit" 
              className="w-full h-24 bg-slate-950 hover:bg-slate-900 text-white text-xl font-black uppercase tracking-[0.4em] shadow-premium-dark rounded-[3rem] group transition-all active:scale-[0.98] border-2 border-white/10 relative overflow-hidden italic"
              disabled={loading || isAiProcessing}
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <div className="flex items-center gap-6 relative z-10">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
                   <span>Syncing Intelligence...</span>
                </div>
              ) : (
                <div className="flex items-center gap-6 relative z-10 transition-transform group-hover:scale-110">
                   Commit Digital DPR <ChevronRight className="h-8 w-8 text-primary group-hover:translate-x-4 transition-transform duration-500" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
