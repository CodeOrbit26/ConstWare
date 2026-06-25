"use client"

import * as React from "react"
import { clsx } from "clsx"
import { StatCard } from "@/components/shared/StatCard"
import { AlertCircle, CheckCircle2, Clock, Users, Wallet } from "lucide-react"
import { Badge } from "@/components/shared/Badge"
import { Button } from "@/components/ui/button"
import { SiteDetail, mockAlerts, mockDPRs, mockTransactions } from "@/lib/services/mockData"
import { formatCurrency } from "@/lib/utils"

export function OverviewTab({ site }: { site: SiteDetail }) {
  const siteAlerts = mockAlerts.filter(a => a.site === site.name)
  const todayDPR = mockDPRs.find(d => d.siteId === site.id && d.date === '2026-04-10')
  const recentExpenses = mockTransactions.filter(t => t.siteId === site.id).slice(0, 3)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Workers Today" value={site.workers} icon={Users} />
        <StatCard title="Today's Spend" value={formatCurrency(site.todayExpenses)} icon={Wallet} />
        <StatCard title="Days Remaining" value="45" icon={Clock} />
        <StatCard title="Progress" value={`${site.progress}%`} icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Alerts */}
          <div className="bg-card rounded-card border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Active Site Alerts</h3>
            {siteAlerts.length > 0 ? (
              <div className="space-y-3">
                {siteAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <div className={alert.severity === 'critical' ? 'text-danger' : 'text-warning'}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'danger' : 'warning'}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm italic">
                No active alerts for this site.
              </div>
            )}
          </div>

          {/* Today's DPR */}
          <div className="bg-card rounded-card border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Today&apos;s DPR Summary</h3>
            {todayDPR ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                  <p className="text-sm italic text-slate-700 dark:text-slate-300">&quot;{todayDPR.summary}&quot;</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" /> Submitted
                    </span>
                    <span className="text-muted-foreground">{todayDPR.photos?.length || 0} Photos attached</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Full Report</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4 font-medium">No report submitted for today yet.</p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Submit DPR Now
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Milestones */}
          <div className="bg-card rounded-card border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Milestones</h3>
            <div className="space-y-4">
              {site.milestones.map((m, idx) => (
                <div key={m.id} className="relative pl-10">
                  <div className={clsx(
                    "absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors",
                    m.completed ? "bg-success border-success text-white" : "bg-background border-slate-200 text-slate-300"
                  )}>
                    {m.completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                  </div>
                  {idx !== site.milestones.length - 1 && (
                    <div className="absolute left-3 top-7 h-calc-full w-0.5 bg-slate-100" style={{ height: 'calc(100% + 1rem)' }} />
                  )}
                  <div>
                    <h4 className={clsx("text-sm font-bold", m.completed ? "text-navy dark:text-white" : "text-slate-400")}>{m.title}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-card rounded-card border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {recentExpenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-xs font-bold">{exp.description}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{exp.date}</p>
                  </div>
                  <span className="text-xs font-bold text-danger">-{formatCurrency(exp.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
