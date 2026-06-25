"use client"

import * as React from "react"
import { Upload, Camera, FileImage, X } from "lucide-react"

export function UploadZone({ onPhotosChange }: { onPhotosChange: (photos: string[]) => void }) {
  const [previews, setPreviews] = React.useState<string[]>([])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      const newPreviews = [...previews, base64]
      setPreviews(newPreviews)
      onPhotosChange(newPreviews)
    }
    reader.readAsDataURL(file)
  }

  const removeRaw = (idx: number) => {
    const next = previews.filter((_, i) => i !== idx)
    setPreviews(next)
    onPhotosChange(next)
  }

  return (
    <div className="space-y-6">
      <div 
        onClick={() => document.getElementById('site-upload')?.click()}
        className="aspect-[3/1] border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:bg-slate-900/40 cursor-pointer transition-all group"
      >
        <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
           <Camera className="h-6 w-6" />
        </div>
        <div className="text-center">
           <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">Click to capture or upload site photo</p>
           <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase italic tracking-widest">Supports JPG, PNG for high-res structural scans</p>
        </div>
        <input id="site-upload" type="file" className="hidden" accept="image/*" onChange={handleFile} />
      </div>

      {previews.length > 0 && (
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {previews.map((p, i) => (
               <div key={i} className="h-24 w-24 shrink-0 rounded-2xl overflow-hidden relative group border-2 border-slate-800">
                  <img src={p} className="h-full w-full object-cover" alt="Upload preview" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeRaw(i); }}
                    className="absolute inset-0 bg-rose-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                  >
                     <X className="h-5 w-5 text-white" />
                  </button>
               </div>
            ))}
         </div>
      )}
    </div>
  )
}
