"use client"

import * as React from "react"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Shield,
  Zap,
  Star,
  Flame,
  Search,
  MoreVertical,
  Eye,
  Key,
  Copy,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { generateSiteCode, formatSiteCode } from "@/lib/utils/siteCodeGenerator"

const mockSupervisors = [
  { 
    id: "s1", 
    name: "Rahul Singh", 
    site: "Green Valley Residence", 
    dprStreak: 14, 
    gpsCompliance: 98, 
    rating: 4.9, 
    status: "online",
    alerts: 0,
    phone: "+91 98765 43210"
  },
  { 
    id: "s2", 
    name: "Amit Patel", 
    site: "Skyline Towers", 
    dprStreak: 3, 
    gpsCompliance: 82, 
    rating: 3.8, 
    status: "online",
    alerts: 2,
    phone: "+91 87654 32109"
  },
  { 
    id: "s3", 
    name: "Suresh Kumar", 
    site: "Lotus Business Park", 
    dprStreak: 0, 
    gpsCompliance: 95, 
    rating: 4.2, 
    status: "offline",
    alerts: 1,
    phone: "+91 76543 21098"
  }
]

export function SupervisorAuditView() {
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [codeModal, setCodeModal] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const handleGenerateAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setIsAuditing(false)
      toast.success("Intelligence Audit Generated: 14 metrics analyzed for site Green Valley", {
        icon: <Shield className="h-4 w-4 text-emerald-500" />
      })
    }, 2500)
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("12-Digit Access Code copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedSupervisor = mockSupervisors.find(s => s.id === codeModal)
  // Generate code using real format: CW + Client(RS=Rahul Singh) + Site + Date(26) + Contractor(AS=Abhay Sharma) + City
  const generatedCode = selectedSupervisor ? formatSiteCode(
    generateSiteCode({
      clientName: "Site Client",
      siteName: selectedSupervisor.site,
      startDate: `2026-04-${selectedSupervisor.id.replace('s', '2')}`,
      contractorName: "Abhay Sharma",
      city: selectedSupervisor.site.split(' ').pop() || "MU"
    })
  ) : ""

  return (
    <div className="space-y-12 animate-in fade-in duration-700 relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 dark:border-slate-800 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
             <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1.5 border border-primary/20">
                <Eye className="h-3 w-3" /> Personnel Integrity
             </span>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black tracking-tight text-navy dark:text-white uppercase italic">Supervisor Accountability</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Active Agents" value={mockSupervisors.length} icon={Users} premium />
         <StatCard title="Submission Velocity" value="8.5 Days" icon={Flame} iconClassName="text-amber-500" premium />
         <StatCard title="GPS Compliance" value="92%" icon={MapPin} iconClassName="text-emerald-500" premium />
         <StatCard title="Critical Alerts" value="3" icon={AlertTriangle} iconClassName="text-rose-500" premium />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl rounded-[3rem] border shadow-premium overflow-hidden">
               <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <p className="text-xl font-black italic tracking-tighter uppercase">Deployment Registry</p>
                  <div className="relative group w-72">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                     <input placeholder="Locate personnel..." className="h-12 w-full pl-12 rounded-xl bg-white dark:bg-slate-900 border-none text-[10px] font-black uppercase tracking-widest shadow-inner" />
                  </div>
               </div>
               <div className="p-6 space-y-4">
                  {mockSupervisors.map((s) => (
                    <div key={s.id} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm border border-transparent hover:border-primary/10 transition-all hover:scale-[1.01] group">
                       <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
                          <div className="flex items-center gap-6 min-w-48">
                             <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-xl shadow-inner rotate-3 group-hover:rotate-0 transition-all">
                               {s.name.substring(0, 2).toUpperCase()}
                             </div>
                             <div className="space-y-1">
                                <h4 className="text-lg font-black text-navy dark:text-white uppercase italic">{s.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10} className="text-primary" /> {s.site}</p>
                             </div>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-6 text-center">
                             <div className="space-y-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance</p><p className="text-xl font-black italic tabular-nums">{s.gpsCompliance}%</p></div>
                             <div className="space-y-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Streak</p><p className="text-xl font-black italic tabular-nums">{s.dprStreak} D</p></div>
                             <div className="space-y-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating</p><p className="text-xl font-black italic tabular-nums">{s.rating}/5</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                             <Button 
                               onClick={() => setCodeModal(s.id)}
                               className="h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 transition-all"
                             >
                               <Key className="h-3.5 w-3.5 mr-2 text-primary" /> ISSUE CREDENTIAL
                             </Button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <div className="p-10 rounded-[3rem] bg-slate-950 text-white shadow-premium relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 scale-150 rotate-12 transition-all"><Shield size={160} /></div>
               <div className="relative z-10 space-y-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Protocol Control</p>
                     <h3 className="text-xl font-black italic">Intelligence Oversight</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <Zap size={20} className="text-primary shrink-0" />
                        <p className="text-xs text-slate-400"><span className="font-bold text-white uppercase tracking-widest text-[9px] block mb-1">High Compliance</span>Perfect GPS record detected for 24 days.</p>
                     </div>
                  </div>
                  <Button onClick={handleGenerateAudit} disabled={isAuditing} className="w-full h-16 bg-white text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                     {isAuditing ? "Processing..." : "Run Personnel Audit"}
                  </Button>
               </div>
            </div>
         </div>
      </div>

      {/* ACCESS CODE GENERATION MODAL */}
      {codeModal && selectedSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-[500px] overflow-hidden shadow-2xl relative">
              <div className="px-8 pt-10 pb-6 text-center border-b border-slate-800/50">
                 <div className="mx-auto h-16 w-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Key className="h-8 w-8 text-primary" />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Access Authorized</h2>
                 <p className="text-slate-400 text-sm mt-3 font-medium">12-Digit Security Credential generated for <span className="text-white font-bold">{selectedSupervisor.name}</span></p>
              </div>
              
              <div className="p-8 space-y-8 bg-slate-900/50">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                       <MapPin className="h-3 w-3" /> LINKED SITE
                    </label>
                    <p className="text-center font-bold text-white bg-slate-950 border border-slate-800 py-3 rounded-xl">{selectedSupervisor.site}</p>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-2">
                       <Shield className="h-3 w-3" /> LOGIN CREDENTIAL
                    </label>
                    <div 
                      onClick={() => handleCopy(generatedCode)}
                      className="bg-slate-950 border border-primary/30 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer rounded-2xl p-6 flex items-center justify-between group"
                    >
                       <span className="text-3xl font-black tracking-[0.2em] text-white">
                          {generatedCode}
                       </span>
                       {copied ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-500 transition-all duration-300" />
                       ) : (
                          <Copy className="h-6 w-6 text-slate-600 group-hover:text-primary transition-all duration-300" />
                       )}
                    </div>
                    <p className="text-center text-[10px] text-slate-500 font-medium">
                       Supervisor can use this code directly on the ConstWare mobile app to begin site operations.
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-slate-950 flex gap-4 border-t border-slate-800">
                 <Button 
                    variant="ghost" 
                    onClick={() => setCodeModal(null)} 
                    className="flex-1 h-14 bg-transparent hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[11px]"
                 >
                    Dismiss
                 </Button>
                 <Button 
                    onClick={() => {
                       toast.success(`Access code sent via SMS to ${selectedSupervisor.phone}`)
                       setCodeModal(null)
                    }} 
                    className="flex-1 h-14 bg-primary hover:bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                 >
                    SEND VIA SMS
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
