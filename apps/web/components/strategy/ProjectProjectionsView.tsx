"use client"

import * as React from "react"
import { 
  Sparkles, 
  ArrowRight, 
  Scale, 
  MapPin, 
  Layers, 
  Home, 
  FileText, 
  Zap,
  Hammer,
  Palette,
  ChevronRight,
  Plus,
  Lock,
  Upload,
  X
} from "lucide-react"
import { BlueprintUploadStep } from "./BlueprintUploadStep"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CITY_MULTIPLIERS } from "@/lib/construction-rates"
import { ExteriorDesignStep } from "./ExteriorDesignStep"
import { InteriorDesignerStep } from "./InteriorDesignerStep"
import { ReportView } from "./ReportView"
import { LoadingStep } from "./LoadingStep"

const ARCHETYPES = [
  "Residential Villa", "Apartment Floor", "Commercial Shop", 
  "Office Building", "Industrial Shed", "Warehouse", 
  "School/College", "Row Houses"
]

// DESIGN SYSTEM CONSTANTS
const inputStyle: React.CSSProperties = {
  height: '52px',
  width: '100%',
  background: '#0D1117',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '0 16px',
  fontSize: '15px',
  color: '#F9FAFB',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit'
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%236B7280' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: '40px'
};

const FieldGroup = ({ number, label, children, fullWidth = false }: { number?: string, label: string, children: React.ReactNode, fullWidth?: boolean }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
    {number && (
      <p style={{
        color: '#F97316', fontSize: '11px', fontWeight: '600',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        margin: '0 0 4px 0'
      }}>
        {number}
      </p>
    )}
    <label style={{
      display: 'block', fontSize: '11px', fontWeight: '500',
      color: '#6B7280', letterSpacing: '0.07em',
      textTransform: 'uppercase', margin: '0 0 8px 0'
    }}>
      {label}
    </label>
    {children}
  </div>
);

const Divider = () => (
  <div style={{
    gridColumn: '1 / -1',
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
    margin: '4px 0'
  }} />
);

