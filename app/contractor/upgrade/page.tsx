"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Zap, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function UpgradePlanPage() {
  const [loading, setLoading] = React.useState(false)

  const handleUpgrade = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Payment successful! Enterprise Pro features unlocked.")
    }, 2000)
  }

  return (
    <DashboardLayout title="Subscription & Billing">
       <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
             <Link href="/contractor/settings">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0">
                   <ArrowLeft className="h-5 w-5" />
                </Button>
             </Link>
             <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Upgrade Enterprise Node Limit</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
             {/* BASIC TIER */}
             <div className="bg-[#111827] rounded-[2rem] p-8 border border-white/5 shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest text-[10px]">Core Protocol</h3>
                <div className="text-5xl font-black text-white italic tracking-tighter">₹4,999<span className="text-sm text-slate-600 font-medium tracking-normal normal-case">/mo</span></div>
                <div className="h-px w-full bg-slate-800" />
                <ul className="space-y-4 text-sm text-slate-300 font-bold text-left w-full pl-2">
                   <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0" /> 15 Project Nodes</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0" /> Basic AI Estimator</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0" /> Up to 500 Workers</li>
                </ul>
                <div className="flex-1" />
                <Button disabled className="w-full mt-auto bg-slate-800 text-slate-500 rounded-[1rem] h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-inner">
                   Active Plan
                </Button>
             </div>

             {/* PRO TIER */}
             <div className="bg-gradient-to-b from-[#111827] to-[#0A0F1E] rounded-[2.5rem] p-10 border-2 border-[#F97316] shadow-2xl shadow-[#F97316]/20 flex flex-col items-center text-center space-y-8 transform md:scale-105 z-10 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#F97316]/10 -rotate-12"><Zap size={140} /></div>
                
                <div className="bg-[#F97316] text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-[#F97316]/30 animate-pulse">
                   Most Popular
                </div>
                
                <h3 className="text-2xl font-black text-white italic">Enterprise Pro</h3>
                
                <div className="flex items-end justify-center gap-1">
                   <span className="text-6xl font-black text-[#F97316] italic tracking-tighter leading-none">₹12,499</span>
                   <span className="text-sm text-slate-500 font-medium mb-2">/mo</span>
                </div>

                <div className="h-px w-full bg-white/10" />

                <ul className="space-y-5 text-sm text-white font-bold text-left w-full z-10 pl-2">
                   <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0" /> Unlimited Project Nodes</li>
                   <li className="flex items-center gap-4"><Star className="h-5 w-5 text-[#F97316] shrink-0 fill-[#F97316]" /> Full VaxGuard AI Access</li>
                   <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0" /> VIP WhatsApp Automation</li>
                   <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0" /> GPS Radius Overrides</li>
                   <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0" /> Priority Server Support</li>
                </ul>
                
                <div className="flex-1" />
                
                <Button 
                   onClick={handleUpgrade}
                   disabled={loading}
                   className="w-full mt-auto bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[1.25rem] h-16 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#F97316]/20 transition-all active:scale-95"
                >
                   {loading ? "Processing..." : "Upgrade to Pro"}
                </Button>
             </div>

             {/* ENTERPRISE TIER */}
             <div className="bg-[#111827] rounded-[2rem] p-8 border border-white/5 shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest text-[10px]">Custom Fleet</h3>
                <div className="text-4xl font-black text-white pt-2 italic">Custom</div>
                <div className="h-px w-full bg-slate-800" />
                <ul className="space-y-4 text-sm text-slate-400 font-medium text-left w-full pl-2">
                   <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> White Label Portal</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> SAP Integration API</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Dedicated Account Manager</li>
                </ul>
                <div className="flex-1" />
                <Button className="w-full mt-auto bg-transparent border-2 border-slate-700 hover:bg-slate-800 text-white rounded-[1rem] h-14 font-black uppercase tracking-[0.2em] text-[10px] transition-colors">
                   Contact Sales
                </Button>
             </div>
          </div>
       </div>
    </DashboardLayout>
  )
}
