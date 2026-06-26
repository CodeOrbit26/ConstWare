"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  MapPin, 
  User, 
  Activity, 
  Calendar, 
  Plus, 
  FileText, 
  Loader2 
} from "lucide-react"
import { getCurrentUserId } from "@/lib/auth/mockAuth"
import { toast } from "sonner"

export default function SupervisorSitePage() {
  const [siteData, setSiteData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [loggingMaterial, setLoggingMaterial] = React.useState(false)
  const [submittingNote, setSubmittingNote] = React.useState(false)

  // Form states
  const [materialName, setMaterialName] = React.useState("")
  const [materialQty, setMaterialQty] = React.useState("")
  const [materialUnit, setMaterialUnit] = React.useState("Bags")
  const [siteNote, setSiteNote] = React.useState("")

  React.useEffect(() => {
    async function loadSite() {
      try {
        const userId = await getCurrentUserId()
        const siteRes = await fetch("/api/supervisor/site-context", {
          headers: { "x-user-id": userId }
        })
        const siteJson = await siteRes.json()
        setSiteData(siteJson)
      } catch (err) {
        console.error("Failed to load site context", err)
      } finally {
        setLoading(false)
      }
    }
    loadSite()
  }, [])

  const handleLogMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialName || !materialQty) {
      toast.error("Please enter material name and quantity.")
      return
    }

    setLoggingMaterial(true)
    try {
      const userId = await getCurrentUserId()
      const res = await fetch("/api/supervisor/site/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          name: materialName,
          quantity: Number(materialQty),
          unit: materialUnit
        })
      })

      if (res.ok) {
        toast.success("Material usage log successfully added!")
        setMaterialName("")
        setMaterialQty("")
      } else {
        toast.error("Failed to log material usage")
      }
    } catch (err) {
      toast.error("Error logging material")
    } finally {
      setLoggingMaterial(false)
    }
  }

  const handleLogNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!siteNote.trim()) {
      toast.error("Please enter a progress note.")
      return
    }

    setSubmittingNote(true)
    try {
      const userId = await getCurrentUserId()
      const res = await fetch("/api/supervisor/reports/dpr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          notes: siteNote
        })
      })

      if (res.ok) {
        toast.success("Site progress note logged successfully!")
        setSiteNote("")
      } else {
        toast.error("Failed to log site progress note")
      }
    } catch (err) {
      toast.error("Error submitting progress note")
    } finally {
      setSubmittingNote(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Operations: Site Logbook">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const mySite = siteData || {
    id: "site-1",
    name: "Green Valley Residency",
    location: "Sector 62, Noida, UP",
    supervisor: "Supervisor User",
    progress: 65.4,
    status: "active",
    clientName: "Rakesh Singhal",
  }

  return (
    <DashboardLayout title="Operations: Site Logbook">
      <div className="max-w-6xl mx-auto space-y-16 pb-32">
        
        {/* CINEMATIC SITE PROFILE */}
        <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-12 opacity-5">
            <Building2 className="h-44 w-44 text-primary" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/20 text-primary border border-primary/30 uppercase px-4 py-1.5 rounded-full font-black text-[10px] tracking-wider">
                Current Station
              </Badge>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-black uppercase text-white tracking-tighter italic">{mySite.name}</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {mySite.location}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Assigned Client</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> {mySite.clientName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Site Status</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" /> Active Construction
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Mission Progress</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-primary">{mySite.progress}%</span> Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* MATERIAL LOGGING FORM */}
          <div className="bg-white/5 dark:bg-slate-900/60 p-10 rounded-[3rem] border border-white/10 dark:border-slate-800/50 space-y-8 shadow-premium">
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight">Log Material Consumption</h3>
              <p className="text-xs text-slate-400">Record inventory used in today's build process.</p>
            </div>

            <form onSubmit={handleLogMaterial} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Material Name</label>
                <Input 
                  placeholder="e.g. UltraTech Cement, 12mm TMT Steel"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="h-14 bg-slate-50 dark:bg-slate-950 border-none rounded-xl font-bold text-sm shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</label>
                  <Input 
                    type="number"
                    placeholder="e.g. 50"
                    value={materialQty}
                    onChange={(e) => setMaterialQty(e.target.value)}
                    className="h-14 bg-slate-50 dark:bg-slate-950 border-none rounded-xl font-bold text-sm shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit</label>
                  <select 
                    value={materialUnit}
                    onChange={(e) => setMaterialUnit(e.target.value)}
                    className="h-14 w-full px-4 bg-slate-50 dark:bg-slate-950 border-none rounded-xl font-bold text-sm text-slate-400 shadow-inner outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Bags">Bags</option>
                    <option value="Tons">Tons</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Cu.Ft">Cu.Ft</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loggingMaterial}
                className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loggingMaterial ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />} Log Material
              </Button>
            </form>
          </div>

          {/* PROGRESS NOTES LOGGING FORM */}
          <div className="bg-white/5 dark:bg-slate-900/60 p-10 rounded-[3rem] border border-white/10 dark:border-slate-800/50 space-y-8 shadow-premium">
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight">Log Site Progress Note</h3>
              <p className="text-xs text-slate-400">Add qualitative notes regarding today's execution and progress.</p>
            </div>

            <form onSubmit={handleLogNote} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress Notes</label>
                <Textarea 
                  placeholder="Describe structural progress, delays, milestone completions, or inspection notes..."
                  value={siteNote}
                  onChange={(e) => setSiteNote(e.target.value)}
                  className="h-44 bg-slate-50 dark:bg-slate-950 border-none rounded-xl font-bold text-sm shadow-inner resize-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button 
                type="submit" 
                disabled={submittingNote}
                className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                {submittingNote ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5 text-primary" />} Save Note
              </Button>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
