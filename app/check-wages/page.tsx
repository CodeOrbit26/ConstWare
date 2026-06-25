"use client"

import * as React from "react"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, ArrowRight, UserCircle, Search, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function WorkerPortalLookup() {
  const [workerCode, setWorkerCode] = React.useState("")
  const router = useRouter()

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    if (workerCode.length > 2) {
      router.push(`/check-wages/${workerCode.toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
      
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in slide-in-from-bottom-10 duration-700">
         <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-[2rem] bg-navy flex items-center justify-center text-white shadow-2xl shadow-navy/20">
               <Shield size={40} className="text-primary" />
            </div>
            <div className="space-y-1">
               <h1 className="text-4xl font-black text-navy tracking-tighter italic">CONSTWARE</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Worker Integrity Portal</p>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
            <div className="space-y-2">
               <h2 className="text-xl font-black text-navy uppercase tracking-tight">Check Your Wages</h2>
               <p className="text-xs text-slate-400 font-medium">Enter your 6-digit worker code provided by your supervisor to view your attendance and payout status.</p>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
               <div className="relative group">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Enter Worker Code (e.g. CW8291)" 
                    className="h-14 pl-12 bg-slate-50 border-none rounded-2xl font-black text-navy placeholder:text-slate-300 focus-visible:ring-1 focus-visible:ring-primary shadow-inner text-center tracking-[0.2em]"
                    value={workerCode}
                    onChange={(e) => setWorkerCode(e.target.value)}
                  />
               </div>
               <Button 
                 type="submit"
                 className="w-full h-16 bg-navy hover:bg-navy/90 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-navy/20 group transition-all active:scale-95"
               >
                  Verify Identity <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </form>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-center gap-6">
               <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-6 gap-1 px-2 text-[8px] font-black border-slate-100 bg-slate-50/50">
                     <Clock size={10} /> 24/7 ACCESS
                  </Badge>
               </div>
               <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ENCRYPTED PORTAL</p>
            </div>
         </div>

         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
            Having trouble? Ask your supervisor for your <br />
            <span className="text-primary font-black">ConstWare Worker ID</span>.
         </p>
      </div>

    </div>
  )
}
