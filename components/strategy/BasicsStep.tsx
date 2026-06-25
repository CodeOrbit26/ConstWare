"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Layers, 
  MapPin, 
  Home, 
  ArrowRight,
  TowerControl as Tower,
  ChevronRight,
  Scale,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CITY_MULTIPLIERS } from "@/lib/construction-rates"
import { convertSqft, calculateFAR } from "@/lib/utils/calculations"

const ARCHETYPES = [
  "Residential Villa", "Apartment Floor", "Commercial Shop", 
  "Office Building", "Industrial Shed", "Warehouse", 
  "School/College", "Hospital", "Row Houses", "Plotted Development"
]

const STRUCTURE_TYPES = [
  { id: "rcc", icon: "🏗️", label: "RCC Framed", desc: "Columns & Beams" },
  { id: "load", icon: "🧱", label: "Load Bearing", desc: "Wall priority" },
  { id: "steel", icon: "⚙️", label: "Steel Structure", desc: "Prefab/I-Beams" },
  { id: "composite", icon: "🔗", label: "Composite", desc: "Hybrid system" }
]

const FLOORS_OPTIONS = ["G", "G+1", "G+2", "G+3", "G+4", "G+5", "Custom"]

interface BasicsStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
}

export function BasicsStep({ formData, updateFormData, onNext }: BasicsStepProps) {
  const conversions = convertSqft(Number(formData.area_sqft))
  const far = calculateFAR(Number(formData.area_sqft), Number(formData.plot_area))

  return (
    <div className="max-w-xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="space-y-10">
        {/* ROW 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Home className="h-4 w-4 text-primary" />
             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Project Archetype</Label>
          </div>
          <Select 
            value={formData.projectType} 
            onValueChange={(v) => updateFormData({ projectType: v })}
          >
            <SelectTrigger className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-navy dark:text-white font-bold px-6 shadow-sm">
              <SelectValue placeholder="Select Archetype" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-navy dark:text-white">
              {ARCHETYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Layers className="h-4 w-4 text-primary" />
             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Operational Area (Sq.Ft)</Label>
          </div>
          <div className="relative group">
            <Input 
              type="number" 
              placeholder="e.g. 2500" 
              value={formData.area_sqft} 
              onChange={(e) => updateFormData({ area_sqft: e.target.value })}
              className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-navy dark:text-white font-black px-6 text-lg focus-visible:ring-primary/20 shadow-sm" 
            />
          </div>
          {formData.area_sqft && (
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic px-2">
               {conversions.sqm} sqm • {conversions.marla} Marla • {conversions.bigha} Bigha
            </p>
          )}
        </div>

        {/* ROW 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <MapPin className="h-4 w-4 text-primary" />
             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Regional Cluster</Label>
          </div>
          <Select 
            value={formData.city} 
            onValueChange={(v) => updateFormData({ city: v })}
          >
            <SelectTrigger className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-navy dark:text-white font-bold px-6 shadow-sm">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-navy dark:text-white max-h-60">
              {Object.keys(CITY_MULTIPLIERS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Tower className="h-4 w-4 text-primary" />
             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Vertical Height (Floors)</Label>
          </div>
          <div className="flex flex-wrap gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            {FLOORS_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => updateFormData({ floors: opt })}
                className={cn(
                  "flex-1 min-w-[60px] py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                  formData.floors === opt 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-slate-500 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {formData.floors === 'Custom' && (
            <Input 
              type="number" 
              placeholder="Total Floors" 
              value={formData.custom_floors || ''} 
              onChange={(e) => updateFormData({ custom_floors: e.target.value })}
              className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-navy dark:text-white font-black px-6 mt-2 shadow-sm"
            />
          )}
        </div>

        {/* ROW 3 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <ArrowRight className="h-4 w-4 text-primary" />
             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Plot Dimension (Sq.Ft)</Label>
          </div>
          <Input 
            type="number" 
            placeholder="Total Plot Area" 
            value={formData.plot_area} 
            onChange={(e) => updateFormData({ plot_area: e.target.value })}
            className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-navy dark:text-white font-black px-6 shadow-sm" 
          />
          {formData.area_sqft && formData.plot_area && (
             <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest italic px-2">
               FAR Index: {far} • Intelligence Calibrated
             </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Scale className="h-4 w-4 text-primary" />
             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Sub-surface Basement</Label>
          </div>
          <div className="flex gap-3 h-14 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
             <button
               onClick={() => updateFormData({ basement: 'yes' })}
               className={cn(
                 "flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 formData.basement === 'yes' ? "bg-navy text-white shadow-lg" : "text-slate-500"
               )}
             >
               Required
             </button>
             <button
               onClick={() => updateFormData({ basement: 'no' })}
               className={cn(
                 "flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 formData.basement === 'no' ? "bg-navy text-white shadow-lg" : "text-slate-500"
               )}
             >
               Not Required
             </button>
          </div>
          {formData.basement === 'yes' && (
            <Input 
              type="number" 
              placeholder="Basement Area (Sq.Ft)" 
              value={formData.basement_area || ''} 
              onChange={(e) => updateFormData({ basement_area: e.target.value })}
              className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-navy dark:text-white font-black px-6 mt-2 shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Structure Type is now determined autonomously by ConstWare AI */}

      <div className="flex justify-end pt-8">
        <Button 
          onClick={onNext}
          className="h-12 px-8 bg-primary hover:bg-orange-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2"
        >
          Next Phase <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
