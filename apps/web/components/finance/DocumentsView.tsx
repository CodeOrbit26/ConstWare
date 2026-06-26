"use client"

import * as React from "react"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Trash2,
  MoreVertical,
  Building2,
  ShieldCheck,
  FileSearch,
  Sparkles,
  FolderOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SiteDocument {
  id: string
  name: string
  type: 'Contract' | 'Blueprint' | 'Invoice' | 'Permit' | 'NOC'
  siteName: string
  dateAdded: string
  status: 'Verified' | 'Pending' | 'Expired'
  fileSize: string
  uploadedBy: string
}

// Empty — documents will come from database once connected
const documents: SiteDocument[] = []

export function DocumentsView() {
  const [searchTerm, setSearchTerm] = React.useState("")

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER - CINEMATIC */}
      <div className="p-12 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden group shadow-premium mb-8">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
            <Sparkles className="h-32 w-32 text-primary" />
         </div>
         <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-primary/20 blur-3xl rounded-full" />
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                     <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Vault{" "}<span className="text-primary not-italic">Integrity</span></h2>
               </div>
               <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                  Military-grade document encryption and site protocol registry. Ensure all permits, blueprints, and contracts are synchronized and audit-ready.
               </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
               <Button className="h-16 px-10 bg-white text-slate-950 hover:bg-slate-100 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3">
                  <Upload className="h-5 w-5" /> Deploy Document
               </Button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Active Protocol Docs" value={documents.length} icon={FileText} premium />
         <StatCard title="Awaiting Verification" value={documents.filter(d => d.status === 'Pending').length} icon={Clock} iconClassName="text-warning" premium />
         <StatCard title="Compliance Score" value={documents.length > 0 ? `${Math.round(documents.filter(d => d.status === 'Verified').length / documents.length * 100)}%` : "—"} icon={ShieldCheck} iconClassName="text-success" premium />
         <StatCard title="Storage Utilization" value={documents.length > 0 ? "Calculating..." : "0 B"} icon={Building2} premium />
      </div>

      {documents.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm">
             <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                   placeholder="Search registry by SID or name..." 
                   className="h-12 w-full pl-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold text-xs uppercase tracking-widest placeholder:text-slate-400"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-4">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-100 dark:border-slate-800 font-bold text-[10px] uppercase tracking-widest gap-2">
                   <Filter className="h-4 w-4" /> Refine
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-100 dark:border-slate-800 font-bold text-[10px] uppercase tracking-widest gap-2">
                   <Download className="h-4 w-4" /> Export Ledger
                </Button>
             </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <FolderOpen className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Documents Uploaded</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              Upload your first document to initialize the vault. All permits, blueprints, contracts, and NOCs will be tracked here.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
