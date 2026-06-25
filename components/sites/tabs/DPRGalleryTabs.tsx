"use client"

import * as React from "react"
import { mockDPRs } from "@/lib/services/mockData"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, FileText, Camera, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export function DPRTab({ siteId }: { siteId: string }) {
  const dprs = mockDPRs.filter(d => d.siteId === siteId)
  const days = Array.from({ length: 30 }, (_, i) => i + 1) // Mock current month 30 days

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-1 bg-card rounded-card border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> Reporting History
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {["M", "T", "W", "T", "F", "S", "S"].map(day => (
              <div key={day} className="text-[10px] font-bold text-center text-slate-400">{day}</div>
            ))}
            {days.map(day => {
              const hasDPR = dprs.find(d => parseInt(d.date.split('-')[2]) === day)
              return (
                <div 
                  key={day} 
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-[10px] font-medium border transition-all cursor-pointer",
                    hasDPR?.submitted ? "bg-success border-success text-white" : 
                    hasDPR ? "bg-danger border-danger text-white" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-primary/50"
                  )}
                >
                  {day}
                </div>
              )
            })}
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <div className="h-2 w-2 rounded-full bg-success" /> Submitted
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <div className="h-2 w-2 rounded-full bg-danger" /> Missing
            </div>
          </div>
        </div>

        {/* DPR List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Reports</h3>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">New DPR</Button>
          </div>
          {dprs.map(dpr => (
            <div key={dpr.id} className="p-4 rounded-card border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy dark:text-white">{dpr.date}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{dpr.summary}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Camera className="h-3.5 w-3.5" /> {dpr.photos?.length || 0} Photos
                </div>
                <Badge variant={dpr.submitted ? "success" : "danger"}>
                  {dpr.submitted ? "Submitted" : "Missing"}
                </Badge>
                <Button variant="ghost" size="sm" className="text-xs text-primary">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GalleryTab() {
  const photos = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    url: `/api/placeholder/400/300`, // Placeholder
    date: '2026-04-10'
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Camera className="h-4 w-4" /> Site Photos
        </h3>
        <Button variant="outline" size="sm" className="text-xs">
          <Filter className="h-3.5 w-3.5 mr-1" /> All Dates
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="group relative aspect-square rounded-card overflow-hidden border bg-slate-100 cursor-pointer">
            <img 
              src={photo.url} 
              alt="Site progress" 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold uppercase">{photo.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
