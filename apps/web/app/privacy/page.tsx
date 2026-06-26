"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Lock, Eye, FileText, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  const handleBack = () => {
    // Navigate back to history, or fallback to main login/dashboard
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-primary/30 selection:text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background glow blur elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 z-10 relative">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 h-9 rounded-xl hover:bg-slate-900 px-3 transition-all active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center font-black text-xs text-white shadow-lg shadow-primary/20">CW</div>
            <span className="text-sm font-black uppercase tracking-tight text-white italic">ConstWare</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-left space-y-3">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Workspace Protocol</span>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic leading-none">Privacy Policy</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Last Updated: June 25, 2026 • Platform version 2.4.0
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="space-y-6">
          
          {/* Intro Card */}
          <div className="p-6 bg-slate-900/60 border border-slate-800/40 rounded-3xl shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Shield className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">1. Secure Node Authentication</h2>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              At ConstWare, we prioritize your data privacy. We implement secure hashing standards using crypto-logical layers (SHA-256 subtle cryptographies) to store client account keys. Password payloads are converted to encrypted hash arrays locally on your node device and never processed as raw string characters across server-side networks.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Lock className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">2. Personal & Workspace Data Collected</h2>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              We collect information necessary to configure your enterprise construction node:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-400 font-medium space-y-2">
              <li><strong className="text-slate-350 uppercase text-[10px] tracking-wider">Identity Parameters</strong>: Full name, designated role, and auth contacts (email or phone).</li>
              <li><strong className="text-slate-350 uppercase text-[10px] tracking-wider">Enterprise Nodes</strong>: Company legal registry name, GSTIN tax registration identifiers, and physical office addresses.</li>
              <li><strong className="text-slate-350 uppercase text-[10px] tracking-wider">Ledger Transactions</strong>: Site worker registries, supervisor logs, project estimators, and material catalogs.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Eye className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">3. Data Synchronization & Cache</h2>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              For local development and sandbox environments, all user settings and operational parameters are persisted in browser client-side storage keys (`constware_mock_session` / `constware_mock_users`). Production configurations utilize secure server cookies and database rules managed under Supabase encryption schemas.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <FileText className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">4. Account Deletion & Purging</h2>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Users retain absolute rights to clear their credentials and purge their workspace profiles. Triggering the **Delete Account** function instantly destroys active local session payloads, purges related mock database files from client-side registers, and terminates access tokens on verified network directories.
            </p>
          </div>

          {/* Contact Support Note */}
          <div className="p-6 bg-primary/5 border border-primary/15 rounded-3xl text-center space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-primary">Compliance Inquiries</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
              If you have any questions regarding these compliance nodes, privacy parameters, or data security policies, please get in touch with our security compliance desk.
            </p>
            <Button 
              onClick={() => router.push("/support")}
              className="bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-wider px-6 h-9 rounded-xl shadow-lg shadow-primary/10 active:scale-95"
            >
              Contact Support Desk
            </Button>
          </div>

        </div>

        {/* Footer Meta */}
        <div className="text-center pt-6 text-[9px] font-black text-slate-650 uppercase tracking-[0.3em]">
          ConstWare Security Intelligence Unit • 2026
        </div>

      </div>
    </div>
  )
}
