"use client"

import * as React from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts"
import { ExpenseData } from "@/lib/services/mockData"
import { formatCurrency } from "@/lib/utils"

export function ExpenseTrendChart({ data }: { data: ExpenseData[] }) {
  return (
    <div className="h-[320px] md:h-[460px] w-full p-6 md:p-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl md:rounded-[3rem] shadow-premium border border-white/20 dark:border-slate-800/50 transition-all duration-700 hover:shadow-2xl group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32 rounded-full" />
      
      <div className="flex items-center justify-between mb-8 md:mb-12 relative z-10">
        <div>
          <h3 className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] md:tracking-[0.4em] mb-1 md:mb-2 leading-none">Capital Flows</h3>
          <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">Trend <span className="text-primary not-italic">Analytics</span></p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
           <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">7D Rolling</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="gradientLabour" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="gradientMaterial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="gradientMachinery" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" opacity={0.5} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 900, textTransform: 'uppercase' }}
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 900 }}
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(249, 115, 22, 0.05)', radius: [16, 16, 16, 16] }}
            contentStyle={{ 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              padding: '16px'
            }}
            itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            formatter={(value: unknown) => [formatCurrency(Number(value) || 0), '']}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={48}
            iconType="circle"
            wrapperStyle={{ 
              fontSize: '10px', 
              textTransform: 'uppercase', 
              fontWeight: 900, 
              letterSpacing: '0.2em',
              color: '#64748B',
              paddingBottom: '20px'
            }}
          />
          <Bar dataKey="Labour" stackId="a" fill="url(#gradientLabour)" radius={[0, 0, 0, 0]} barSize={32} />
          <Bar dataKey="Material" stackId="a" fill="url(#gradientMaterial)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Machinery" stackId="a" fill="url(#gradientMachinery)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
