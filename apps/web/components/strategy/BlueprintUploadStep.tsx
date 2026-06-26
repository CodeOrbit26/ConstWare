"use client"

import * as React from "react"
import { Upload, Plus, X, CheckCircle2, ArrowRight, SkipForward, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BlueprintUploadStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onSkip: () => void
}

export function BlueprintUploadStep({ formData, updateFormData, onNext, onSkip }: BlueprintUploadStepProps) {
  const [images, setImages] = React.useState<string[]>(formData.blueprintImages || [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const newImages = [...images]
      newImages[index] = reader.result as string
      setImages(newImages)
      updateFormData({ blueprintImages: newImages })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages[index] = ""
    setImages(newImages)
    updateFormData({ blueprintImages: newImages })
  }

  // Calculate exact floor count from formData
  const getFloorCount = () => {
    if (formData.floors === 'G') return 1;
    if (formData.floors.startsWith('G+')) return parseInt(formData.floors.split('+')[1]) + 1;
    return 1;
  }
  const floorCount = getFloorCount();
  const floorLabels = ["G", "G+1", "G+2", "G+3", "G+4", "G+5", "G+6"]

  const allUploaded = images.filter(img => img && img.length > 0).length >= floorCount;

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white animate-in fade-in duration-700">
      
      {/* PROFESSIONAL HEADER */}
      <div className="p-8 border-b border-slate-800/50 bg-slate-900/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="space-y-1">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
               ARCHITECTURAL <span className="text-primary not-italic">ASSET INTAKE</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Floor-Wise Blueprint Synchronization Node</p>
         </div>
         <Button 
            variant="outline" 
            onClick={onSkip}
            className="h-12 px-6 rounded-xl border-slate-800 bg-slate-900/50 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-slate-800 text-slate-400"
         >
            Skip & Predict <SkipForward className="h-3 w-3" />
         </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
         <div className="max-w-4xl mx-auto space-y-4">
            {Array.from({ length: floorCount }).map((_, i) => {
               const hasImage = images[i] && images[i].length > 0;
               
               return (
                  <div key={i} className={cn(
                    "group flex flex-col md:flex-row items-center gap-8 p-6 rounded-[2rem] border transition-all",
                    hasImage ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-900/10 border-slate-800/50 hover:bg-slate-900/30 hover:border-slate-700"
                  )}>
                     {/* FLOOR LABEL */}
                     <div className="flex items-center gap-6 w-full md:w-48 shrink-0">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black italic transition-all",
                          hasImage ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-400"
                        )}>
                           {floorLabels[i]}
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Floor Identifier</p>
                           <p className="text-sm font-bold text-white uppercase italic">{i === 0 ? "Ground Level" : `Level ${i.toString().padStart(2, '0')}`}</p>
                        </div>
                     </div>

                     {/* UPLOAD AREA — DIRECTLY TO THE RIGHT */}
                     <div className="flex-1 w-full relative">
                        <div 
                          onClick={() => !hasImage && document.getElementById(`bp-${i}`)?.click()}
                          className={cn(
                            "flex items-center justify-between p-2 pl-6 h-20 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                            hasImage ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-950/40 hover:border-primary/50"
                          )}
                        >
                           {hasImage ? (
                              <>
                                 <div className="flex items-center gap-4">
                                    <div className="h-12 w-16 rounded-lg overflow-hidden border border-emerald-500/30">
                                       <img src={images[i]} className="w-full h-full object-cover" alt={floorLabels[i]} />
                                    </div>
                                    <div className="space-y-0.5">
                                       <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Drawing Secure</p>
                                       <p className="text-xs font-bold text-white uppercase truncate max-w-[200px]">blueprint_asset_v2.dwg</p>
                                    </div>
                                 </div>
                                 <Button 
                                   onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                   variant="ghost"
                                   className="h-10 w-10 p-0 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all text-slate-500"
                                 >
                                    <X className="h-4 w-4" />
                                 </Button>
                              </>
                           ) : (
                              <>
                                 <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary">
                                       <Upload className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Attach Architectural Asset</p>
                                 </div>
                                 <div className="flex gap-2 pr-4">
                                    <span className="text-[8px] font-black text-slate-600 uppercase border border-slate-800 px-2 py-1 rounded-md">CAD</span>
                                    <span className="text-[8px] font-black text-slate-600 uppercase border border-slate-800 px-2 py-1 rounded-md">PDF</span>
                                 </div>
                              </>
                           )}
                        </div>
                        <input id={`bp-${i}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, i)} />
                     </div>
                  </div>
               )
            })}
         </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="p-8 border-t border-slate-800/50 bg-slate-950 flex justify-between items-center bg-slate-900/10">
         <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet Synchronization</p>
            <p className="text-xs font-bold text-white uppercase italic">{images.filter(img => img).length} of {floorCount} Assets Linked</p>
         </div>
         
         <Button 
            disabled={!allUploaded}
            onClick={onNext}
            className="h-16 px-12 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-[0.3em] gap-4 shadow-[0_20px_50px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 transition-all"
         >
            {allUploaded ? "Initiate Final Estimate →" : `Link ${floorCount - images.filter(img => img).length} more floors`}
         </Button>
      </div>
    </div>
  )
}