export function ProjectProjectionsView() {
  const [loading, setLoading] = React.useState(false)
  const [showReport, setShowReport] = React.useState(false)
  const [reportData, setReportData] = React.useState<any>(null)
  const [activeTab, setActiveTab] = React.useState<'ESTIMATE' | '3D_RENDER' | '3D_VISUALIZER' | 'INTERIOR' | 'BLUEPRINT_UPLOAD'>('ESTIMATE')
  
  const [formData, setFormData] = React.useState({
    projectName: "",
    projectType: "Residential Villa",
    area_sqft: "3500",
    city: "Mumbai",
    floors: "G+1",
    custom_floors: "",
    basement: "no",
    basement_area: "",
    finishingLevel: "Standard",
    soilType: "Normal",
    blueprintImages: [] as string[],
    blueprintSkipped: true
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>) => {
    (e.target as HTMLElement).style.borderColor = '#F97316';
    (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>) => {
    (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
    (e.target as HTMLElement).style.boxShadow = 'none';
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const validateInputs = () => {
    if (!formData.projectName || !formData.area_sqft || !formData.city) {
      toast.error("Architectural data missing. Please define project name, area, and city first.", {
        style: { background: '#7f1d1d', color: 'white', border: 'none' }
      })
      return false
    }
    return true
  }

  const handleTabChange = (tab: any) => {
    if (tab !== 'ESTIMATE' && !validateInputs()) return
    setActiveTab(tab)
  }

    const handleCalculate = async () => {
    setLoading(true)
    try {
      // Build the request body with images
      const payload = {
        ...formData,
        structureType: 'rcc'
      }
      
      const response = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()

      if (!response.ok || data.error) {
         throw new Error(data.error || "Engine malfunction")
      }

      setReportData(data)
      setShowReport(true)
      toast.success("Structural intelligence report generated.")
      
      // Auto-transition to 3D Render with a clear "Synchronizing" toast
      setTimeout(() => {
        toast("Synchronizing 3D Model with AI Estimates...", {
          icon: <Sparkles className="h-4 w-4 text-primary" />,
          duration: 3000
        })
      }, 2000)

      setTimeout(() => {
        setShowReport(false)
        setActiveTab('3D_VISUALIZER')
      }, 5000)
    } catch (err: any) {
      console.error("Calculation Error:", err)
      toast.error(`Structural engine failed: ${err.message || 'Unknown Error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingStep />
  if (showReport && reportData) {
    return <ReportView data={reportData} onBack={() => setShowReport(false)} onSaveToSite={() => toast.success("Saved to Cloud")} />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-20">
      
      {/* MINIMALIST HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Project <span className="text-primary not-italic">Estimator</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-l-2 border-primary pl-3">Precision Estimation Engine</p>
         </div>
         <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800/50 p-1.5 rounded-2xl">
             {['ESTIMATE', '3D_VISUALIZER'].map((tab) => {
               const isActive = activeTab === tab;
               const isVisualizer = tab === '3D_VISUALIZER';
               if (isVisualizer) {
                 return (
                   <div key={tab} className="relative group">
                     <button
                       disabled
                       className="px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-slate-600 cursor-not-allowed opacity-50"
                     >
                       <Sparkles className="h-3 w-3 text-slate-700" />
                       3D Visualizer
                     </button>
                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-950 border border-slate-800 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                       Coming soon
                     </div>
                   </div>
                 )
               }
               return (
                 <button
                   key={tab}
                   onClick={() => handleTabChange('ESTIMATE')}
                   className={cn(
                     "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                     isActive ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                   )}
                 >
                   <Sparkles className={cn("h-3 w-3", isActive ? "text-white" : "text-slate-600")} />
                   Estimate Setup
                 </button>
               )
            })}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN FORM CARD */}
        {activeTab === 'ESTIMATE' && (
          <div className="lg:col-span-12">
            <div style={{
              background: '#0D1117',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '32px',
              margin: '0 0 32px 0'
            }} className="shadow-2xl shadow-black/50">

               <div style={{
                 display: 'grid',
                 gridTemplateColumns: 'repeat(2, 1fr)',
                 gap: '24px 28px',
                 alignItems: 'start'
               }}>

                  {/* ROW 1: Name & Location */}
                  <FieldGroup number="01" label="Project Name">
                    <input
                      type="text"
                      placeholder="e.g. Skyline Residence"
                      value={formData.projectName}
                      onChange={(e) => updateFormData({ projectName: e.target.value })}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </FieldGroup>

                  <FieldGroup number="02" label="City / Region">
                    <select
                      value={formData.city}
                      onChange={(e) => updateFormData({ city: e.target.value })}
                      style={selectStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value="">Select city...</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Lucknow">Lucknow</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Bhind/MP">Bhind / MP</option>
                      <option value="Tier-2 City">Tier-2 City (avg)</option>
                      <option value="Rural Area">Rural Area</option>
                    </select>
                  </FieldGroup>

                  <Divider />

                  {/* ROW 2: Archetype & Area */}
                  <FieldGroup number="03" label="Project Type">
                    <select
                      value={formData.projectType}
                      onChange={(e) => updateFormData({ projectType: e.target.value })}
                      style={selectStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value="Residential Villa">Residential Villa</option>
                      <option value="Apartment Floor">Apartment / Flat</option>
                      <option value="Commercial Shop">Commercial Shop</option>
                      <option value="Office Building">Office Building</option>
                      <option value="Industrial Shed">Industrial Shed</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="School/College">School / College</option>
                      <option value="Hospital/Clinic">Hospital / Clinic</option>
                      <option value="Row Houses">Row Houses</option>
                      <option value="Plotted">Plotted Development</option>
                    </select>
                  </FieldGroup>

                  <FieldGroup number="04" label="Plot Area">
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="e.g. 2500"
                        value={formData.area_sqft}
                        onChange={(e) => updateFormData({ area_sqft: e.target.value })}
                        style={{ ...inputStyle, paddingRight: '72px' }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                      <span style={{
                        position: 'absolute', right: '14px', top: '50%',
                        transform: 'translateY(-50%)', fontSize: '12px',
                        fontWeight: '500', color: '#4B5563',
                        background: '#1A1F2E', padding: '3px 8px',
                        borderRadius: '5px', pointerEvents: 'none'
                      }}>
                        sq ft
                      </span>
                    </div>
                    {formData.area_sqft && (
                      <p style={{ fontSize: '12px', color: '#4B5563', margin: '6px 0 0 0' }}>
                        ≈ {(parseFloat(formData.area_sqft) * 0.0929).toFixed(1)} sq.m 
                        · {(parseFloat(formData.area_sqft) / 272.25).toFixed(2)} Marla
                      </p>
                    )}
                  </FieldGroup>

                  <Divider />

                  {/* ROW 3: Soil & Scale */}
                  <FieldGroup number="05" label="Soil Condition">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', height: '52px' }}>
                      {['Normal', 'Soft', 'Rocky', 'Marsh'].map(soil => (
                        <button
                          key={soil}
                          onClick={() => updateFormData({ soilType: soil })}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          style={{
                            height: '52px', borderRadius: '10px',
                            border: formData.soilType === soil ? '1.5px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                            background: formData.soilType === soil ? '#F97316' : '#0D1117',
                            color: formData.soilType === soil ? '#FFFFFF' : '#6B7280',
                            fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s ease',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {soil}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: '12px', color: '#4B5563', margin: '6px 0 0 0' }}>
                      {formData.soilType === 'Soft' && 'Soft soil requires deeper foundation (+8% cost)'}
                      {formData.soilType === 'Rocky' && 'Rocky soil needs blasting (+12% cost)'}
                      {formData.soilType === 'Marsh' && 'Marsh soil needs pile foundation (+20% cost)'}
                      {formData.soilType === 'Normal' && 'Standard foundation applicable'}
                    </p>
                  </FieldGroup>

                  <FieldGroup number="06" label="Number of Floors">
                    <select
                      value={formData.floors}
                      onChange={(e) => updateFormData({ floors: e.target.value })}
                      style={selectStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value="G">G — Ground only</option>
                      <option value="G+1">G+1 — Ground + 1 floor</option>
                      <option value="G+2">G+2 — Ground + 2 floors</option>
                      <option value="G+3">G+3 — Ground + 3 floors</option>
                      <option value="G+4">G+4 — Ground + 4 floors</option>
                      <option value="G+5">G+5 — Ground + 5 floors</option>
                    </select>
                  </FieldGroup>

                  <Divider />

                  {/* ROW 4: Blueprint Sync (Full Width) */}
                  <FieldGroup label="Architectural Asset Sync" fullWidth={true}>
                    <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 14px 0', lineHeight: '1.5' }}>
                      Attach floor blueprints for reference. One file per floor. Optional.
                    </p>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(formData.floors === 'G' ? 1 : parseInt(formData.floors.replace('G+', '')) + 1, 3)}, 1fr)`,
                      gap: '12px'
                    }}>
                      {Array.from({ length: formData.floors === 'G' ? 1 : parseInt(formData.floors.replace('G+', '')) + 1 }).map((_, index) => {
                        const labels = ["G", "G+1", "G+2", "G+3", "G+4", "G+5"];
                        const hasImg = formData.blueprintImages[index];
                        return (
                          <div
                            key={index}
                            onClick={() => document.getElementById(`bp-${index}`)?.click()}
                            style={{
                              height: '80px',
                              background: hasImg ? '#0D2818' : '#0D1117',
                              border: hasImg ? '1.5px solid #22C55E' : '1px dashed rgba(255,255,255,0.12)',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '0 16px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '8px',
                              background: hasImg ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700',
                              color: hasImg ? '#22C55E' : '#6B7280', flexShrink: 0
                            }}>
                              {labels[index]}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: hasImg ? '#22C55E' : '#9CA3AF' }}>
                                {hasImg ? '✓ Blueprint attached' : 'Attach Blueprint'}
                              </p>
                              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#4B5563' }} className="truncate">
                                {hasImg ? 'Floor asset synchronized' : 'JPG · PNG · PDF'}
                              </p>
                            </div>
                            {hasImg && (
                              <button onClick={(e) => { e.stopPropagation(); const newImgs = [...formData.blueprintImages]; newImgs[index] = ""; updateFormData({ blueprintImages: newImgs }); }} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', color: '#EF4444', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                            )}
                            <input
                              id={`bp-${index}`}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newImgs = [...formData.blueprintImages];
                                  newImgs[index] = reader.result as string;
                                  updateFormData({ blueprintImages: newImgs });
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </FieldGroup>

                  <Divider />

                  {/* ROW 5: Quality Grade (Full Width) */}
                  <FieldGroup number="07" label="Specification Grade" fullWidth={true}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {[
                        { id: 'Standard', label: 'STANDARD', range: '₹1,600 – ₹2,200', desc: 'Good quality materials, standard finishes', color: '#3B82F6' },
                        { id: 'Premium', label: 'PREMIUM', range: '₹2,200 – ₹3,500', desc: 'High-end materials, imported fittings', color: '#8B5CF6' },
                        { id: 'Luxury', label: 'LUXURY', range: '₹3,500+', desc: 'Ultra-premium, no compromises', color: '#F97316' }
                      ].map(grade => (
                        <button
                          key={grade.id}
                          onClick={() => updateFormData({ finishingLevel: grade.id })}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          style={{
                            padding: '18px 16px',
                            borderRadius: '12px',
                            border: formData.finishingLevel === grade.id ? `1.5px solid ${grade.color}` : '1px solid rgba(255,255,255,0.08)',
                            background: formData.finishingLevel === grade.id ? `${grade.color}14` : '#0D1117',
                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative'
                          }}
                        >
                          {formData.finishingLevel === grade.id && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '18px', height: '18px', borderRadius: '50%', background: grade.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>✓</div>
                          )}
                          <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: '700', color: formData.finishingLevel === grade.id ? grade.color : '#6B7280', letterSpacing: '0.08em' }}>{grade.label}</p>
                          <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600', color: '#F9FAFB' }}>{grade.range}<span className="text-[10px] ml-1 text-slate-600">/sqft</span></p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.4' }}>{grade.desc}</p>
                        </button>
                      ))}
                    </div>
                  </FieldGroup>

               </div>

               {/* EXECUTE BUTTON */}
               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                  <Button 
                    onClick={handleCalculate}
                    className="h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-xl shadow-xl shadow-primary/10 transition-all active:scale-95"
                  >
                     Execute Site Projections
                  </Button>
               </div>
            </div>
        </div>
         )}

        {/* PREVIEW PANEL */}
        {activeTab !== 'ESTIMATE' && (
           <div className="lg:col-span-12 transition-all duration-700 animate-in slide-in-from-right-12">
              <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] h-full min-h-[600px] overflow-hidden relative shadow-2xl">
                 {activeTab === '3D_VISUALIZER' && (
                    <ExteriorDesignStep 
                      formData={formData} 
                      updateFormData={updateFormData} 
                      onNext={() => setActiveTab('ESTIMATE')} 
                      onBack={() => setActiveTab('ESTIMATE')} 
                      onCalculate={handleCalculate}
                    />
                 )}
                 
                 <button 
                   onClick={() => setActiveTab('ESTIMATE')}
                   className="absolute top-8 left-8 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all"
                 >
                    <ArrowRight className="h-3 w-3 rotate-180" /> Back to Inputs
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* QUICK STATS FOOTER */}
      <div className="flex flex-wrap gap-4 pt-4">
         {[
           { label: "Market Volatility", value: "High (2.4%)", color: "text-orange-500" },
           { label: "Material Load", value: "Optimized", color: "text-emerald-500" },
           { label: "Engine Status", value: "Synchronized", color: "text-primary" }
         ].map((stat, i) => (
           <div key={i} className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", stat.color.replace('text-', 'bg-'))} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}: <span className={cn("text-white ml-1", stat.color)}>{stat.value}</span></p>
           </div>
         ))}
      </div>
    </div>
  )
}
