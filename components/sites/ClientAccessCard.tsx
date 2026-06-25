'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  RefreshCcw, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Phone,
  ChevronRight,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ClientAccessCardProps {
  siteId: string;
  siteName: string;
  existingAccessId?: string | null;
  existingEnabled?: boolean;
  existingClientName?: string | null;
  existingClientPhone?: string | null;
  existingClientEmail?: string | null;
  contractorName: string;
  companyName?: string | null;
}

export function ClientAccessCard({
  siteId,
  siteName,
  existingAccessId,
  existingEnabled = false,
  existingClientName,
  existingClientPhone,
  existingClientEmail,
  contractorName,
  companyName
}: ClientAccessCardProps) {
  const [loading, setLoading] = useState(false);
  const [clientAccessId, setClientAccessId] = useState(existingAccessId);
  const [enabled, setEnabled] = useState(existingEnabled);
  const [copied, setCopied] = useState(false);
  
  const [clientData, setClientData] = useState({
    name: existingClientName || '',
    phone: existingClientPhone || '',
    email: existingClientEmail || ''
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contractor/generate-client-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteId,
          clientName: clientData.name,
          clientPhone: clientData.phone,
          clientEmail: clientData.email
        })
      });
      const data = await res.json();
      if (data.clientAccessId) {
        setClientAccessId(data.clientAccessId);
        setEnabled(true);
        toast.success("Security Protocol Active: Client ID Generated");
      } else {
        toast.error(data.error || "Generation Failed");
      }
    } catch (err) {
      toast.error("Network sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const nextState = !enabled;
    setEnabled(nextState);
    try {
      const res = await fetch('/api/contractor/toggle-client-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, enabled: nextState })
      });
      if (!res.ok) {
        setEnabled(!nextState);
        toast.error("Failed to update access status");
      } else {
        toast.info(nextState ? "Client Access Restored" : "Client Access Revoked");
      }
    } catch (err) {
      setEnabled(!nextState);
      toast.error("Network error during toggle");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("ID Copied to Identity Matrix");
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `Namaste! 🏗️
Your project *${siteName}* is live on ConstWare.

Track progress anytime:
📱 Open: constware.app/login
🔑 Select "Client" tab
🆔 Enter ID: *${clientAccessId}*

You'll see daily photos, progress % and updates.
— ${contractorName}`;

  const shareWhatsApp = () => {
    const phone = clientData.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  if (!clientAccessId) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Security Layer</p>
             <h3 className="text-xl font-black uppercase tracking-tight text-white italic">Client Portal Access</h3>
          </div>
          <div className="h-10 w-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-600">
             <Lock className="h-5 w-5" />
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          Generate a unique, passwordless Access ID for project transparency. 
          The project owner can track daily progress, view photos, and see milestones via a secure standalone portal.
        </p>

        <div className="space-y-6 pt-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 italic">
                    <User className="h-3 w-3" /> Client Name <span className="text-[8px] opacity-50 ml-1">(Optional)</span>
                 </Label>
                 <Input 
                   value={clientData.name}
                   onChange={e => setClientData({...clientData, name: e.target.value})}
                   placeholder="e.g. Ramesh Gupta" 
                   className="h-12 bg-slate-950 border-slate-800 text-white rounded-xl focus:ring-primary focus:border-primary"
                 />
              </div>
              <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 italic">
                    <Smartphone className="h-3 w-3" /> Client WhatsApp <span className="text-[8px] opacity-50 ml-1">(Optional)</span>
                 </Label>
                 <Input 
                   value={clientData.phone}
                   onChange={e => setClientData({...clientData, phone: e.target.value})}
                   placeholder="+91 9876543210" 
                   className="h-12 bg-slate-950 border-slate-800 text-white rounded-xl focus:ring-primary focus:border-primary"
                 />
              </div>
           </div>

           <Button 
             onClick={handleGenerate}
             disabled={loading}
             className="w-full h-16 bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
           >
             {loading ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
             Initialize Project Access
           </Button>
        </div>
      </div>
    );
  }

  // Split ID for segmented display: CW-AB-260423-7K
  const segments = clientAccessId.split('-');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl shadow-black/40 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 text-primary opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-700">
        <Globe className="h-40 w-40" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Live Portal Active</p>
           <h3 className="text-xl font-black uppercase tracking-tight text-white italic">Identity Matrix</h3>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portal Status</p>
              <p className={cn("text-[9px] font-bold uppercase italic", enabled ? "text-emerald-500" : "text-red-500")}>
                 {enabled ? "Active Signal" : "Revoked"}
              </p>
           </div>
           <button 
             onClick={handleToggle}
             className={cn(
               "h-8 w-14 rounded-full p-1 transition-all duration-300 relative",
               enabled ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-slate-950 border border-slate-800"
             )}
           >
             <div className={cn(
               "h-5 w-5 rounded-full shadow-lg transition-all duration-300 transform",
               enabled ? "translate-x-6 bg-emerald-500" : "translate-x-0 bg-slate-700"
             )} />
           </button>
        </div>
      </div>

      {/* Prominent ID Display */}
      <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-8 flex items-center justify-center gap-2 group/id hover:border-primary/30 transition-colors relative">
        <div className="absolute right-4 top-4">
           <Copy 
             onClick={() => copyToClipboard(clientAccessId)}
             className="h-4 w-4 text-slate-600 hover:text-primary cursor-pointer transition-colors" 
           />
        </div>
        
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            <span className="text-xl md:text-3xl font-black text-primary font-mono tracking-[0.1em]">{seg}</span>
            {idx < segments.length - 1 && <span className="text-slate-800 font-black text-xl md:text-2xl">—</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
         <Button 
           variant="outline" 
           onClick={() => copyToClipboard(clientAccessId)}
           className="h-14 border-slate-800 bg-slate-950/30 text-white hover:bg-slate-800 rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2"
         >
           {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-primary" />}
           {copied ? "Sync Success" : "Copy Access ID"}
         </Button>
         <Button 
           variant="outline" 
           onClick={handleGenerate}
           className="h-14 border-slate-800 bg-slate-950/30 text-slate-400 hover:bg-slate-800 rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2"
         >
           <RefreshCcw className="h-3.5 w-3.5" />
           Rotate Key
         </Button>
      </div>

      <div className="h-px bg-slate-800" />

      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Sharing Options</p>
            {clientData.name && (
               <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  <User className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-bold text-slate-300">{clientData.name}</span>
               </div>
            )}
         </div>

         <div className="flex flex-wrap gap-3">
            <Button 
              onClick={shareWhatsApp}
              className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 min-w-[140px] rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-emerald-600/10"
            >
              <MessageSquare className="h-4 w-4 fill-white" /> WhatsApp Direct
            </Button>
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(whatsappMessage)}
              className="h-12 border-slate-800 hover:bg-slate-800 text-slate-400 flex-1 min-w-[140px] rounded-xl font-black uppercase text-[10px] tracking-widest gap-2"
            >
              <Copy className="h-4 w-4" /> Copy Message
            </Button>
         </div>
      </div>

      <div className="flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest pt-2">
         <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-slate-700" />
            <span>ID is shared via secure transport and expires in 30 days of inactivity.</span>
         </div>
         <ChevronRight className="h-3 w-3" />
      </div>
    </div>
  );
}
