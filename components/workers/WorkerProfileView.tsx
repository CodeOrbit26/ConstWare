"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Star, 
  Calendar, 
  Wallet, 
  TrendingUp,
  Building2,
  FileBadge
} from "lucide-react"
import { mockWorkers, mockSites } from "@/lib/services/mockData"
import { StatCard } from "@/components/shared/StatCard"
import { WagesTab, ReviewsTab } from "@/components/workers/profile/ProfileTabs"
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory"
import { cn, formatCurrency } from "@/lib/utils"

export default function WorkerProfileView() {
  const params = useParams()
  const router = useRouter()
  const workerId = params.id as string
  const worker = mockWorkers.find(w => w.id === workerId)

  if (!worker) {
    return (
      <DashboardLayout title="Worker Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-bold mb-4">Worker not found</h2>
          <Button onClick={() => router.push("/contractor/workers")}>Back to Directory</Button>
        </div>
      </DashboardLayout>
    )
  }

  const assignedSite = mockSites.find(s => s.id === worker.assignedSiteId)
  const initials = worker.name.split(' ').map(n => n[0]).join('')

  return (
    <DashboardLayout title={`${worker.name} - Profile`}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <button 
              onClick={() => router.push("/contractor/workers")}
              className="md:hidden flex items-center gap-1 text-xs text-muted-foreground mr-auto mb-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <div className="relative">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-xl shadow-primary/20 transition-transform">
                {initials}
              </div>
              <div className={cn(
                "absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center",
                worker.status === 'available' ? 'bg-success' : 'bg-primary'
              )}>
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl font-black text-navy dark:text-white tracking-tight">{worker.name}</h1>
                <Badge className="bg-primary/10 text-primary border-none uppercase font-bold text-[10px] w-fit mx-auto sm:mx-0">
                  {worker.skill}
                </Badge>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-1 text-warning font-bold">
                  <Star className="h-4 w-4 fill-warning" />
                  {worker.rating}
                </div>
                {worker.kycVerified && (
                  <Badge variant="success" className="h-5 px-2 text-[8px] uppercase font-black tracking-widest">
                    KYC Verified
                  </Badge>
                )}
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Currently {worker.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 px-6 font-bold shadow-sm">
              <Phone className="h-4 w-4 mr-2" /> Call Worker
            </Button>
            <Button className="h-10 px-6 font-bold bg-navy hover:bg-navy/90 text-white shadow-lg shadow-navy/20">
              Assign to Site
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Sites" value={worker.completedProjects} icon={Building2} />
          <StatCard title="Days Worked" value={256} icon={Calendar} />
          <StatCard title="Total Earnings" value={formatCurrency(125000)} icon={Wallet} />
          <StatCard title="Reliability" value={`${worker.reliabilityScore}%`} icon={TrendingUp} iconClassName="text-success" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start gap-8 overflow-x-auto no-scrollbar">
            {["Overview", "Attendance", "Wages", "Reviews"].map(tab => (
              <TabsTrigger 
                key={tab}
                value={tab.toLowerCase()} 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none px-0 py-4 text-sm font-bold transition-all uppercase tracking-widest"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-card border bg-card shadow-sm space-y-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-4">Personal & Employment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-navy dark:text-white">+91 {worker.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aadhaar Status</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <p className="text-sm font-bold text-navy dark:text-white">Verified (**** **** 5432)</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Wage</p>
                        <p className="text-sm font-black text-primary">{formatCurrency(worker.dailyWage)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-[10px] uppercase">{worker.skill}</Badge>
                          <Badge variant="secondary" className="text-[10px] uppercase">Safety Certified</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-card border bg-card shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Assignment</h3>
                  {assignedSite ? (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 border flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy dark:text-white">{assignedSite.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{assignedSite.location}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-xs text-danger hover:bg-danger/5">Remove from Site</Button>
                    </div>
                  ) : (
                    <div className="py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3">
                      <p className="text-xs text-slate-400 font-medium italic">Not assigned to any site currently.</p>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-4">Assign Site</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 rounded-card border bg-navy text-white shadow-xl shadow-navy/20 space-y-6">
                   <div className="flex items-center gap-3">
                      <FileBadge className="h-6 w-6 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Reliability Score</h3>
                   </div>
                   <div className="flex flex-col items-center justify-center py-4">
                      <span className="text-5xl font-black text-white">{worker.reliabilityScore}%</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Excellent Performance</p>
                   </div>
                   <p className="text-[11px] text-slate-300 italic text-center leading-relaxed">
                     Score is calculated based on punctuality, site attendance, and supervisor ratings.
                   </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceHistory />
          </TabsContent>

          <TabsContent value="wages">
            <WagesTab workerId={worker.id} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab workerId={worker.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
