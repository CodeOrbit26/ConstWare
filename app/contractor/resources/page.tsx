"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Package, Wrench } from "lucide-react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaterialsView } from "@/components/resources/MaterialsView"
import { MachineryView } from "@/components/resources/MachineryView"

export default function ResourcesConsolidatedPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'inventory'
  const [activeTab, setActiveTab] = React.useState(initialTab)

  React.useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  return (
    <DashboardLayout title="Supply Chain & Fleet Intelligence">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          {/* TAB NAVIGATION - CINEMATIC */}
          <div className="flex justify-center">
            <TabsList className="h-20 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-premium-lg gap-2">
              <TabsTrigger 
                value="inventory" 
                className="h-16 px-8 rounded-3xl data-[state=active]:bg-slate-950 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-950 transition-all font-black uppercase text-[10px] tracking-[0.2em] gap-3"
              >
                <Package size={16} /> Inventory Hub
              </TabsTrigger>
              <TabsTrigger 
                value="fleet" 
                className="h-16 px-8 rounded-3xl data-[state=active]:bg-slate-950 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-950 transition-all font-black uppercase text-[10px] tracking-[0.2em] gap-3"
              >
                <Wrench size={16} /> Machinery Arsenal
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="inventory" className="mt-0 focus-visible:ring-0">
             <MaterialsView />
          </TabsContent>

          <TabsContent value="fleet" className="mt-0 focus-visible:ring-0">
             <MachineryView />
          </TabsContent>
        </Tabs>

      </div>
    </DashboardLayout>
  )
}
