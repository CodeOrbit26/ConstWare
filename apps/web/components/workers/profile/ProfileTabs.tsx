"use client"

import * as React from "react"
import { Star, Wallet, FileText, Clock } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { mockWorkerReviews, mockPagarRecords, PagarRecord } from "@/lib/services/mockData"
import { DataTable, Column } from "@/components/shared/DataTable"
import { Badge } from "@/components/shared/Badge"

export function ReviewsTab({ workerId }: { workerId: string }) {
  const reviews = mockWorkerReviews.filter(r => r.workerId === workerId)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Performance Reviews</h3>
        <span className="text-xs font-semibold text-muted-foreground">{reviews.length} total reviews</span>
      </div>
      
      <div className="grid gap-4">
        {reviews.map(review => (
          <div key={review.id} className="p-5 rounded-card border bg-card shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                  {review.reviewerName[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy dark:text-white">{review.reviewerName}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{review.siteName} • {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-3 w-3", 
                      i < review.rating ? "fill-warning text-warning" : "fill-slate-100 text-slate-200"
                    )} 
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">&quot;{review.comment}&quot;</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="py-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-slate-200" />
            <p className="text-xs text-slate-400 font-medium italic">No reviews recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function WagesTab({ workerId }: { workerId: string }) {
  const wages = mockPagarRecords.filter(p => p.workerId === workerId)
  
  const columns: Column<PagarRecord>[] = [
    { header: "Period", accessorKey: "period" },
    { header: "Days", accessorKey: "daysPresent" },
    { header: "OT Hours", accessorKey: "overtimeHours" },
    { header: "Advance", cell: (r) => <span className="text-danger font-medium">-{formatCurrency(r.advanceDeducted)}</span> },
    { header: "Net Amount", cell: (r) => <span className="font-bold">{formatCurrency(r.netPayable)}</span> },
    { 
      header: "Status", 
      cell: (r) => (
        <Badge variant={r.status === 'paid' ? 'success' : 'warning'} className="text-[10px] uppercase font-bold">
          {r.status}
        </Badge>
      ) 
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-card border bg-success/5 border-success/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-success/60 uppercase tracking-widest mb-1">Total Earned This Month</p>
            <h3 className="text-2xl font-black text-success">₹0</h3>
          </div>
          <Wallet className="h-10 w-10 text-success opacity-20" />
        </div>
        <div className="p-6 rounded-card border bg-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Balance</p>
            <h3 className="text-2xl font-black text-navy dark:text-white">₹0</h3>
          </div>
          <Clock className="h-10 w-10 text-warning opacity-20" />
        </div>
      </div>

      <div className="bg-card rounded-card border shadow-sm">
        <DataTable data={wages} columns={columns} keyExtractor={r => r.id} />
      </div>
    </div>
  )
}
