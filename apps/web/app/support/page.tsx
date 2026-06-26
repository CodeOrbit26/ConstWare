"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, ShieldCheck, HelpCircle, Mail, Phone, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ContactSupportPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [category, setCategory] = React.useState("billing")
  const [subject, setSubject] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/contractor/settings")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim() || !subject.trim() || !description.trim()) {
      toast.error("Please fill in all required contact form fields.")
      return
    }

    setIsSubmitting(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    toast.success(`Support request dispatched successfully. Ticket #CW-${Math.floor(1000 + Math.random() * 9000)} registered.`, {
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
    })

    // Reset form
    setName("")
    setContact("")
    setSubject("")
    setDescription("")
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-primary/30 selection:text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Dynamic background glow blur elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 z-10 relative">
        
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
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Workspace Support Node</span>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic leading-none">Contact Support Desk</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Access secure ticket routing and platform troubleshooting keys
          </p>
        </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Panel */}
          <div className="md:col-span-7 bg-slate-900/60 border border-slate-800/40 p-6 rounded-3xl shadow-xl backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-350 mb-2 text-left">Dispatch Support Ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="supportName" className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                <Input 
                  id="supportName" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-11 bg-slate-950/60 border-slate-800 focus:border-primary text-white font-bold text-xs" 
                  placeholder="John Doe" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="supportContact" className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Gateway (Email or Phone)</Label>
                <Input 
                  id="supportContact" 
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="h-11 bg-slate-950/60 border-slate-800 focus:border-primary text-white font-bold text-xs" 
                  placeholder="john@example.com or +919876543210" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="supportCategory" className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Ticket Category</Label>
                <select 
                  id="supportCategory"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold text-xs"
                >
                  <option value="billing">Billing & Workspace Nodes</option>
                  <option value="auth">System Keys & Authentication</option>
                  <option value="integrations">API Integrations</option>
                  <option value="other">Other Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="supportSubject" className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject</Label>
                <Input 
                  id="supportSubject" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="h-11 bg-slate-950/60 border-slate-800 focus:border-primary text-white font-bold text-xs" 
                  placeholder="Brief summary of request" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="supportDesc" className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Detailed Description</Label>
                <textarea 
                  id="supportDesc" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-primary text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Describe your platform issues or inquiries here..."
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Dispatching ticket..." : (
                  <>
                    <Send className="h-4 w-4" /> Dispatch Request
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Help Desk Panel */}
          <div className="md:col-span-5 space-y-6">
            
            {/* System Status */}
            <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-3xl text-left space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">System Status</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Operational</span>
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                All platform sync systems, ledger databases, and Auth guard gateways are operating at peak efficiency.
              </p>
            </div>

            {/* Direct Gateways */}
            <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-3xl text-left space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Direct Gateways</h3>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-black uppercase text-slate-500">Security & Billing Desk</span>
                    <span className="text-xs font-bold text-slate-200">support@constware.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-black uppercase text-slate-500">24/7 Hotline</span>
                    <span className="text-xs font-bold text-slate-200">+91 1800-419-5868</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-3xl text-left space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <HelpCircle className="h-4 w-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">FAQ Node Shortcuts</h3>
              </div>
              <div className="space-y-3 text-[10px] font-semibold text-slate-400">
                <div>
                  <p className="text-slate-200">How do I verify a workspace supervisor?</p>
                  <p className="mt-1 leading-relaxed text-slate-500">Supervisors are registered under "Stakeholders & Teams" inside Settings.</p>
                </div>
                <div>
                  <p className="text-slate-200">Where are my encryption keys stored?</p>
                  <p className="mt-1 leading-relaxed text-slate-500">Mock sessions utilize local state cache keys inside browser security blocks.</p>
                </div>
              </div>
            </div>

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
