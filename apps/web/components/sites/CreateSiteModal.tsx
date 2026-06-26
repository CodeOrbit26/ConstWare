"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Building2, MapPin, Wallet, UserPlus, Phone, Mail } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCurrentUserId } from "@/lib/auth/mockAuth"

export function CreateSiteModal() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()

  // Form states
  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [budget, setBudget] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [supervisor, setSupervisor] = React.useState("")
  const [clientName, setClientName] = React.useState("")
  const [clientPhone, setClientPhone] = React.useState("")
  const [clientEmail, setClientEmail] = React.useState("")

  const mutation = useMutation({
    mutationFn: async (newSite: any) => {
      const userId = await getCurrentUserId()
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(newSite),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      setOpen(false)
      toast.success("Site successfully created!", {
        description: `Client token generated: ${data.clientAccessId}`,
      })
      // Reset state
      setName("")
      setLocation("")
      setBudget("")
      setStartDate("")
      setEndDate("")
      setSupervisor("")
      setClientName("")
      setClientPhone("")
      setClientEmail("")
    },
    onError: () => {
      toast.error("Failed to create site.")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name,
      location,
      budgetTotal: Number(budget) || 0,
      startDate,
      endDate,
      supervisor,
      clientName,
      clientPhone,
      clientEmail
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 px-6">
            <Plus className="mr-2 h-4 w-4" /> Create New Site
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 text-white rounded-[2rem] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight italic">Initialize New Site</DialogTitle>
          <DialogDescription className="text-slate-500 text-xs">
            Enter the foundational details to start tracking this project on ConstWare.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Site Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Green Valley" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Budget (₹)</Label>
              <div className="relative">
                <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="budget" 
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000000" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Duration</Label>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary text-xs font-bold" 
                  required 
                />
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary text-xs font-bold" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="supervisor" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assign Supervisor</Label>
              <div className="relative">
                <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="supervisor" 
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  placeholder="Supervisor full name" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Client Name</Label>
              <div className="relative">
                <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="clientName" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client full name" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Client WhatsApp (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="clientPhone" 
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 9876543210" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Client Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="clientEmail" 
                  type="email" 
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com" 
                  className="pl-11 h-12 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-primary placeholder:text-slate-600 font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-500/5 p-4 border border-dashed border-emerald-500/20">
            <h4 className="text-xs font-black text-emerald-500 mb-1.5 flex items-center gap-2 uppercase tracking-widest italic">
              <UserPlus className="h-4 w-4" /> Client Portal Access
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              A unique 12-character Site ID (e.g., CW-ST-4029-ABCD) will be generated. The client can use this to track real-time progress without needing a password.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="h-12 rounded-xl border-slate-850 hover:bg-slate-900 text-slate-400"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white h-12 rounded-xl px-6 font-black uppercase tracking-widest text-[10px]"
            >
              {mutation.isPending ? "Generating Token..." : "Initialize Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
