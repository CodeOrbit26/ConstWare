"use client"

import * as React from "react"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/shared/DataTable"
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
  Sparkles
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

const mockDocuments: SiteDocument[] = [
  { id: "d1", name: "Green Valley Phase 1 NOC", type: "NOC", siteName: "Green Valley", dateAdded: "2024-04-01", status: "Verified", fileSize: "2.4 MB", uploadedBy: "Rohan S." },
  { id: "d2", name: "Skyline Towers Structural Blueprint", type: "Blueprint", siteName: "Skyline Towers", dateAdded: "2024-03-28", status: "Verified", fileSize: "15.8 MB", uploadedBy: "Arjun K." },
  { id: "d3", name: "Raw Material Purchase Agreement", type: "Contract", siteName: "Global", dateAdded: "2024-04-10", status: "Pending", fileSize: "4.1 MB", uploadedBy: "Aman V." },
  { id: "d4", name: "Labour Insurance Policy Q2", type: "Permit", siteName: "All Sites", dateAdded: "2024-01-15", status: "Expired", fileSize: "1.2 MB", uploadedBy: "System" },
]

export function DocumentsView() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const columns: Column<SiteDocument>[] = [
    {
      header: "Document Identity",
      cell: (row) => (
        <div className="flex items-center gap-4 py-1">
          <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-navy dark:text-white group-hover:text-primary transition-colors">{row.name}</span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{row.fileSize} • {row.uploadedBy}</span>
          </div>
        </div>
      )
    },
    {
      header: "Registry",
      cell: (row) => (
         <Badge variant="secondary" className="bg-slate-100/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 font-bold text-[9px] uppercase tracking-widest px-3 py-1">
            {row.siteName}
         </Badge>
      )
    },
    {
       header: "Category",
       cell: (row) => (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.type}</span>
       )
    },
    {
      header: "Operational Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
           <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              row.status === 'Verified' ? "bg-success" : row.status === 'Pending' ? "bg-warning" : "bg-danger"
           )} />
           <span className={cn(
             "text-[10px] font-black uppercase tracking-widest",
             row.status === 'Verified' ? "text-success" : row.status === 'Pending' ? "text-warning" : "text-danger"
           )}>
             {row.status}
           </span>
        </div>
      )
    },
    {
      header: "Governance",
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors"><Download className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-danger transition-colors"><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ]

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
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Vault <span className="text-primary not-italic">Integrity</span></h2>
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
         <StatCard title="Active Protocol Docs" value={mockDocuments.length} icon={FileText} premium />
         <StatCard title="Awaiting Verification" value="1" icon={Clock} iconClassName="text-warning" premium />
         <StatCard title="Compliance Score" value="98%" icon={ShieldCheck} iconClassName="text-success" premium />
         <StatCard title="Storage Utilization" value="24.5 GB" icon={Building2} premium />
      </div>

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

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border shadow-premium overflow-hidden p-2">
         <DataTable data={mockDocuments} columns={columns} keyExtractor={(d) => d.id} />
      </div>
    </div>
  )
}
