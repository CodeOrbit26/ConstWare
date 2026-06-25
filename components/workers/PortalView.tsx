"use client"

import * as React from "react"
import { Search, Shield, ShieldOff, Printer, Download, CreditCard, X, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockWorkers, mockSites } from "@/lib/services/mockData"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function PortalView() {
  const [search, setSearch] = React.useState("")
  const [siteFilter, setSiteFilter] = React.useState("all")
  
  const [accessMap, setAccessMap] = React.useState<Record<string, boolean>>(
    Object.fromEntries(mockWorkers.map(w => [w.id, w.kycVerified]))
  )

  const [idCardWorker, setIdCardWorker] = React.useState<string | null>(null)

  const filteredWorkers = mockWorkers.filter(w => {
    const s = search.toLowerCase()
    const matchesSearch = w.name.toLowerCase().includes(s) || (w.aadhaarNumber && w.aadhaarNumber.includes(s))
    const matchesSite = siteFilter === "all" || w.assignedSiteId === siteFilter
    return matchesSearch && matchesSite
  })

  const toggleAccess = (workerId: string) => {
    setAccessMap(prev => {
      const next = !prev[workerId]
      toast.success(next ? "Portal access granted." : "Portal access revoked.", {
         description: "The worker will be notified via SMS."
      })
      return { ...prev, [workerId]: next }
    })
  }

  const getSiteName = (id: string) => mockSites.find(s => s.id === id)?.name || "Unknown Site"

  const targetWorker = idCardWorker ? mockWorkers.find(w => w.id === idCardWorker) : null

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* HEADER / CONTROLS */}
      <div className="p-5 bg-[#111827] rounded-[1.25rem] border border-white/5 shadow-premium mt-4">
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input
               placeholder="Search by name or Aadhaar..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-11 bg-[#0A0F1E] border-none h-12 rounded-xl text-slate-200 placeholder:text-slate-500 font-medium w-full"
             />
           </div>
           
           <Select value={siteFilter} onValueChange={setSiteFilter}>
             <SelectTrigger className="w-full sm:w-[200px] h-12 bg-[#0A0F1E] border-none rounded-xl text-sm font-medium text-slate-300">
               <SelectValue placeholder="All Sites" />
             </SelectTrigger>
             <SelectContent className="bg-[#111827] border-slate-800 text-slate-200">
               <SelectItem value="all">All Sites</SelectItem>
               {mockSites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
             </SelectContent>
           </Select>
        </div>
      </div>

      {/* ACCESS LIST / TABLE */}
      <div className="space-y-4">
        {/* Mobile View: Beautiful native card stack */}
        <div className="flex flex-col gap-3 md:hidden">
           {filteredWorkers.map(worker => {
              const hasAccess = accessMap[worker.id]
              return (
                <div key={worker.id} className="bg-[#111827] rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
                   {/* Top line: Name & Switch */}
                   <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col truncate">
                         <span className="font-extrabold text-sm text-white truncate">{worker.name}</span>
                         <span className="text-[11px] font-medium text-[#F97316] uppercase tracking-wider">{worker.skill}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                         <span className="text-[10px] font-bold text-slate-500">Access</span>
                         <button 
                           onClick={() => toggleAccess(worker.id)}
                           className={cn("relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none",
                              hasAccess ? "bg-[#22C55E]" : "bg-slate-800"
                           )}
                         >
                           <span className="sr-only">Toggle access</span>
                           <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                              hasAccess ? "translate-x-6" : "translate-x-1"
                           )} />
                         </button>
                      </div>
                   </div>

                   {/* Middle line: Info details */}
                   <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-xs">
                      <div className="flex flex-col truncate">
                         <span className="text-[9px] font-bold text-slate-500 uppercase">Aadhaar / ID</span>
                         <span className="font-mono font-medium text-slate-300 truncate">
                           {worker.aadhaarNumber ? `...${worker.aadhaarNumber.slice(-4)}` : "N/A"}
                         </span>
                      </div>
                      <div className="flex flex-col truncate">
                         <span className="text-[9px] font-bold text-slate-500 uppercase">Assigned Site</span>
                         <span className="font-medium text-slate-300 truncate">{getSiteName(worker.assignedSiteId)}</span>
                      </div>
                   </div>

                   {/* Bottom line: ID Card action */}
                   <div className="pt-1">
                      <Button 
                         size="sm" 
                         variant="ghost"
                         onClick={() => setIdCardWorker(worker.id)}
                         className="h-9 bg-[#0A0F1E] text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs w-full justify-center transition-all rounded-xl"
                      >
                         <CreditCard className="h-3.5 w-3.5 mr-1.5 text-[#F97316]" /> Generate ID Card
                      </Button>
                   </div>
                </div>
              )
           })}

           {filteredWorkers.length === 0 && (
              <div className="bg-[#111827] rounded-2xl p-8 text-center text-xs text-slate-500 font-medium">
                 No matching workers found.
              </div>
           )}
        </div>

        {/* Desktop View: Original premium table layout */}
        <div className="hidden md:block bg-[#111827] rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-[#0A0F1E]/50">
                  <th className="p-5 font-bold">Worker</th>
                  <th className="p-5 font-bold">Aadhaar (ID)</th>
                  <th className="p-5 font-bold">Assigned Site</th>
                  <th className="p-5 font-bold text-center">App Access</th>
                  <th className="p-5 font-bold text-center w-32">ID Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredWorkers.map(worker => {
                  const hasAccess = accessMap[worker.id]
                  return (
                    <tr key={worker.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5">
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-200">{worker.name}</span>
                           <span className="text-xs text-slate-500 font-medium">{worker.skill}</span>
                         </div>
                      </td>
                      <td className="p-5 font-medium text-slate-300 font-mono tracking-widest">
                         {worker.aadhaarNumber ? `XXXX-XXXX-${worker.aadhaarNumber.slice(-4)}` : "Not provided"}
                      </td>
                      <td className="p-5 font-medium text-slate-300">
                         {getSiteName(worker.assignedSiteId)}
                      </td>
                      <td className="p-5 text-center">
                         <button 
                           onClick={() => toggleAccess(worker.id)}
                           className={cn("relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                              hasAccess ? "bg-[#22C55E]" : "bg-slate-700"
                           )}
                         >
                           <span className="sr-only">Toggle access</span>
                           <span className={cn("inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                              hasAccess ? "translate-x-7" : "translate-x-1"
                           )} />
                         </button>
                      </td>
                      <td className="p-5 text-center">
                        <Button 
                           size="sm" 
                           variant="ghost"
                           onClick={() => setIdCardWorker(worker.id)}
                           className="h-9 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-bold transition-colors w-full"
                        >
                           <CreditCard className="h-4 w-4 mr-2" /> Gen ID
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                
                {filteredWorkers.length === 0 && (
                  <tr>
                     <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                        No matching workers found.
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ID CARD MODAL */}
      {idCardWorker && targetWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm flex flex-col items-center gap-6 animate-in zoom-in-95">
             
             {/* THE ID CARD */}
             <div className="bg-white rounded-[2rem] w-[300px] h-[480px] overflow-hidden shadow-2xl relative flex flex-col items-center pt-8 border-4 border-slate-200">
                <div className="absolute top-0 left-0 right-0 h-32 bg-[#F97316]" />
                
                <div className="relative h-24 w-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-md">
                   {targetWorker.photoUrl ? (
                      <img src={targetWorker.photoUrl} alt="" className="h-full w-full object-cover" />
                   ) : (
                      <span className="text-3xl font-black">{targetWorker.name.charAt(0)}</span>
                   )}
                </div>

                <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight text-center px-4">{targetWorker.name}</h2>
                <span className="text-sm font-bold text-[#F97316] uppercase tracking-widest mt-1">{targetWorker.skill}</span>
                
                <div className="w-full px-8 mt-6 space-y-3">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Worker ID</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{targetWorker.id.toUpperCase()}-X</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Site</span>
                      <span className="text-sm font-bold text-slate-900 line-clamp-1">{getSiteName(targetWorker.assignedSiteId)}</span>
                   </div>
                </div>

                <div className="mt-auto pb-8 flex flex-col items-center w-full">
                   <QrCode className="h-20 w-20 text-slate-800" />
                   <span className="text-[8px] font-bold text-slate-400 mt-2">Scan to verify at gate</span>
                </div>
             </div>

             {/* ACTIONS */}
             <div className="flex gap-3 w-[300px]">
               <Button onClick={() => setIdCardWorker(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 rounded-xl border border-white/10">
                 Close
               </Button>
               <Button className="flex-1 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#F97316]/20" onClick={() => {
                 toast.success("ID Card downloaded successfully.")
                 setIdCardWorker(null)
               }}>
                 <Printer className="h-4 w-4 mr-2" /> Print
               </Button>
             </div>
          </div>
        </div>
      )}

    </div>
  )
}

