"use client"

import * as React from "react"
import { Bot, X, Send, Sparkles, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ConstBot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([
    { role: 'ai', text: 'Hello! I am ConstBot, your AI construction assistant. How can I help you today?' }
  ])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const newMsgs = [...messages, { role: 'user', text: input }]
    setMessages(newMsgs)
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMsgs, { role: 'ai', text: "I'm currently being re-calibrated as part of the unified ConstWare core. I'll be back with full specialized construction intelligence shortly!" }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 h-[450px] bg-[#0A0F1E] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase italic tracking-widest">ConstBot</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed",
                  m.role === 'user' ? "bg-primary text-white" : "bg-slate-900 text-slate-300"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 p-3 rounded-2xl">
                  <Loader2 className="h-3 w-3 text-primary animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="bg-slate-950 border-slate-800 text-[11px] rounded-xl"
            />
            <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-orange-600 rounded-xl shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageSquare className="h-6 w-6 group-hover:hidden" />
          <Sparkles className="h-6 w-6 hidden group-hover:block animate-pulse" />
        </button>
      )}
    </div>
  )
}
