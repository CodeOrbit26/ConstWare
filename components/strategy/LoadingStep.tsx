"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Loader2, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_MESSAGES = [
  "Calibrating regional material rates...",
  "Computing structural load requirements...",
  "Analysing labour market for your city...",
  "Calculating phase-wise cash flow...",
  "Estimating wastage factors...",
  "Generating BOQ breakdown...",
  "Finalising contingency buffers...",
  "Architectural intelligence complete.",
  "Constructing report dossier...",
  "Finalizing data points..."
]

export function LoadingStep() {
  const [progress, setProgress] = React.useState(0)
  const [messageIndex, setMessageIndex] = React.useState(0)

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + 1.25 // ~8 seconds for 100%
      })
    }, 100)

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % STATUS_MESSAGES.length)
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1E]/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-md w-full px-8 space-y-12 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
          <div className="relative h-24 w-24 mx-auto bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center shadow-2xl">
             <BrainCircuit className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white uppercase tracking-widest italic">Computing Intelligence</h3>
          <p className="text-sm font-medium text-slate-500 h-6 animate-in slide-in-from-bottom-2 duration-300" key={messageIndex}>
            {STATUS_MESSAGES[messageIndex]}
          </p>
        </div>

        <div className="space-y-4">
           <Progress value={progress} className="h-2 bg-slate-800" />
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Analyzing 248 Parameters
              </span>
              <span>{Math.floor(progress)}%</span>
           </div>
        </div>

        <div className="pt-8 opacity-50 flex justify-center gap-6">
           <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/5 animate-pulse" />
           <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
           <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}
