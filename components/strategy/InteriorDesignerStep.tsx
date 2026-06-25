"use client"

import * as React from "react"
import { 
  Sparkles, 
  RotateCw, 
  Sun, 
  Moon, 
  Maximize2, 
  Camera, 
  ChevronRight, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface InteriorDesignerStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
  onCalculate: () => void
}

const DESIGN_PRESETS = [
  { id: 'modern', name: 'Ultra Modern', color: '#FFFFFF', accent: '#F97316' },
  { id: 'classic', name: 'Indian Classic', color: '#FFF5E1', accent: '#D4AF37' },
  { id: 'minimal', name: 'Minimal Zen', color: '#F8F9FA', accent: '#1A1A1A' }
]

export function InteriorDesignerStep({ formData, updateFormData, onNext, onBack, onCalculate }: InteriorDesignerStepProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selectedPreset, setSelectedPreset] = React.useState(DESIGN_PRESETS[0])
  const [autoRotate, setAutoRotate] = React.useState(true)
  const [activeMarker, setActiveMarker] = React.useState<string | null>("Living Room Vastu")

  // THREE.JS INIT
  React.useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const script = document.createElement('script')
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
    script.onload = () => init()
    document.head.appendChild(script)

    let renderer: any, scene: any, camera: any, interiorGroup: any

    const init = () => {
      const THREE = (window as any).THREE
      if (!THREE) return

      const width = containerRef.current!.clientWidth
      const height = containerRef.current!.clientHeight

      // Scene
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xF1F5F9) // Light grey background like image

      // Camera
      camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000)
      camera.position.set(25, 25, 25)
      camera.lookAt(0, 0, 0)

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambient)
      
      const frontLight = new THREE.DirectionalLight(0xffffff, 0.5)
      frontLight.position.set(10, 20, 10)
      scene.add(frontLight)

      // Interior Group
      interiorGroup = new THREE.Group()
      scene.add(interiorGroup)

      // Create Floor Plan (Base)
      const floorMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
      const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 12), floorMat)
      interiorGroup.add(floor)

      // Create Walls (Cutaway style)
      const wallMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
      
      // External Walls (Low height for cutaway)
      const wallH = 3
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, wallH, 0.4), wallMat)
      backWall.position.set(0, wallH/2, -6)
      interiorGroup.add(backWall)

      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, 12), wallMat)
      sideWall.position.set(-5, wallH/2, 0)
      interiorGroup.add(sideWall)

      // Internal Partitions
      const part1 = new THREE.Mesh(new THREE.BoxGeometry(4, wallH, 0.3), wallMat)
      part1.position.set(-3, wallH/2, 1)
      interiorGroup.add(part1)

      const part2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 5), wallMat)
      part2.position.set(1, wallH/2, -1)
      interiorGroup.add(part2)

      // Add Furniture Simplified placeholders to match image
      // Kitchen Counter
      const counter = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), new THREE.MeshLambertMaterial({ color: 0xEEEEEE }))
      counter.position.set(3.5, 0.6, -4)
      interiorGroup.add(counter)

      // Bed
      const bed = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 3.5), new THREE.MeshLambertMaterial({ color: 0xDDDDDD }))
      bed.position.set(-3, 0.4, -4)
      interiorGroup.add(bed)

      // Dining Table
      const table = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1.8), new THREE.MeshLambertMaterial({ color: 0xF97316 }))
      table.position.set(3, 0.5, 4)
      interiorGroup.add(table)

      // Renderer
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)

      let isDragging = false, prevX = 0, prevY = 0
      let rotY = -0.4

      const onStart = (clientX: number, clientY: number) => { isDragging = true; prevX = clientX; prevY = clientY; }
      const onMove = (clientX: number, clientY: number) => {
        if (!isDragging) return
        rotY += (clientX - prevX) * 0.007
        interiorGroup.rotation.y = rotY
        prevX = clientX; prevY = clientY
      }

      canvasRef.current!.addEventListener('mousedown', e => onStart(e.clientX, e.clientY))
      window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY))
      window.addEventListener('mouseup', () => { isDragging = false })

      const animate = () => {
        requestAnimationFrame(animate)
        if (autoRotate && !isDragging) interiorGroup.rotation.y += 0.002
        renderer.render(scene, camera)
      }
      animate()
    }

    return () => {
      if (renderer) renderer.dispose()
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] h-full overflow-hidden">
      
      {/* 3D CUTAWAY VIEW */}
      <div className="bg-[#F8FAFC] relative group flex flex-col h-full">
         <div ref={containerRef} className="flex-1 relative">
            <canvas ref={canvasRef} className="w-full h-full" />
            
            {/* FLOATING MARKERS (Sync with image) */}
            <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2">
               <button 
                  onClick={() => setActiveMarker("Living Room Vastu")}
                  className={cn("h-6 w-6 rounded-full border-4 border-white shadow-xl transition-all", activeMarker === "Living Room Vastu" ? "bg-primary scale-125" : "bg-slate-400 opacity-50")}
               />
               {activeMarker === "Living Room Vastu" && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white p-4 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                     <p className="text-[10px] font-bold text-primary uppercase mb-1">Vastu Sync</p>
                     <p className="text-sm font-bold text-slate-800 leading-tight">Living Room Vastu</p>
                     <p className="text-[10px] text-slate-500 mt-2">Optimal N-E placement for energy flow and natural light.</p>
                     <button className="text-[10px] font-bold text-primary mt-2 block hover:underline">Learn more</button>
                  </div>
               )}
            </div>

            <div className="absolute top-[30%] right-[30%] -translate-x-1/2 -translate-y-1/2">
               <button 
                  onClick={() => setActiveMarker("Kitchen Nodes")}
                  className={cn("h-6 w-6 rounded-full border-4 border-white shadow-xl transition-all", activeMarker === "Kitchen Nodes" ? "bg-primary scale-125" : "bg-slate-400 opacity-50")}
               />
               {activeMarker === "Kitchen Nodes" && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white p-4 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                     <p className="text-[10px] font-bold text-primary uppercase mb-1">Efficiency node</p>
                     <p className="text-sm font-bold text-slate-800 leading-tight">Kitchen Utility</p>
                     <p className="text-[10px] text-slate-500 mt-2">Space optimized for multi-user workflow.</p>
                  </div>
               )}
            </div>
         </div>

         {/* 3D CONTROLS */}
         <div className="absolute bottom-8 left-8 flex gap-3">
            <button 
               onClick={() => setAutoRotate(!autoRotate)}
               className={cn("h-10 px-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 text-[10px] font-bold uppercase flex items-center gap-2", autoRotate && "text-primary border-primary")}
            >
               <RotateCw className={cn("h-3 w-3", autoRotate && "animate-spin-slow")} /> Auto-Orbit
            </button>
            <button className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-navy">
               <Camera className="h-4 w-4" />
            </button>
         </div>
      </div>

      {/* SIDEBAR CONFIG (IMAGE SYNC) */}
      <div className="bg-white border-l border-slate-100 p-8 flex flex-col justify-between overflow-y-auto">
         <div className="space-y-10">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[9px] font-bold tracking-widest">Live Design Mode</Badge>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {formData.projectName || "S-442"}</label>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 leading-none tracking-tight italic uppercase">
                  Building <span className="text-primary not-italic">Homes</span>
               </h2>
               <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"From vision to reality. Browse our expert tips through informative visuals and useful checklists."</p>
            </div>

            <div className="space-y-6">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Preset</p>
                     <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                     {DESIGN_PRESETS.map(preset => (
                        <button
                           key={preset.id}
                           onClick={() => setSelectedPreset(preset)}
                           className={cn(
                              "w-full p-4 rounded-2xl flex items-center gap-4 border transition-all",
                              selectedPreset.id === preset.id ? "bg-white border-primary shadow-sm" : "bg-transparent border-transparent grayscale opacity-50"
                           )}
                        >
                           <div className="h-8 w-8 rounded-full border border-slate-200" style={{ backgroundColor: preset.color }} />
                           <div className="text-left">
                              <p className="text-xs font-bold text-slate-800">{preset.name}</p>
                              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">AI Profile</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration Sync</p>
                  <div className="grid grid-cols-2 gap-3">
                     <button className="h-12 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em]" onClick={onCalculate}>Estimate Cost</button>
                     <button className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase" onClick={onNext}>Final Report</button>
                  </div>
               </div>
            </div>
         </div>

         <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Unit Projection</p>
                  <p className="text-2xl font-black text-slate-900 italic">₹ XX,XX,XXX</p>
               </div>
               <Button variant="ghost" className="text-primary font-bold text-[10px] uppercase gap-2 hover:bg-transparent" onClick={onBack}>
                  Reset Details <ArrowRight className="h-3 w-3" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  )
}
