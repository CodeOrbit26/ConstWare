"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Camera, 
  Loader2, 
  UploadCloud, 
  CheckCircle2,
  Trash2
} from "lucide-react"
import { getCurrentUserId } from "@/lib/auth/mockAuth"
import { toast } from "sonner"

export default function SupervisorReportsPage() {
  const [notes, setNotes] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  const handleMockUpload = () => {
    setUploading(true)
    setTimeout(() => {
      // Generate a mock Cloudflare R2 image url
      const mockUrl = `https://r2.constware.co/dpr_${Date.now()}.jpg`
      setImageUrl(mockUrl)
      setUploading(false)
      toast.success("Image successfully uploaded to Cloudflare R2 bucket!")
    }, 1500)
  }

  const handleClearImage = () => {
    setImageUrl("")
    toast.info("Image attachment removed.")
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim()) {
      toast.error("Daily progress narrative cannot be empty.")
      return
    }

    setSubmitting(true)
    try {
      const userId = await getCurrentUserId()
      const res = await fetch("/api/supervisor/reports/dpr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          notes,
          imageUrl: imageUrl || null
        })
      })

      if (res.ok) {
        toast.success("Daily Progress Report successfully compiled & submitted!")
        setNotes("")
        setImageUrl("")
      } else {
        toast.error("Failed to submit report to server")
      }
    } catch (err) {
      toast.error("Error submitting progress report")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="Intelligence: Daily Progress Report">
      <div className="max-w-4xl mx-auto space-y-12 pb-32">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 dark:border-slate-800 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" /> Daily Progress Intelligence
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Compile <br /> <span className="text-primary not-italic">Daily Report</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Submit structural telemetry & site diagnostics to Contractor Portal</p>
           </div>
        </div>

        {/* DPR FORM CONTAINER */}
        <div className="bg-white/5 dark:bg-slate-900/60 p-10 rounded-[3rem] border border-white/10 dark:border-slate-800/50 space-y-10 shadow-premium">
          <form onSubmit={handleSubmitReport} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Structural Summary & Progress Narrative</label>
              <Textarea 
                placeholder="Log daily completed items, milestone deviations, manpower counts, weather conditions, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-60 bg-slate-50 dark:bg-slate-950 border-none rounded-[1.5rem] font-bold text-sm shadow-inner resize-none focus:ring-1 focus:ring-primary p-6"
              />
            </div>

            {/* ATTACHMENT CARD */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Site Telemetry Visuals (R2 Upload)</label>
              
              {imageUrl ? (
                <div className="bg-slate-950 p-6 rounded-[2rem] border border-emerald-500/20 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">Image Attached Successfully</p>
                      <p className="text-[9px] font-mono text-slate-500 mt-0.5 truncate max-w-xs">{imageUrl}</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleClearImage}
                    className="h-12 w-12 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-500/5"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center">
                  <UploadCloud className="h-10 w-10 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Attach progress capture</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">Supports PNG, JPG up to 10MB</p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleMockUpload}
                    disabled={uploading}
                    className="h-12 px-6 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    {uploading ? "Uploading to R2..." : "Simulate R2 Camera Upload"}
                  </Button>
                </div>
              )}
            </div>

            {/* SUBMIT ACTION */}
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-18 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-[0.2em] rounded-[1.75rem] transition-all flex items-center justify-center gap-3 shadow-premium-primary"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Compiling Report...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Submit Daily Progress Report
                </>
              )}
            </Button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  )
}
