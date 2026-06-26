"use client"

import * as React from "react"
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  Wind, 
  Droplets, 
  Thermometer,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Wind as WindIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

import { fetchWeatherData } from "@/lib/services/apiServices"

interface WeatherItem {
  dt: number
  main: { temp: number; humidity: number }
  weather: [{ main: string; description: string; icon: string }]
  wind: { speed: number }
}

interface WeatherWidgetProps {
  lat?: number
  lng?: number
}

export function WeatherWidget({ lat, lng }: WeatherWidgetProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchWeatherData(String(lat || ""), String(lng || "")),
    refetchInterval: 1000 * 60 * 60 * 3, // 3 hours
  })

  if (isLoading || !data) {
    return (
      <div className="h-48 w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-[2rem] border border-slate-100 dark:border-slate-800" />
    )
  }

  const current = data.list[0] as WeatherItem
  const forecast = data.list.slice(1, 10) as WeatherItem[] // Next ~24 hours

  // Smart Alerts
  const alerts = []
  if (current.main.temp > 42) alerts.push({ type: "heat", msg: "Extreme Heat: Hydration critical" })
  if (current.wind.speed > 40) alerts.push({ type: "wind", msg: "Strong Winds: Halt crane activity" })
  if (current.weather[0].main === "Rain") alerts.push({ type: "rain", msg: "Rain: Cover materials" })

  return (
    <div 
      className="relative overflow-hidden rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
      style={{ background: "linear-gradient(135deg, #ffffff, #F8FAFC)" }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        
        {/* CURRENT WEATHER */}
        <div className="flex items-center gap-6 pr-8 md:border-r border-slate-100 dark:border-slate-800">
           <div className="h-20 w-20 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-navy/5 flex items-center justify-center relative group">
              <img 
                src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} 
                alt="weather"
                className="h-16 w-16 group-hover:scale-110 transition-transform"
              />
           </div>
           <div className="space-y-1">
              <p className="text-4xl font-black text-navy dark:text-white tracking-tighter">{Math.round(current.main.temp)}°C</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{current.weather[0].description}</p>
           </div>
        </div>

        {/* METRICS */}
        <div className="flex-1 grid grid-cols-3 gap-6">
           <WeatherMetric icon={Droplets} label="Humidity" value={`${Math.round(current.main.humidity)}%`} />
           <WeatherMetric icon={WindIcon} label="Wind Speed" value={`${Math.round(current.wind.speed)} km/h`} />
           <WeatherMetric icon={TrendingUp} label="Pressure" value="1012 hPa" />
        </div>

        {/* ALERTS */}
        {alerts.length > 0 && (
           <div className="flex flex-col gap-2">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger rounded-xl border border-danger/10">
                   <AlertCircle className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-tight">{alert.msg}</span>
                </div>
              ))}
           </div>
        )}
      </div>

      {/* HORIZONTAL FORECAST */}
      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex gap-6 overflow-x-auto no-scrollbar pb-2">
         {forecast.map((item, i) => (
           <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                {new Date(item.dt * 1000).getHours()}:00
              </p>
              <img 
                 src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                 className="h-8 w-8 opacity-60" 
                 alt="forecast"
              />
              <p className="text-xs font-black text-navy dark:text-white">{Math.round(item.main.temp)}°</p>
           </div>
         ))}
         <div className="flex-1" />
         <button className="h-full px-4 flex items-center gap-2 group">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">5-Day Outlook</span>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  )
}

function WeatherMetric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-slate-400">
         <Icon className="h-3.5 w-3.5" />
         <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-black text-navy dark:text-white">{value}</p>
    </div>
  )
}
