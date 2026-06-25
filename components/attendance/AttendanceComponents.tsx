"use client"

import * as React from "react"
import { Check, X, Clock } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/shared/DataTable"

type AttendanceStatus = 'present' | 'half_day' | 'absent'

interface AttendanceToggleProps {
  value: AttendanceStatus
  onChange: (value: AttendanceStatus) => void
}

export function AttendanceToggle({ value, onChange }: AttendanceToggleProps) {
  const cycle = () => {
    const states: AttendanceStatus[] = ['present', 'half_day', 'absent']
    const nextIndex = (states.indexOf(value) + 1) % states.length
    onChange(states[nextIndex])
  }

  const config = {
    present: { label: "PRESENT", icon: Check, className: "bg-success hover:bg-success/90 text-white" },
    half_day: { label: "HALF DAY", icon: Clock, className: "bg-warning hover:bg-warning/90 text-white" },
    absent: { label: "ABSENT", icon: X, className: "bg-danger hover:bg-danger/90 text-white" },
  }

  const { label, icon: Icon, className } = config[value]

  return (
    <button 
      onClick={cycle}
      className={cn(
        "flex h-9 w-32 items-center justify-center gap-2 rounded-md text-[10px] font-bold tracking-wider transition-all shadow-sm active:scale-95",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

interface WagePreviewData {
  id: string
  name: string
  status: 'present' | 'half_day' | 'absent'
  dailyWage: number
}

interface WagePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  data: WagePreviewData[]
}

export function WagePreviewModal({ open, onOpenChange, onConfirm, data }: WagePreviewModalProps) {
  const totalWage = data.reduce((acc, curr) => {
    const multiplier = curr.status === 'present' ? 1 : curr.status === 'half_day' ? 0.5 : 0
    return acc + (curr.dailyWage * multiplier)
  }, 0)

  const columns: Column<WagePreviewData>[] = [
    { header: "Worker Name", accessorKey: "name", cell: (r: WagePreviewData) => <span className="font-semibold">{r.name}</span> },
    { 
      header: "Status", 
      cell: (r: WagePreviewData) => (
        <span className={cn(
          "text-[10px] font-bold uppercase",
          r.status === 'present' ? "text-success" : r.status === 'half_day' ? "text-warning" : "text-danger"
        )}>
          {r.status.replace('_', ' ')}
        </span>
      ) 
    },
    { header: "Daily Wage", cell: (r: WagePreviewData) => formatCurrency(r.dailyWage) },
    { 
      header: "Today's Due", 
      cell: (r: WagePreviewData) => {
        const multiplier = r.status === 'present' ? 1 : r.status === 'half_day' ? 0.5 : 0
        return <span className="font-bold">{formatCurrency(r.dailyWage * multiplier)}</span>
      }
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Submit Attendance Summary</DialogTitle>
          <DialogDescription>
            Review the wage implications for today&apos;s workforce before finalizing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6 p-4 rounded-lg bg-navy text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Total Daily Wage Bill</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalWage)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto rounded-md border">
            <DataTable 
              data={data} 
              columns={columns} 
              keyExtractor={r => r.id}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={onConfirm}>
            Confirm &amp; Save Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { Wallet } from "lucide-react"
