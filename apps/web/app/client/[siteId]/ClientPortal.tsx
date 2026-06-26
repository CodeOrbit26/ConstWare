'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Image as ImageIcon,
  ChevronRight,
  TrendingUp,
  Globe,
  Loader2,
  Wallet,
  ShieldCheck,
  Layout,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation';

export default function ClientPortal({ params }: { params: { siteId: string } }) {
  const router = useRouter();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await fetch(`/api/client/site-data?siteId=${params.siteId}`);
        const data = await res.json();
        if (data.success) {
          setSite(data.data);
        } else {
          setError(data.error || 'Identity Verification Failed');
          if (res.status === 401 || res.status === 403) router.push('/login');
        }
      } catch (err) {
        setError('Connection to Identity Matrix Interrupted');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [params.siteId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-6">
        <div className="h-16 w-16 bg-primary/20 border border-primary/40 rounded-3xl flex items-center justify-center animate-pulse">
           <Globe className="h-8 w-8 text-primary animate-spin" />
         </div>
         <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Syncing Portal...</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="h-20 w-20 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center text-primary">
           <ShieldCheck className="h-10 w-10" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Identity Sync Error</h2>
           <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
              {error}
           </p>
        </div>
        <Button onClick={() => router.push('/login')} className="bg-white text-navy hover:bg-slate-100 rounded-xl font-black uppercase text-xs tracking-widest px-8 h-12">
           Return to Safety
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-primary selection:text-white">
      {/* STEALTH HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-lg">CW</div>
           <div className="hidden sm:block h-8 w-px bg-white/10" />
           <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Project Owner Portal</p>
              <h2 className="text-sm font-black text-white uppercase italic tracking-tight">{site.name}</h2>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <Badge variant="outline" className="font-mono text-primary border-primary/20 bg-primary/5 px-3 py-1 text-[10px] sm:text-xs">
              {params.siteId}
           </Badge>
           <button 
             onClick={() => router.push('/login')}
             className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all"
           >
              <ShieldCheck className="h-5 w-5" />
           </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
         {/* PROJECT INTELLIGENCE CARD */}
         <div className="bg-[#0A0F1E] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <Building2 className="h-64 w-64" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-start">
                <div className="space-y-8">
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em] italic mb-2">
                         <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live Analysis
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                         <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{site.name}</h1>
                         <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg">
                            <ShieldCheck className="h-3.5 w-3.5" /> Identity Verified
                         </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                         <MapPin className="h-4 w-4" />
                         <span className="text-xs font-bold uppercase tracking-widest">{site.location}</span>
                      </div>
                   </div>

                   <div className="space-y-4 max-w-md">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Progress</span>
                         <span className="text-2xl font-black text-primary italic">{site.progress}%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-900 rounded-full border border-white/5 p-1">
                         <div 
                           className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                           style={{ width: `${site.progress}%` }}
                         />
                      </div>
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
                         <span>Start: {site.start_date || 'Oct 2025'}</span>
                         <span>Est. Handover: {site.end_date || 'Dec 2026'}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 space-y-8 min-w-[280px]">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl italic">
                         {site.contractor?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Project Lead</p>
                         <p className="text-lg font-black text-white uppercase italic leading-none">{site.contractor?.name}</p>
                         <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{site.contractor?.company}</p>
                      </div>
                   </div>
                   <div className="flex flex-col gap-3">
                      <Button onClick={() => window.open(`tel:${site.contractor?.phone}`)} className="h-14 bg-white text-navy hover:bg-slate-100 font-black uppercase text-[10px] tracking-[0.2em] gap-3 rounded-2xl">
                         <Phone className="h-4 w-4" /> Secure Call
                      </Button>
                      <Button variant="outline" className="h-14 border-white/5 text-slate-400 hover:text-white hover:border-white/20 font-black uppercase text-[10px] tracking-[0.2em] gap-3 rounded-2xl">
                         <MessageSquare className="h-4 w-4" /> Message
                      </Button>
                   </div>
                </div>
            </div>
         </div>

         {/* UPDATES & GALLERY */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* TODAY'S MOMUMENTUM */}
            <div className="space-y-8">
               <div className="flex items-end justify-between px-2">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Intelligence Feed</p>
                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Live Updates</h3>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                     Fresh Update
                  </Badge>
               </div>

               <div className="bg-[#0A0F1E] border border-white/5 rounded-[2.5rem] p-10 space-y-10">
                  {site.latest_update ? (
                     <div className="space-y-10">
                        <div className="flex items-start gap-4">
                           <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 text-primary">
                              <Calendar className="h-6 w-6" />
                           </div>
                           <p className="text-lg font-bold text-slate-300 italic leading-relaxed pt-1">
                              &ldquo;{site.latest_update.summary}&rdquo;
                           </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           {site.latest_update.photos?.slice(0, 4).map((p: string, i: number) => (
                              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer relative shadow-xl">
                                 <img src={p} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Update" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <ImageIcon className="h-8 w-8 text-white" />
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="flex items-center gap-3 py-4 border-y border-white/5">
                           <div className="flex-1 space-y-1">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Team Engagement</p>
                              <p className="text-xl font-black text-white italic">{site.latest_update.workers_count} Professionals On-Site</p>
                           </div>
                           <div className="h-10 w-px bg-white/5" />
                           <div className="flex-1 text-right space-y-1">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Climate</p>
                              <p className="text-xl font-black text-primary italic">32°C • Clear</p>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="py-20 text-center space-y-6">
                        <div className="h-16 w-16 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center text-slate-600 mx-auto">
                           <Clock className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xl font-black text-white uppercase italic tracking-tight">Syncing Data...</p>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">The site team is preparing the daily report.</p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* MILESTONE MATRIX */}
            <div className="space-y-8">
               <div className="space-y-1 px-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Strategic Matrix</p>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Key Milestones</h3>
               </div>

               <div className="bg-[#0A0F1E] border border-white/5 rounded-[2.5rem] p-10 space-y-1">
                  {site.milestones?.map((m: any, i: number) => (
                     <div key={m.id} className="flex gap-6 py-8 group first:pt-0 last:pb-0 border-b border-white/5 last:border-0 relative">
                        <div className="flex flex-col items-center">
                           <div className={cn(
                             "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-10",
                             m.completed 
                               ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                               : "bg-slate-950 border-slate-800 text-slate-600"
                           )}>
                              {m.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                           </div>
                           {i < site.milestones.length - 1 && (
                              <div className={cn(
                                "w-0.5 flex-1 transition-all duration-500",
                                m.completed ? "bg-emerald-500" : "bg-slate-800"
                              )} />
                           )}
                        </div>
                        <div className="flex-1 pb-2">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className={cn("text-lg font-black uppercase italic tracking-tight transition-colors", m.completed ? "text-white" : "text-slate-500")}>
                                 {m.title}
                              </h4>
                              {m.completed && (
                                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">
                                    Delivered
                                 </Badge>
                              )}
                           </div>
                           <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest italic">Target: {m.date}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* FINANCIAL TRANSPARENCY BLOCK */}
               <div className="bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border border-indigo-500/20 rounded-[2.5rem] p-10 group overflow-hidden relative">
                  <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                     <Wallet className="h-32 w-32" />
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-400" />
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic leading-none">Financial Efficiency</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Project Value</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter">₹45.5L</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Audit Score</p>
                          <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">98.4%</p>
                       </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] leading-relaxed italic">
                       Calculated via autonomous site analytics and material throughput.
                    </p>
                  </div>
               </div>
            </div>
         </div>
         
         {/* FOOTER */}
         <footer className="pt-20 pb-10 text-center space-y-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 italic">
               <span>Powered by ConstWare Intelligence Network</span>
               <div className="hidden md:block h-1 w-1 rounded-full bg-slate-800" />
               <span>Enterprise Edition v4.0</span>
               <div className="hidden md:block h-1 w-1 rounded-full bg-slate-800" />
               <span className="text-primary">Identity Verified</span>
            </div>
            <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.6em] leading-relaxed max-w-lg mx-auto">
               Secure operational access granted to project authorized owner only.
            </p>
         </footer>
      </main>

      {/* MOBILE HUD ACTIONS */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-50">
         <div className="max-w-md mx-auto flex gap-4 pointer-events-auto">
            <Button onClick={() => window.open(`tel:${site.contractor?.phone}`)} className="flex-1 h-16 bg-primary hover:bg-orange-600 text-navy font-black uppercase text-[10px] tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95">
               <Phone className="h-4 w-4 fill-navy" /> Call Now
            </Button>
            <Button onClick={() => window.open(`https://wa.me/91${site.contractor?.phone?.replace(/[^0-9]/g, '')}`)} className="flex-1 h-16 bg-[#111827] hover:bg-slate-800 text-white border border-white/10 font-black uppercase text-[10px] tracking-widest gap-3 rounded-2xl shadow-2xl shadow-black/40 transition-all active:scale-95">
               <MessageSquare className="h-4 w-4" /> Message
            </Button>
         </div>
      </div>
    </div>
  );
}
