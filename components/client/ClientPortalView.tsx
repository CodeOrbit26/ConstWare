"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { 
  ClientProjectHero, 
  ClientTodayUpdate, 
  ClientPhotoTimeline, 
  ClientFinancialCard, 
  ClientMilestones, 
  ClientContactSection 
} from "@/components/client/ClientPortalComponents"
import { mockSites, mockDPRs } from "@/lib/services/mockData"
import Link from "next/link"

export default function ClientPortalView() {
  const params = useParams()
  const token = params?.token as string

  // Lookup site by token
  const site = mockSites.find(s => s.clientToken === token)
  
  if (!site) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 text-center">
        <div className="h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 animate-pulse">
           <BuildingCircleSlash className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2 italic">Access Terminated</h1>
        <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">The project intelligence link you are using is either invalid or has reached its lifecycle expiration. Please contact your executive contractor for a refreshed digital key.</p>
        <Link href="/" className="inline-flex h-12 items-center px-8 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl">Return to Nucleus</Link>
      </div>
    )
  }

  // Related data for the portal
  const todayDPR = mockDPRs.find(d => d.siteId === site.id && d.submitted)
  
  // Financial breakdown calculations
  const totalBudget = site.budgetTotal
  const totalSpent = site.todayExpenses * (site.progress + 20) // Mock logic for total spend
  const categories = [
    { name: "Executive Talent", percentage: 42, color: "bg-blue-500" },
    { name: "Premium Materials", percentage: 38, color: "bg-emerald-500" },
    { name: "Integrated Systems", percentage: 15, color: "bg-amber-500" },
    { name: "Operational Overhead", percentage: 5, color: "bg-slate-400" },
  ]

  // All photos from site history (mock)
  const allPhotos = [
     { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5', date: '10 Apr' },
     { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd', date: '09 Apr' },
     { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', date: '08 Apr' },
     { url: 'https://images.unsplash.com/photo-1590387303043-176106606fb', date: '05 Apr' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-primary selection:text-white font-plus-jakarta">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-[100] w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-white/20 dark:border-slate-800/50">
         <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-slate-950 dark:bg-white rounded-2xl flex items-center justify-center font-black text-white dark:text-slate-950 text-2xl shadow-xl rotate-3">CW</div>
               <div className="hidden md:block">
                  <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">ConstWare <span className="text-primary not-italic">Elite</span></span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Executive Client Terminal</p>
               </div>
            </div>
            <div className="text-right">
               <div className="flex items-center gap-2 justify-end">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Integrity: Secure</p>
               </div>
               <p className="text-xs font-black text-slate-900 dark:text-white mt-1">Refreshed: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16 space-y-32">
         {/* Hero Section */}
         <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <ClientProjectHero site={site} />
         </section>

         {/* Today's Update */}
         <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <div className="flex items-center gap-4 mb-10">
               <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
               <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 whitespace-nowrap">Operational Intelligence Today</h2>
               <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
            <ClientTodayUpdate dpr={todayDPR} />
         </section>

         {/* Photo Timeline */}
         <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <ClientPhotoTimeline photos={allPhotos} />
         </section>

         {/* Financial Transparency */}
         <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <ClientFinancialCard budget={totalBudget} spent={totalSpent} categories={categories} />
         </section>

         {/* Milestones */}
         <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            <ClientMilestones milestones={site.milestones} />
         </section>

         {/* Contact CTA */}
         <section className="pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <ClientContactSection />
         </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-20">
         <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-8">
            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-300">CW</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">
               Architected by <span className="text-slate-900 dark:text-white">ConstWare Systems</span> • All Assets Encrypted
            </p>
            <div className="flex items-center gap-6">
               <span className="text-[9px] font-bold text-slate-300 uppercase">Privacy Protocol</span>
               <span className="text-[9px] font-bold text-slate-300 uppercase">Service Registry</span>
               <span className="text-[9px] font-bold text-slate-300 uppercase">Client Support</span>
            </div>
         </div>
      </footer>
    </div>
  )
}

function BuildingCircleSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.7-1.7" />
      <path d="m7.4 16.6 2.5-2.5" />
      <path d="m11.8 12.2 2.5-2.5" />
      <path d="m16.2 7.8 1.7-1.7" />
      <circle cx="12" cy="12" r="10" />
      <path d="M7 17h.01" />
      <path d="M10 17h.01" />
      <path d="M13 17h.01" />
      <path d="M16 17h.01" />
      <path d="M7 14h.01" />
      <path d="M7 11h.01" />
      <path d="M13 11h.01" />
      <path d="M7 8h.01" />
      <path d="M10 8h.01" />
      <path d="M13 8h.01" />
      <path d="M16 8h.01" />
    </svg>
  )
}

function BuildingCircleSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.7-1.7" />
      <path d="m7.4 16.6 2.5-2.5" />
      <path d="m11.8 12.2 2.5-2.5" />
      <path d="m16.2 7.8 1.7-1.7" />
      <circle cx="12" cy="12" r="10" />
      <path d="M7 17h.01" />
      <path d="M10 17h.01" />
      <path d="M13 17h.01" />
      <path d="M16 17h.01" />
      <path d="M7 14h.01" />
      <path d="M7 11h.01" />
      <path d="M13 11h.01" />
      <path d="M7 8h.01" />
      <path d="M10 8h.01" />
      <path d="M13 8h.01" />
      <path d="M16 8h.01" />
    </svg>
  )
}
