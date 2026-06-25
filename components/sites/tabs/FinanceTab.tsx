"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { SiteDetail, mockTransactions } from "@/lib/services/mockData"
import { DataTable, Column } from "@/components/shared/DataTable"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, Wallet, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function FinanceTab({ site }: { site: SiteDetail }) {
  const transactions = mockTransactions.filter(t => t.siteId === site.id)
  
  const chartData = [
    { name: "Labour", value: 45000 },
    { name: "Material", value: 120000 },
    { name: "Machinery", value: 8000 },
  ]

  const COLORS = ["#3B82F6", "#22C55E", "#F97316"]

  const columns: Column<typeof transactions[0]>[] = [
    { header: "Date", accessorKey: "date" },
    { header: "Description", accessorKey: "description", cell: (t) => <span className="font-semibold">{t.description}</span> },
    { header: "Category", cell: (t) => <span className="text-xs uppercase font-medium">{t.category}</span> },
    { header: "Amount", cell: (t) => <span className="font-bold text-danger">-{formatCurrency(t.amount)}</span> }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="bg-card rounded-card border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Expense Breakdown</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: unknown) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="lg:col-span-2 bg-card rounded-card border p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Budget vs Spent</h3>
            <div className="flex items-center gap-2 text-primary font-bold">
              <TrendingUp className="h-4 w-4" />
              <span>42% Utilization</span>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Total Budget</span>
                <span className="text-navy dark:text-white font-bold">{formatCurrency(site.budgetTotal)}</span>
              </div>
              <Progress value={42} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Spent</p>
                <p className="text-xl font-bold text-danger">{formatCurrency(173000)}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Balance Remaining</p>
                <p className="text-xl font-bold text-success">{formatCurrency(site.budgetTotal - 173000)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Recent Transactions
          </h3>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Expense
          </Button>
        </div>
        <DataTable data={transactions} columns={columns} keyExtractor={t => t.id} />
      </div>
    </div>
  )
}
