"use client"

import * as React from "react"
import { SiteDetail } from "@/lib/services/mockData"
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
import { Link2, Trash2, Archive, RefreshCcw, Save } from "lucide-react"
import { toast } from "sonner"
import { ClientAccessCard } from "../ClientAccessCard"

export function SettingsTab({ site }: { site: SiteDetail }) {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      {/* Basic Settings */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input defaultValue={site.name} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input defaultValue={site.location} />
          </div>
          <div className="space-y-2 flex-1">
            <Label>Budget (₹)</Label>
            <Input type="number" defaultValue={site.budgetTotal} />
          </div>
          <div className="space-y-2 flex-1">
            <Label>Status</Label>
            <Select defaultValue={site.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Project Description</Label>
          <Textarea defaultValue={site.description} className="min-h-[100px]" />
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </section>

      {/* Client Portal Settings */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] italic">Operational Transparency</h3>
        
        <ClientAccessCard 
          siteId={site.id}
          siteName={site.name}
          existingAccessId={(site as any).client_access_id}
          existingEnabled={(site as any).client_access_enabled}
          existingClientName={(site as any).client_name}
          existingClientPhone={(site as any).client_phone}
          existingClientEmail={(site as any).client_email}
          contractorName="Abhay Sharma" 
          companyName="Sharma Builders"
        />
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pt-6 border-t font-sans">
        <h3 className="text-sm font-bold text-danger uppercase tracking-widest">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="text-warning border-warning/20 hover:bg-warning/10">
            <Archive className="h-4 w-4 mr-2" /> Archive Project
          </Button>
          <Button variant="outline" className="text-danger border-danger/20 hover:bg-danger/10">
            <Trash2 className="h-4 w-4 mr-2" /> Delete Site Data
          </Button>
        </div>
      </section>
    </div>
  )
}
