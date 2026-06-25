"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { MapPin, Share2, ArrowLeft } from "lucide-react"
import { mockSites } from "@/lib/services/mockData"
import { OverviewTab } from "@/components/sites/tabs/OverviewTab"
import { WorkforceTab, MaterialsTab } from "@/components/sites/tabs/SiteTabContent"
import { FinanceTab } from "@/components/sites/tabs/FinanceTab"
import { DPRTab, GalleryTab } from "@/components/sites/tabs/DPRGalleryTabs"
import { SettingsTab } from "@/components/sites/tabs/SettingsTab"
import { WeatherWidget } from "@/components/weather/WeatherWidget"
import { toast } from "sonner"

export default function SiteDetailView() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.id as string
  
  const site = mockSites.find(s => s.id === siteId)

  if (!site) {
    return (
      <DashboardLayout title="Site Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-bold mb-4">Site not found</h2>
          <Button onClick={() => router.push("/contractor/sites")}>Back to Sites</Button>
        </div>
      </DashboardLayout>
    )
  }

  const handleShareToken = () => {
    navigator.clipboard.writeText(`Token: ${site.clientToken}`)
    toast.success("Client access token copied to clipboard")
  }

  return (
    <DashboardLayout title={site.name}>
      <div className="space-y-6">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => router.push("/contractor/sites")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-3 w-3" /> All Sites
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-navy dark:text-white">{site.name}</h2>
              <Badge variant={site.status === 'active' ? 'success' : 'warning'} className="capitalize">
                {site.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {site.location}
            </div>
          </div>
          <Button onClick={handleShareToken} variant="outline" className="bg-white dark:bg-slate-900 shadow-sm border-primary/20 text-primary">
            <Share2 className="h-4 w-4 mr-2" /> Share Client Link
          </Button>
        </div>

        {/* SITE WEATHER INTELLIGENCE */}
        <WeatherWidget />

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start gap-6 overflow-x-auto no-scrollbar">
            {["Overview", "Workforce", "Materials", "Finance", "DPR", "Gallery", "Settings"].map(tab => (
              <TabsTrigger 
                key={tab}
                value={tab.toLowerCase()} 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none px-0 py-3 text-sm font-medium transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab site={site} />
          </TabsContent>
          <TabsContent value="workforce">
            <WorkforceTab siteId={site.id} />
          </TabsContent>
          <TabsContent value="materials">
            <MaterialsTab siteId={site.id} />
          </TabsContent>
          <TabsContent value="finance">
            <FinanceTab site={site} />
          </TabsContent>
          <TabsContent value="dpr">
            <DPRTab siteId={site.id} />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab site={site} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
