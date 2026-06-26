"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { MapPin, Share2, ArrowLeft, ShieldAlert } from "lucide-react"
import { OverviewTab } from "@/components/sites/tabs/OverviewTab"
import { WorkforceTab, MaterialsTab } from "@/components/sites/tabs/SiteTabContent"
import { FinanceTab } from "@/components/sites/tabs/FinanceTab"
import { DPRTab, GalleryTab } from "@/components/sites/tabs/DPRGalleryTabs"
import { SettingsTab } from "@/components/sites/tabs/SettingsTab"
import { WeatherWidget } from "@/components/weather/WeatherWidget"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUserId } from "@/lib/auth/mockAuth"

export default function SiteDetailView() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.id as string
  
  const { data: sites = [], isLoading } = useQuery<any[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      const res = await fetch('/api/sites', {
        headers: {
          'x-user-id': userId
        }
      })
      if (!res.ok) throw new Error('Failed to fetch sites')
      return res.json()
    }
  })

  const site = React.useMemo(() => {
    return sites.find(s => s.id === siteId)
  }, [sites, siteId])

  const handleShareToken = () => {
    if (!site) return
    const token = site.clientAccessId || site.siteAccessCode || site.clientToken
    navigator.clipboard.writeText(`Token: ${token}`)
    toast.success("Client access token copied to clipboard!", {
      description: `Access token: ${token}`,
    })
  }

  // 1. Premium Loading Skeleton
  if (isLoading) {
    return (
      <DashboardLayout title="Syncing Node...">
        <div className="space-y-8 animate-pulse p-2 text-left">
          <div className="flex flex-col gap-2.5">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          
          <div className="h-36 w-full bg-slate-200 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 rounded-[2.5rem]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-850 rounded-[1.5rem]" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // 2. Beautifully Designed Error/Not-Found State
  if (!site && !isLoading) {
    return (
      <DashboardLayout title="Terminal Error">
        <div className="flex items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-500">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-rose-500/20 rounded-[2.5rem] p-8 text-center space-y-6 shadow-xl dark:shadow-2xl dark:shadow-rose-500/5">
            <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-550/20 flex items-center justify-center mx-auto shadow-inner text-rose-500 animate-bounce">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 leading-none">Coordinates Lost</span>
              <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight italic pt-1">Site Not Found</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                The requested project node identifier <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-mono text-[10px] border border-slate-200 dark:border-slate-800">{siteId}</code> is not registered on your secure telemetry grid.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => router.push("/contractor/sites")}
                className="w-full h-12 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Return to Cluster Registry
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // 3. Premium View Details Page Design
  return (
    <DashboardLayout title={site.name}>
      <div className="space-y-8 text-left animate-in fade-in duration-500">
        
        {/* Breadcrumb & Actions Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="space-y-2">
            <button 
              onClick={() => router.push("/contractor/sites")}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Registry
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-black text-navy dark:text-white uppercase tracking-tight italic leading-none">{site.name}</h2>
              <Badge variant={site.status === 'active' ? 'success' : 'warning'} className="rounded-xl px-3 py-1 font-bold text-[9px] uppercase tracking-widest leading-none">
                {site.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              {site.location}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleShareToken} 
              className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest h-12 px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Copy Client Token
            </Button>
          </div>
        </div>

        {/* WEATHER INTELLIGENCE STATION */}
        <WeatherWidget />

        {/* Tactical Sub-Modules Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 w-full justify-start gap-6 overflow-x-auto no-scrollbar">
            {["Overview", "Workforce", "Materials", "Finance", "DPR", "Gallery", "Settings"].map(tab => (
              <TabsTrigger 
                key={tab}
                value={tab.toLowerCase()} 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none px-0 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all text-slate-450 dark:text-slate-500 hover:text-navy dark:hover:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="outline-none">
            <OverviewTab site={site} />
          </TabsContent>
          <TabsContent value="workforce" className="outline-none">
            <WorkforceTab siteId={site.id} />
          </TabsContent>
          <TabsContent value="materials" className="outline-none">
            <MaterialsTab siteId={site.id} />
          </TabsContent>
          <TabsContent value="finance" className="outline-none">
            <FinanceTab site={site} />
          </TabsContent>
          <TabsContent value="dpr" className="outline-none">
            <DPRTab siteId={site.id} />
          </TabsContent>
          <TabsContent value="gallery" className="outline-none">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="settings" className="outline-none">
            <SettingsTab site={site} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
