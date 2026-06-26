"use client"

import * as React from "react"
import { Plus, UserPlus, Phone, CreditCard, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { mockSites } from "@/lib/services/mockData"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCurrentUserId } from "@/lib/auth/mockAuth"

export function AddWorkerModal() {
  const [open, setOpen] = React.useState(false)
  const [assignToSite, setAssignToSite] = React.useState(false)
  const queryClient = useQueryClient()
  
  // Form State
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [skill, setSkill] = React.useState("Helper")
  const [dailyWage, setDailyWage] = React.useState("")
  const [assignedSiteId, setAssignedSiteId] = React.useState("")

  const mutation = useMutation({
    mutationFn: async (newWorker: any) => {
      const userId = await getCurrentUserId()
      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(newWorker),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] })
      setOpen(false)
      toast.success("Worker successfully registered!", {
        description: "Profile has been securely appended to the backend directory.",
      })
      // Reset form
      setName("")
      setPhone("")
      setSkill("Helper")
      setDailyWage("")
      setAssignedSiteId("")
    },
    onError: () => {
      toast.error("Failed to register worker", {
        description: "Communication with the data layer failed.",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (assignToSite && !assignedSiteId) {
      toast.error("Please select a site to assign the worker to.")
      return
    }
    
    mutation.mutate({
      name,
      phone,
      skill,
      dailyWage: Number(dailyWage),
      assignedSiteId: assignToSite ? assignedSiteId : null,
      status: assignToSite && assignedSiteId ? 'on_site' : 'available'
    })
  }

  const skills = ["Mason", "Carpenter", "Bar Bender", "Electrician", "Helper", "Plumber", "Painter", "Welder"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 px-6">
            <Plus className="h-4 w-4 mr-2" /> Add New Worker
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Register New Worker
          </DialogTitle>
          <DialogDescription>
            Enter the worker&apos;s basic details and KYC information to automatically post to the backend directory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="bg-slate-50 dark:bg-slate-800 border-none h-11" required />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" className="pl-9 bg-slate-50 dark:bg-slate-800 border-none h-11" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aadhaar (Optional)</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input placeholder="12-digit number" className="pl-9 bg-slate-50 dark:bg-slate-800 border-none h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Skill Category</Label>
              <Select value={skill} onValueChange={(val) => setSkill(val || "Helper")}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-none h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skills.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Daily Wage (₹)</Label>
              <Input value={dailyWage} onChange={(e) => setDailyWage(e.target.value)} type="number" placeholder="Eg. 500" className="bg-slate-50 dark:bg-slate-800 border-none h-11" required />
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Assign to Site</span>
              </div>
              <input 
                type="checkbox" 
                checked={assignToSite} 
                onChange={(e) => {
                  setAssignToSite(e.target.checked)
                  if (!e.target.checked) setAssignedSiteId("")
                }}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            {assignToSite && (
              <Select value={assignedSiteId} onValueChange={(val) => setAssignedSiteId(val || "")}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border-none h-10 mt-2 animate-in zoom-in-95 duration-200">
                  <SelectValue placeholder="Select current site..." />
                </SelectTrigger>
                <SelectContent>
                  {mockSites.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)} className="h-11 px-6">Cancel</Button>
            <Button 
                type="submit" 
                disabled={mutation.isPending}
                className={mutation.isPending ? "bg-slate-400 h-11 px-8 text-white font-bold" : "bg-primary hover:bg-primary/90 text-white h-11 px-8 font-bold"}
            >
              {mutation.isPending ? "Registering via API..." : "COMPLETE REGISTRATION"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
