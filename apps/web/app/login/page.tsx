"use client"

import * as React from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { 
  Shield, 
  BarChart, 
  Layers, 
  Cpu, 
  Globe, 
  Zap 
} from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#030712] font-sans selection:bg-[#F97316]/10 selection:text-[#F97316]">
      {/* Cinematic Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#090d16] p-16 text-white relative overflow-hidden border-r border-slate-900/50">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-emerald-500 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        {/* Top Section: Logo & Brand */}
        <div className="z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-primary/20 transform hover:scale-105 transition-transform cursor-pointer">
              CW
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none uppercase">ConstWare</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] mt-1 pl-0.5">Enterprise Intelligence</span>
            </div>
          </div>
          
          <h1 className="text-6xl font-black leading-tight mb-8 tracking-tighter uppercase max-w-lg">
            Constructing <br /> 
            <span className="text-primary italic">Better</span> Futures.
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-md mb-12 leading-relaxed">
            The intelligent operating system designed for the next generation of builders, contractors, and developers.
          </p>

          <div className="grid grid-cols-1 gap-10">
            <FeatureItem 
              icon={BarChart} 
              title="Predictive Analytics" 
              desc="Anticipate project delays before they happen with AI-driven site monitoring."
            />
            <FeatureItem 
              icon={Shield} 
              title="Ironclad Compliance" 
              desc="Automated worker verification and safety documentation for every project."
            />
            <FeatureItem 
              icon={Zap} 
              title="Real-time Execution" 
              desc="Streamline communication between the head office and site supervisors instantly."
            />
          </div>
        </div>

        {/* Bottom Section: Footer Meta */}
        <div className="z-10 flex items-center justify-end border-t border-white/10 pt-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            v2.4.0 • Enterprise Edition
          </div>
        </div>
      </div>

      {/* Modern Login Panel */}
      <div className="flex flex-1 items-center justify-center p-8 sm:p-20 relative bg-[#030712]">
        {/* Subtle decorative elements for mobile */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-600 to-emerald-500"></div>
        
        <div className="w-full max-w-[480px]">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-12">
            <div className="h-14 w-14 bg-navy rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-navy/20">CW</div>
            <div className="text-center">
              <h1 className="text-2xl font-black uppercase tracking-tight text-navy dark:text-white">ConstWare</h1>
              <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">Enterprise Platform</span>
            </div>
          </div>

          <LoginForm />
        </div>

        {/* Subtle Bottom Links */}
        <div className="absolute bottom-8 left-0 w-full text-center lg:text-right lg:pr-12 pointer-events-none">
           <p className="text-[8px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
             Construction Intelligence Unit • 2026
           </p>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  if (!Icon) return null;
  return (
    <div className="flex items-start gap-6 group">
      <div className="mt-1 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-primary/20">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-black text-lg uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">{desc}</p>
      </div>
    </div>
  )
}
