"use client"

import * as React from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { mockWorkers } from "@/lib/services/mockData"
import { cn, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Wallet, Clock, UserCheck } from "lucide-react"

export function AttendanceHistory() {
  const [selectedWorker, setSelectedWorker] = React.useState(mockWorkers[0].id)
  const worker = mockWorkers.find(w => w.id === selectedWorker)
  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  // Simulated history data
  const history = [
    { day: 1, status: 'present' },
    { day: 2, status: 'present' },
    { day: 3, status: 'half_day' },
    { day: 4, status: 'absent' },
    { day: 5, status: 'present' },
    { day: 8, status: 'present' },
    { day: 9, status: 'present' },
    { day: 10, status: 'present' },
  ]

  const stats = {
    present: history.filter(h => h.status === 'present').length,
    half: history.filter(h => h.status === 'half_day').length,
    absent: history.filter(h => h.status === 'absent').length,
    overtime: 12,
    totalWage: (history.length * (worker?.dailyWage || 0)) - (history.filter(h => h.status === 'absent').length * (worker?.dailyWage || 0))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-card border shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-bold text-slate-500 uppercase flex-shrink-0">Select Worker:</label>
          <Select value={selectedWorker} onValueChange={(val) => val && setSelectedWorker(val)}>
            <SelectTrigger className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 border-none">
              <SelectValue placeholder="Search worker..." />
            </SelectTrigger>
            <SelectContent>
              {mockWorkers.map(w => (
                <SelectItem key={w.id} value={w.id}>{w.name} ({w.skill})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <CalendarIcon className="h-4 w-4" /> April 2026
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-success" /> Present Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{stats.present}</span>
            <span className="text-xs text-muted-foreground ml-2">days this month</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" /> Overtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{stats.overtime}</span>
            <span className="text-xs text-muted-foreground ml-2">hours total</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" /> Monthly Wage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{formatCurrency(stats.totalWage)}</span>
            <span className="text-xs text-muted-foreground ml-2">due today</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-danger" /> Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-danger">{stats.absent}</span>
            <span className="text-xs text-muted-foreground ml-2">unpaid days</span>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-card border shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Attendance Calendar</h3>
        <div className="grid grid-cols-7 gap-3">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400">{day}</div>
          ))}
          {days.map(day => {
            const dayRecord = history.find(h => h.day === day)
            return (
              <div 
                key={day}
                className={cn(
                  "aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-default",
                  dayRecord?.status === 'present' && "bg-success/10 border-success/30",
                  dayRecord?.status === 'half_day' && "bg-warning/10 border-warning/30",
                  dayRecord?.status === 'absent' && "bg-danger/10 border-danger/30 font-sans font-bold",
                  !dayRecord && "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                )}
              >
                <span className={cn("text-xs font-bold", dayRecord ? "text-navy dark:text-white" : "text-slate-300")}>{day}</span>
                {dayRecord && (
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    dayRecord.status === 'present' && "bg-success",
                    dayRecord.status === 'half_day' && "bg-warning",
                    dayRecord.status === 'absent' && "bg-danger"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
