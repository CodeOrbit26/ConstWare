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
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Plus, Building2, MapPin, Wallet, UserPlus } from "lucide-react"
import { toast } from "sonner"

export function CreateSiteModal() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setOpen(false)
      toast.success("Site created successfully!")
      router.push("/contractor/sites/site-1") // Redirect to demo site
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Create New Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Initialize New Site</DialogTitle>
          <DialogDescription>
            Enter the foundational details to start tracking this project on ConstWare.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="E.g. Green Valley" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="location" placeholder="City, State" className="pl-10" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget (₹)</Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="budget" type="number" placeholder="50,00,000" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dates">Duration</Label>
              <div className="flex gap-2">
                <Input type="date" className="text-xs" required />
                <Input type="date" className="text-xs" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Assign Supervisor</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">Rahul Singh</SelectItem>
                  <SelectItem value="s2">Amit Patel</SelectItem>
                  <SelectItem value="s3">Suresh Kumar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client WhatsApp (Optional)</Label>
              <Input id="clientPhone" placeholder="+91 9876543210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email (Optional)</Label>
              <Input id="clientEmail" type="email" placeholder="client@example.com" />
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50/50 p-4 dark:bg-emerald-900/10 border border-dashed border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-500 mb-2 flex items-center gap-2 uppercase tracking-widest italic">
              <UserPlus className="h-4 w-4" /> Client Portal Access
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              A unique 12-character Site ID (e.g., CW-AB-260423-7K) will be generated. The client can use this to track real-time progress without needing a password.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Generating Token..." : "Initialize Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
