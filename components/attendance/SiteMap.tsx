"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet"
import L from "leaflet"
import { cn } from "@/lib/utils"

// No top-level Leaflet calls to avoid SSR issues

interface SiteMapProps {
  siteLocation: [number, number]
  userLocation?: [number, number]
  radius?: number // in meters
  className?: string
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap()
  React.useEffect(() => {
    map.setView(position)
  }, [position, map])
  return null
}

export default function SiteMap({ 
  siteLocation, 
  userLocation, 
  radius = 100,
  className 
}: SiteMapProps) {
  // Use state to handle client-side only rendering for Leaflet
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    
    // Fixing Leaflet default icon issues in Next.js (Client-side only)
    if (typeof window !== "undefined") {
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
      L.Marker.prototype.options.icon = DefaultIcon
    }
  }, [])

  if (!isMounted) {
    return (
      <div className={cn("bg-slate-50 dark:bg-slate-900 animate-pulse rounded-[2.5rem]", className)} />
    )
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl", className)}>
      <MapContainer
        center={siteLocation}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Site Location Marker (Orange) */}
        <Marker position={siteLocation}>
          <Popup>
            <div className="p-2">
              <p className="text-xs font-black uppercase text-navy">Project Site</p>
              <p className="text-[10px] text-slate-500">Authorized Radius: {radius}m</p>
            </div>
          </Popup>
        </Marker>

        {/* Attendance Radius Circle */}
        <Circle 
          center={siteLocation} 
          radius={radius} 
          pathOptions={{ 
            color: '#F97316', 
            fillColor: '#F97316', 
            fillOpacity: 0.1 
          }} 
        />

        {/* User Current Location (Blue Circle Marker if available) */}
        {userLocation && (
          <Circle 
            center={userLocation} 
            radius={5} 
            pathOptions={{ 
              color: '#3B82F6', 
              fillColor: '#3B82F6', 
              fillOpacity: 0.8 
            }} 
          >
            <Popup>
              <p className="text-[10px] font-black uppercase text-blue-600">Your Location</p>
            </Popup>
          </Circle>
        )}

        <RecenterMap position={siteLocation} />
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute top-4 right-4 z-[500] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[9px] font-black uppercase text-slate-500">Site Center</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[9px] font-black uppercase text-slate-500">Supervisor</span>
         </div>
         <div className="h-px bg-slate-100 my-1" />
         <div className="px-1">
            <p className="text-[8px] font-medium text-slate-400 italic leading-none">Geo-fencing Active</p>
         </div>
      </div>
    </div>
  )
}
