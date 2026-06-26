"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { mockDPRs, mockSites } from "@/lib/services/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Camera,
  Package,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DPRDetailView() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.id as string
  const report = mockDPRs.find(d => d.id === reportId)
  const site = mockSites.find(s => s.id === report?.siteId)

  if (!report) {
    return (
      <DashboardLayout title="Report Not Found">
        <div className="flex flex-col items-center justify-center h-full py-20">
           <h2 className="text-xl font-bold mb-4">Daily Report not found</h2>
           <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`DPR - ${report.date}`}>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
           <div className="space-y-4">
              <Button variant="ghost" className="h-8 px-0 text-slate-500 hover:text-navy group" onClick={() => router.back()}>
                 <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                 Back to History
              </Button>
              <div className="space-y-1">
                 <h1 className="text-4xl font-black text-navy dark:text-white uppercase tracking-tight">Daily Progress Report</h1>
                 <div className="flex items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {report.date}</span>
                    <span className="flex items-center gap-1 font-black text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Site: {site?.name}</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="h-10 px-6 font-bold shadow-sm">
                 <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
              <Button className="h-10 px-6 font-bold bg-navy hover:bg-navy/90 text-white shadow-lg shadow-navy/20">
                 <Share2 className="h-4 w-4 mr-2" /> Share with Client
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* Submission Meta */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                 <span className="text-slate-500">Submitted By: <span className="text-navy dark:text-white">{report.submittedBy}</span></span>
                 <span className="text-slate-500">Recorded At: <span className="text-navy dark:text-white">{report.submittedAt}</span></span>
              </div>

              {/* Work Done */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 className="h-5 w-5 text-success" /> Work Completed
                    </h2>
                    <div className="flex gap-2">
                       {report.workDoneTags?.map(tag => (
                         <Badge key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-600 border-none font-bold text-[9px] uppercase">{tag}</Badge>
                       ))}
                    </div>
                 </div>
                 <div className="p-6 rounded-card border bg-card shadow-sm">
                    <p className="text-sm leading-relaxed text-slate-600 font-medium">{report.summary}</p>
                 </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                 <h2 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 border-b pb-2">
                    <Camera className="h-5 w-5 text-primary" /> Site Evidence
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.photos?.map((photo, i) => (
                      <div key={i} className="group relative rounded-card overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow">
                         <div className="aspect-video relative overflow-hidden">
                            <img src={photo.url} alt={photo.caption} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                         </div>
                         {photo.caption && (
                           <div className="p-3 bg-white dark:bg-slate-900 border-t">
                              <p className="text-[10px] font-bold text-slate-500 uppercase line-clamp-1">{photo.caption}</p>
                           </div>
                         )}
                      </div>
                    ))}
                    {(!report.photos || report.photos.length === 0) && (
                      <div className="md:col-span-2 py-12 border-2 border-dashed rounded-card flex flex-col items-center justify-center text-slate-400">
                         <Camera className="h-12 w-12 mb-4 opacity-20" />
                         <p className="text-xs font-bold uppercase tracking-widest">No photos provided in this report.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              {/* Attendance Sidecard */}
              <div className="p-6 rounded-card border bg-white dark:bg-slate-900 shadow-sm space-y-6">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-4 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Attendance Summary
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-success/5 border border-success/10 text-center">
                       <p className="text-[9px] font-bold text-success uppercase tracking-widest mb-1">Present</p>
                       <p className="text-xl font-black text-success">{report.attendance?.present}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-danger/5 border border-danger/10 text-center">
                       <p className="text-[9px] font-bold text-danger uppercase tracking-widest mb-1">Absent</p>
                       <p className="text-xl font-black text-danger">{report.attendance?.absent}</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase">Total Capacity:</span>
                    <span className="text-navy dark:text-white uppercase">{report.attendance?.total} Workers</span>
                 </div>
              </div>

              {/* Materials Sidecard */}
              <div className="p-6 rounded-card border bg-white dark:bg-slate-900 shadow-sm space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Material Usage
                 </h3>
                 <div className="space-y-4">
                    {report.materialsUsed?.map(m => (
                      <div key={m.materialId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                         <span className="text-[10px] font-black uppercase text-navy dark:text-white">{m.name}</span>
                         <Badge variant="secondary" className="h-6 px-3 text-[10px] font-black">{m.quantity} {m.unit}</Badge>
                      </div>
                    ))}
                    {(!report.materialsUsed || report.materialsUsed.length === 0) && (
                      <p className="text-[10px] text-slate-400 font-medium italic">No material logs for today.</p>
                    )}
                 </div>
              </div>

              {/* Issues Sidecard */}
              <div className={cn(
                "p-6 rounded-card border shadow-xl shadow-navy/10 space-y-4",
                report.issues?.severity === 'none' ? "bg-navy text-white" : "bg-danger text-white border-none"
              )}>
                 <div className="flex items-center gap-3">
                    {report.issues?.severity === 'none' ? <Clock className="h-5 w-5 text-primary" /> : <AlertTriangle className="h-5 w-5" />}
                    <h3 className="text-sm font-black uppercase tracking-widest">
                       {report.issues?.severity === 'none' ? "Next Phase" : "Blocker Alert"}
                    </h3>
                 </div>
                 {report.issues?.severity === 'none' ? (
                   <p className="text-xs text-slate-300 italic leading-relaxed">{report.tomorrowPlan}</p>
                 ) : (
                   <div className="space-y-3">
                      <p className="text-xs text-red-100 font-medium leading-relaxed">{report.issues?.description}</p>
                      <Badge className="bg-white/20 text-white border-white/30 uppercase text-[9px] font-black">
                         Severity: {report.issues?.severity}
                      </Badge>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
