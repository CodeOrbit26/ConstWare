"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/shared/Badge"
import { Avatar } from "@/components/shared/Avatar"
import { 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Search, 
  Filter,
  Users,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { getCurrentUserId } from "@/lib/auth/mockAuth"
import { toast } from "sonner"

export default function SupervisorAttendancePage() {
  const [attendance, setAttendance] = React.useState<Record<string, 'present' | 'half_day' | 'absent' | null>>({})
  const [workers, setWorkers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [checkingIn, setCheckingIn] = React.useState(false)
  const [supervisorStatus, setSupervisorStatus] = React.useState<string>("Not Checked In")
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    async function loadData() {
      try {
        const userId = await getCurrentUserId()
        
        // Fetch Workers
        const workersRes = await fetch("/api/supervisor/workers", {
          headers: { "x-user-id": userId }
        })
        const workersJson = await workersRes.json()
        setWorkers(workersJson)

        // Fetch Attendance Logs to check today's status
        const attRes = await fetch("/api/supervisor/attendance", {
          headers: { "x-user-id": userId }
        })
        const attJson = await attRes.json()
        const todayStr = new Date().toISOString().split("T")[0]
        const todayCheckIn = attJson.find((log: any) => log.date === todayStr)
        if (todayCheckIn) {
          setSupervisorStatus("Checked In")
          setCoords({ lat: todayCheckIn.latitude, lng: todayCheckIn.longitude })
        }
      } catch (err) {
        console.error("Failed to load attendance page data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleMark = (workerId: string, status: 'present' | 'half_day' | 'absent') => {
    setAttendance(prev => ({ ...prev, [workerId]: status }))
  }

  const handleSupervisorCheckIn = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setCheckingIn(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userId = await getCurrentUserId()
          const { latitude, longitude } = position.coords

          const res = await fetch("/api/supervisor/attendance/check-in", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userId
            },
            body: JSON.stringify({
              latitude,
              longitude,
              status: "Present"
            })
          })

          if (res.ok) {
            setSupervisorStatus("Checked In")
            setCoords({ lat: latitude, lng: longitude })
            toast.success("Check-in successful! GPS coordinates locked.")
          } else {
            toast.error("Failed to submit check-in to server")
          }
        } catch (err) {
          toast.error("Error submitting check-in")
        } finally {
          setCheckingIn(false)
        }
      },
      (error) => {
        toast.error(`Geolocation error: ${error.message}`)
        setCheckingIn(false)
      }
    )
  }

  const handleCommitAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      toast.error("Please mark attendance for at least one worker.")
      return
    }

    try {
      const userId = await getCurrentUserId()
      const todayStr = new Date().toISOString().split("T")[0]

      const res = await fetch("/api/supervisor/attendance/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          date: todayStr,
          records: attendance
        })
      })

      if (res.ok) {
        toast.success("Workforce deployment roll call successfully committed!")
      } else {
        toast.error("Failed to commit attendance")
      }
    } catch (err) {
      toast.error("Error committing attendance")
    }
  }

  const getWorkerName = (w: any) => `${w.firstName || ""} ${w.lastName || ""}`.trim() || "Unknown Worker"

  const filteredWorkers = workers.filter(w => 
    getWorkerName(w).toLowerCase().includes(search.toLowerCase()) || 
    w.skill.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout title="Deployment: Site Roll Call">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Deployment: Site Roll Call">
      <div className="max-w-5xl mx-auto space-y-12 pb-40">
        
        {/* CINEMATIC HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 dark:border-slate-800 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Personnel Deployment
                 </span>
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
                 Operational <br /> <span className="text-primary not-italic">Roll Call</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">High-Utility Crew Attendance & Proximity Verification</p>
           </div>

           <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
              <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white shadow-premium-dark relative overflow-hidden group min-w-[180px]">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2">Crew Active</p>
                 <p className="text-4xl font-black italic tracking-tighter tabular-nums">{filteredWorkers.length}</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 shadow-premium group min-w-[180px]">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Committed Today</p>
                 <p className="text-4xl font-black italic tracking-tighter tabular-nums text-slate-900 dark:text-white">{Object.keys(attendance).length}</p>
              </div>
           </div>
        </div>

        {/* SUPERVISOR GEOLOCATION CHECK-IN */}
        <div className="bg-slate-900/60 p-8 rounded-[3rem] border border-primary/20 shadow-premium space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-black uppercase text-white tracking-wider">Supervisor Status</h3>
              <p className="text-xs text-slate-400 mt-1">Mark your daily presence using GPS Geolocation.</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={cn("px-4 py-2 uppercase font-black text-xs tracking-wider", supervisorStatus === "Checked In" ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" : "bg-rose-500/20 text-rose-500 border border-rose-500/30")}>
                {supervisorStatus}
              </Badge>
              {supervisorStatus === "Checked In" && coords && (
                <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                  GPS: {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                </span>
              )}
            </div>
          </div>
          {supervisorStatus !== "Checked In" && (
            <Button 
              onClick={handleSupervisorCheckIn} 
              disabled={checkingIn}
              className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-wider rounded-2xl transition-all"
            >
              {checkingIn ? "Acquiring GPS Telemetry..." : "Check In via GPS"}
            </Button>
          )}
        </div>

        {/* TACTICAL FILTERS */}
        <div className="flex flex-col md:flex-row gap-6 bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-premium">
           <div className="relative group flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                 placeholder="Search registry by skill or name..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="h-16 pl-16 bg-slate-50 dark:bg-slate-900/50 border-none rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-inner placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary/20" 
              />
           </div>
        </div>

        {/* WORKER REGISTRY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {filteredWorkers.map((worker) => (
             <div 
               key={worker.id} 
               className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/20 dark:border-slate-800/50 p-8 shadow-premium space-y-8 relative overflow-hidden group transition-all hover:translate-y-[-4px]"
             >
                 <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary transition-colors" />
                 
                 <div className="flex items-center gap-6">
                    <div className="relative">
                       <Avatar 
                         initials={getWorkerName(worker).substring(0,2).toUpperCase()} 
                         className="h-20 w-20 rounded-[1.5rem] border-4 border-white dark:border-slate-800 shadow-premium font-black text-xl"
                       />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate italic">{getWorkerName(worker)}</h4>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">₹{worker.dailyWage}/DAY</p>
                       </div>
                       <div className="flex flex-wrap items-center gap-4">
                          <Badge variant="outline" className="text-[9px] font-black px-4 py-1 rounded-full border-slate-100 dark:border-slate-800 uppercase tracking-widest leading-none h-6">{worker.skill}</Badge>
                       </div>
                    </div>
                 </div>

                 {/* TACTICAL ACTIONS */}
                 <div className="flex items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-950/50 rounded-[1.75rem] shadow-inner">
                    {[
                      { id: 'present', icon: Check, label: 'Full' },
                      { id: 'half_day', icon: Clock, label: 'Half' },
                      { id: 'absent', icon: X, label: 'Absent' }
                    ].map((btn) => (
                      <Button 
                         key={btn.id}
                         variant="ghost"
                         className={cn(
                           "flex-1 h-14 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] transition-all gap-2",
                           attendance[worker.id] === btn.id 
                             ? (btn.id === 'present' ? "bg-emerald-500 text-white shadow-premium-emerald hover:bg-emerald-600" : 
                                btn.id === 'half_day' ? "bg-amber-500 text-white shadow-premium-amber hover:bg-amber-600" : 
                                "bg-rose-500 text-white shadow-premium-rose hover:bg-rose-600")
                             : "bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                         )}
                         onClick={() => handleMark(worker.id, btn.id as any)}
                      >
                         <btn.icon className="h-4 w-4" /> {btn.label}
                      </Button>
                    ))}
                 </div>
              </div>
           ))}
        </div>

        {/* Global Save Button - CINEMATIC STICKY */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50">
           <Button 
              onClick={handleCommitAttendance}
              className="w-full h-20 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase tracking-[0.3em] shadow-premium-dark rounded-[2.5rem] border border-white/10 group overflow-hidden relative active:scale-95 transition-all"
           >
              <div className="relative z-10 flex items-center justify-center gap-4">
                 Commit Deployment
                 <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                    <span className="text-white text-xs">{Object.keys(attendance).length}</span>
                 </div>
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
           </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
