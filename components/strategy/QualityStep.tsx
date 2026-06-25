"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Clock,
  PiggyBank
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SPECIAL_FEATURES } from "@/lib/construction-rates"
import { formatINR } from "@/lib/utils/calculations"

const FLOORING_OPTIONS = ["Vitrified Tiles", "Marble", "Granite", "Wooden Flooring", "Ceramic Tiles", "Kota Stone", "Epoxy", "Basic Cement"]
const WALL_FINISHES = ["Internal Plaster + Paint", "Texture Paint", "Wallpaper", "Decorative Panels", "Stone Cladding"]
const CEILING_TYPES = ["Simple POP", "False Ceiling Gypsum", "False Ceiling PVC", "Wooden Ceiling", "Basic Whitewash"]

const GRADES = [
  { id: "economy", label: "ECONOMY", price: "₹1200-1600/sqft", desc: "Basic quality finishes" },
  { id: "standard", label: "STANDARD", price: "₹1600-2200/sqft", desc: "Good quality mid-range" },
  { id: "premium", label: "PREMIUM", price: "₹2200-3500/sqft", desc: "High-end imported units" },
  { id: "luxury", label: "LUXURY", price: "₹3500+/sqft", desc: "Ultra premium materials" }
]

const TIMELINES = [
  { id: "fast", label: "Fast Track", sub: "20% premium", icon: <Zap className="h-3.5 w-3.5" /> },
  { id: "normal", label: "Normal Schedule", sub: "Standard delivery", icon: <Clock className="h-3.5 w-3.5" /> },
  { id: "economy", label: "Economy Pace", sub: "15% saving", icon: <PiggyBank className="h-3.5 w-3.5" /> }
]

interface QualityStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function QualityStep({ formData, updateFormData, onNext, onBack }: QualityStepProps) {
  const toggleFeature = (id: string, cost: number) => {
    const current = formData.features || []
    const exists = current.find((f: any) => f.id === id)
    
    if (exists) {
      updateFormData({ features: current.filter((f: any) => f.id !== id) })
    } else {
      updateFormData({ features: [...current, { id, cost }] })
    }
  }

  const featuresTotal = (formData.features || []).reduce((acc: number, f: any) => acc + f.cost, 0)

  const toggleArrayItem = (field: string, item: string) => {
     const current = formData[field] || []
     if (current.includes(item)) {
       updateFormData({ [field]: current.filter((i: string) => i !== item) })
     } else {
       updateFormData({ [field]: [...current, item] })
     }
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">02</div>
           <h3 className="text-xl font-black text-white uppercase tracking-wider italic">Quality Assessment</h3>
        </div>

        {/* GRADES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GRADES.map(grade => (
            <button
              key={grade.id}
              onClick={() => updateFormData({ grade: grade.id })}
              className={cn(
                "relative p-6 rounded-[2rem] border-2 text-left transition-all group overflow-hidden",
                formData.grade === grade.id 
                  ? "border-primary bg-primary/5 shadow-lg" 
                  : "border-slate-800 bg-[#111827] hover:border-slate-700"
              )}
            >
              {formData.grade === grade.id && (
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                   <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={cn("text-[10px] font-black tracking-[0.2em] mb-4", formData.grade === grade.id ? "text-primary" : "text-slate-500")}>
                {grade.label}
              </div>
              <div className="text-lg font-black text-white leading-none">{grade.price}</div>
              <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">{grade.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CHIPS SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Flooring Type</Label>
          <div className="flex flex-wrap gap-2">
            {FLOORING_OPTIONS.map(item => (
              <button
                key={item}
                onClick={() => toggleArrayItem('flooring', item)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all",
                  formData.flooring?.includes(item)
                    ? "bg-white text-navy border-white"
                    : "border-slate-800 text-slate-500 hover:border-slate-600"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Wall Finish</Label>
          <div className="flex flex-wrap gap-2">
            {WALL_FINISHES.map(item => (
              <button
                key={item}
                onClick={() => toggleArrayItem('wallFinish', item)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all",
                  formData.wallFinish?.includes(item)
                    ? "bg-white text-navy border-white"
                    : "border-slate-800 text-slate-500 hover:border-slate-600"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Ceiling Type</Label>
          <div className="flex flex-wrap gap-2">
            {CEILING_TYPES.map(item => (
              <button
                key={item}
                onClick={() => toggleArrayItem('ceiling', item)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all",
                  formData.ceiling?.includes(item)
                    ? "bg-white text-navy border-white"
                    : "border-slate-800 text-slate-500 hover:border-slate-600"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SPECIAL FEATURES */}
      <div className="space-y-6">
        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Special Technical Features</Label>
        <div className="bg-[#111827] border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
             {SPECIAL_FEATURES.map((feature) => (
               <div key={feature.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-white uppercase tracking-wide">{feature.label}</p>
                    <p className="text-[10px] font-black text-primary italic">+{formatINR(feature.cost)}</p>
                  </div>
                  <Switch 
                    checked={formData.features?.some((f: any) => f.id === feature.id)} 
                    onCheckedChange={() => toggleFeature(feature.id, feature.cost)}
                  />
               </div>
             ))}
          </div>
          <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Add-on Provisions</span>
             <span className="text-sm font-black text-primary uppercase tracking-widest">
               Selected Add-ons: {formatINR(featuresTotal)}
             </span>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="space-y-6">
        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Timeline Preference</Label>
        <div className="flex flex-col sm:flex-row gap-4">
           {TIMELINES.map(t => (
             <button
               key={t.id}
               onClick={() => updateFormData({ timeline: t.id })}
               className={cn(
                 "flex-1 p-6 rounded-2xl border-2 flex items-center justify-between transition-all",
                 formData.timeline === t.id ? "border-white bg-white text-navy" : "border-slate-800 bg-[#111827] text-slate-400"
               )}
             >
                <div className="flex items-center gap-4">
                   <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", formData.timeline === t.id ? "bg-navy text-white border-navy" : "border-slate-700 bg-slate-800")}>
                      {t.icon}
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest">{t.label}</p>
                      <p className={cn("text-[9px] font-bold uppercase mt-0.5", formData.timeline === t.id ? "text-navy/60" : "text-slate-500")}>{t.sub}</p>
                   </div>
                </div>
                <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center", formData.timeline === t.id ? "border-navy" : "border-slate-700")}>
                   {formData.timeline === t.id && <div className="h-2.5 w-2.5 rounded-full bg-navy animate-in zoom-in-50" />}
                </div>
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-10">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="h-14 px-8 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest gap-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Basics
        </Button>
        <Button 
          onClick={onNext}
          className="h-16 px-12 bg-white text-navy hover:bg-white/90 rounded-2xl font-black uppercase text-xs tracking-[0.2em] gap-4"
        >
          Next: Add Blueprint <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
