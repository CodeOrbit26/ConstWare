"use client"

import * as React from "react"
import { RotateCw, Eye, EyeOff, ArrowLeft, Zap, Activity, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExteriorDesignStepProps {
  formData: any; updateFormData: (data: any) => void; onNext: () => void
  onBack: () => void; onCalculate: () => void; blueprintData?: any
}

export function ExteriorDesignStep({ formData, updateFormData, onNext, onBack, onCalculate, blueprintData }: ExteriorDesignStepProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [showRoof, setShowRoof] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [autoRotate, setAutoRotate] = React.useState(true)
  const zoomRef = React.useRef(44)
  const camRef = React.useRef<any>(null)
  const updateCamRef = React.useRef<() => void>(() => {})
  const area = Number(formData.area_sqft) || 3500

  // Floating HTML Tags state
  const [tags, setTags] = React.useState<any[]>([])
  
  const materialInfo = [
    { id: 't1', name: 'AAC Block', brand: 'Ultratech / Nuvoco', rate: '₹45/sqft', rating: '★★★★☆', bestFor: 'Thermal insulation, lightweight', pos: { x: -11.0, y: 1.8, z: 0 } },
    { id: 't2', name: 'Carrara Marble', brand: 'Kajaria Vitrified', rate: '₹140/sqft', rating: '★★★★★', bestFor: 'Living & Dining areas, glossy finish', pos: { x: -5.5, y: 0.1, z: 4.0 } },
    { id: 't3', name: 'Oak Wood Flooring', brand: 'Greenply Engineered', rate: '₹220/sqft', rating: '★★★★☆', bestFor: 'Bedrooms, warm aesthetics', pos: { x: -5.5, y: 0.1, z: -4.0 } },
    { id: 't4', name: 'Acrylic Shutters', brand: 'Rehau / Hettich', rate: '₹1200/sqft', rating: '★★★★★', bestFor: 'Modular high-gloss kitchens', pos: { x: 7.7, y: 2.2, z: 2.0 } },
    { id: 't5', name: 'Red Clay Brick', brand: 'Local Kiln Grade A', rate: '₹8/piece', rating: '★★★☆☆', bestFor: 'Traditional load-bearing exterior', pos: { x: 0.0, y: 1.2, z: -8.0 } }
  ]

  React.useEffect(() => { const t = setTimeout(() => setIsLoading(false), 2200); return () => clearTimeout(t) }, [])

  React.useEffect(() => {
    if (isLoading || !canvasRef.current || !containerRef.current) return
    let renderer: any, scene: any, camera: any, house: any, frameId: number

    // ══════ CAMERA ORBIT STATE (spherical coords) ══════
    // azimuth = horizontal angle (unlimited 360°)
    // polar = vertical angle from top (clamped 15°–80°)
    let azimuth = Math.PI * 0.75   // initial horizontal angle
    let polar = Math.PI * 0.30     // initial vertical (~55° from top)
    let radius = zoomRef.current   // camera distance
    let drag = false, px = 0, py = 0

    // Clamp constants
    const MIN_POLAR = 0.26  // ~15° from top (near top-down) 
    const MAX_POLAR = 1.40  // ~80° from top (near horizon, never flips)
    const PIVOT = { x: 0, y: 1.0, z: 0 }  // center of floor slab

    const build = () => {
      const T = (window as any).THREE; if (!T) return
      if (!canvasRef.current || !containerRef.current) return  // guard against unmount
      const vw = containerRef.current!.clientWidth, vh = containerRef.current!.clientHeight

      // ══════ SCENE ══════
      scene = new T.Scene()
      scene.background = new T.Color(0xE0D5C8)

      // ══════ 3-POINT LIGHTING ══════
      const sun = new T.DirectionalLight(0xFFF0D0, 1.8)
      sun.position.set(25, 60, 35)
      sun.castShadow = true
      sun.shadow.mapSize.set(4096, 4096)
      const sc = 35
      sun.shadow.camera.left = -sc; sun.shadow.camera.right = sc
      sun.shadow.camera.top = sc; sun.shadow.camera.bottom = -sc
      sun.shadow.camera.near = 1; sun.shadow.camera.far = 180
      sun.shadow.bias = -0.001; sun.shadow.normalBias = 0.03
      sun.shadow.radius = 3
      scene.add(sun)

      // 2. Cool blue fill from bottom-right — contrast on shadow sides
      const fill = new T.DirectionalLight(0x8AA8D0, 0.4)
      fill.position.set(-20, 8, -25)
      scene.add(fill)

      // 3. Subtle ambient — NOT flat, just enough to prevent pure black
      scene.add(new T.AmbientLight(0xC8C0B8, 0.25))

      // Hemisphere for ground bounce
      scene.add(new T.HemisphereLight(0xF0E8DD, 0x8A7A6A, 0.15))

      // ══════ CAMERA (orbit around pivot) ══════
      camera = new T.PerspectiveCamera(20, vw / vh, 0.1, 500)
      // Position will be set by updateCamera() below
      camRef.current = camera

      // Helper: compute camera position from spherical coords
      const updateCamera = () => {
        radius = zoomRef.current
        const x = PIVOT.x + radius * Math.sin(polar) * Math.cos(azimuth)
        const y = PIVOT.y + radius * Math.cos(polar)
        const z = PIVOT.z + radius * Math.sin(polar) * Math.sin(azimuth)
        camera.position.set(x, Math.max(1.5, y), z)
        camera.lookAt(PIVOT.x, PIVOT.y, PIVOT.z)
      }
      updateCamera()
      updateCamRef.current = updateCamera  // expose for zoom buttons

      // ══════ HOUSE GROUP (stationary — NEVER rotated) ══════
      house = new T.Group()
      scene.add(house)

      // ══════ MATERIALS — Real Indian Construction ══════
      const M = (c: number, r = 0.85, m = 0) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m })
      const EDGE_COLOR = 0x6B5A4A

      // WALLS — Red clay brick exterior + warm ivory plaster interior
      const mOuterWall = M(0x9E4A2A, 0.92)        // red clay brick
      const mInnerWall = M(0xF2E8D9, 0.88)         // Dulux warm ivory plaster
      const mAccent    = M(0xD4C0A0, 0.78)          // sand plaster feature wall

      // FLOORS — per room type
      const mFloorMarble = M(0xECE6DE, 0.18, 0.04)  // Carrara white marble — glossy
      const mFloorWood   = M(0xB8935E, 0.68)         // warm oak engineered wood
      const mKitchTile   = M(0xBCB8B0, 0.80)         // anti-skid light grey ceramic
      const mSlab        = M(0xA89888, 0.92)          // base concrete slab

      // CEILING — POP false ceiling
      const mCeiling     = M(0xFAF8F5, 0.90)         // white POP
      const mCoveLED     = new T.MeshBasicMaterial({ color: 0xFFF0C8 }) // warm cove light glow

      // FURNITURE — dark & contrasty
      const mDarkWood  = M(0x4A2810, 0.45)          // dark walnut teak
      const mMedWood   = M(0x7A5030, 0.52)          // medium teak
      const mLightWood = M(0xA88050, 0.48)          // light pine
      const mCharcoal  = M(0x3A3A3A, 0.72)          // dark charcoal fabric sofa
      const mDeepGrey  = M(0x555555, 0.65)          // deep grey
      const mSheet     = M(0xF0ECE5, 0.92)          // white cotton bedsheet
      const mDuvet     = M(0xC8B8A0, 0.78)          // beige linen duvet
      const mPillow    = M(0xFAF5EE, 0.88)          // off-white pillow
      const mSofa      = M(0x3D3D38, 0.75)          // charcoal fabric with weave
      const mCush      = M(0x5A5A55, 0.78)          // darker cushions
      const mRug       = M(0x9A8A72, 0.95)          // beige rug
      const mGranite   = M(0x1A1815, 0.25, 0.06)    // black granite countertop
      const mCab       = M(0xF5F2EE, 0.12, 0.02)    // high-gloss white acrylic
      const mSteel     = M(0xC0C0C0, 0.12, 0.80)    // stainless steel  
      const mBronze    = M(0x5A4030, 0.40, 0.30)     // dark bronze UPVC frames
      const mGlass     = new T.MeshPhysicalMaterial({ color: 0x88A898, transparent: true, opacity: 0.30, roughness: 0.05, metalness: 0.1, transmission: 0.7 }) // tinted green-grey
      const mDot       = new T.MeshBasicMaterial({ color: 0xF5C518 })
      const mPlant     = M(0x3A6A2D, 0.85)
      const mPot       = M(0x9A6030, 0.55)
      const mCurtain   = M(0xE8E0D5, 0.95)           // sheer ivory curtain
      const mLamp      = M(0xFFF0C0, 0.25, 0.1)      // warm 3000K LED glow
      const mChair     = M(0xC0AA88, 0.72)            // beige upholstery
      const mBrass     = M(0xC8A040, 0.30, 0.60)      // brass door handles
      const mWhiteLam  = M(0xF0EDE8, 0.35)            // white laminate flush doors
      const mTeakDoor  = M(0x5A3015, 0.40)             // solid teak main door

      // Edge line material
      const edgeMat = new T.LineBasicMaterial({ color: EDGE_COLOR, linewidth: 1 })
      const edgeMatDark = new T.LineBasicMaterial({ color: 0x5A4A3A, linewidth: 1 })
      const edgeMatFurn = new T.LineBasicMaterial({ color: 0x3A2A1A, linewidth: 1 })

      // ══════ DIMENSIONS ══════
      const W = 22, D = 16, wH = 3.2, wT = 0.40, fT = 0.25

      // ══════ HELPER: Box with edge outlines ══════
      const B = (w: number, h: number, d: number, mat: any, x: number, y: number, z: number, edgeM?: any) => {
        const geo = new T.BoxGeometry(w, h, d)
        const mesh = new T.Mesh(geo, mat)
        mesh.position.set(x, y, z)
        mesh.castShadow = true; mesh.receiveShadow = true
        house.add(mesh)

        // Add edge outlines
        if (edgeM !== false) {
          const edges = new T.EdgesGeometry(geo, 15) // threshold angle 15°
          const line = new T.LineSegments(edges, edgeM || edgeMat)
          line.position.set(x, y, z)
          house.add(line)
        }
        return mesh
      }
      const bY = fT

      // ══════ GROUND ══════
      const gnd = new T.Mesh(new T.PlaneGeometry(140, 140), M(0xD0C8BE, 1.0))
      gnd.rotation.x = -Math.PI / 2; gnd.position.y = -0.02; gnd.receiveShadow = true
      scene.add(gnd)

      // ══════ FLOOR SLAB ══════
      B(W + 1.2, fT, D + 1.2, mSlab, 0, fT / 2, 0, edgeMat)

      if (showRoof) {
        B(W, wH, D, mOuterWall, 0, bY + wH / 2, 0)
        for (let i of [-5.5, 0, 5.5]) { const wn = new T.Mesh(new T.PlaneGeometry(2.5, 1.7), mGlass); wn.position.set(i, bY + wH * 0.55, D / 2 + 0.21); house.add(wn) }
        B(W + 1, 0.4, D + 1, M(0x6A5A48, 0.55), 0, bY + wH + 0.2, 0)
        B(1.8, 2.5, 0.12, M(0x5A3820, 0.5), 0, bY + 1.25, D / 2 + 0.21)
      } else {
        // ════════════════════════════════════
        // CUTAWAY INTERIOR WITH EDGE OUTLINES
        // ════════════════════════════════════

        const Wall = (w: number, d: number, x: number, z: number, m?: any, edge?: any) =>
          B(w, wH, d, m || mOuterWall, x, bY + wH / 2, z, edge || edgeMat)

        // ── OUTER WALLS ──
        Wall(W, wT, 0, -D / 2)
        Wall(wT, D, -W / 2, 0)
        Wall(wT, D * 0.40, W / 2, -D * 0.30)
        Wall(wT, D * 0.42, W / 2, D * 0.29)
        Wall(W * 0.28, wT, -W * 0.36, D / 2)
        Wall(W * 0.28, wT, W * 0.36, D / 2)

        // ── INNER WALLS (20cm thick, clearly visible) ──
        Wall(W * 0.46, wT * 0.75, -W * 0.27, -D * 0.06, mInnerWall, edgeMatDark)
        Wall(W * 0.36, wT * 0.75, W * 0.32, -D * 0.06, mInnerWall, edgeMatDark)
        Wall(wT * 0.75, D * 0.44, 0.5, -D * 0.28, mInnerWall, edgeMatDark)
        Wall(wT * 0.75, D * 0.38, W * 0.14, D * 0.31, mInnerWall, edgeMatDark)

        // Accent wall behind bed
        Wall(W * 0.44, wT * 0.5, -W * 0.28, -D / 2 + wT * 0.7, mAccent, edgeMatDark)

        // ── FLOOR ZONES ──
        B(W * 0.52, 0.035, D * 0.44, mFloorWood, -W * 0.24, bY + 0.018, -D * 0.28, edgeMat)       // bedroom — oak wood
        B(W * 0.52, 0.035, D * 0.44, mFloorMarble, -W * 0.24, bY + 0.018, D * 0.28, edgeMat)      // living — Carrara marble
        B(W * 0.34, 0.035, D * 0.44, mKitchTile, W * 0.33, bY + 0.018, D * 0.28, edgeMat)          // kitchen — grey ceramic
        B(W * 0.44, 0.035, D * 0.44, mFloorWood, W * 0.28, bY + 0.018, -D * 0.28, edgeMat)         // study — oak wood

        // ── MARBLE VEIN LINES (living room) ──
        const mVein = new T.MeshBasicMaterial({ color: 0xC8C0B5, transparent: true, opacity: 0.22 })
        for (let i = 0; i < 5; i++) {
          const vx = -W * 0.24 + (Math.random() - 0.5) * W * 0.4
          const vz = D * 0.28 + (Math.random() - 0.5) * D * 0.3
          B(0.015, 0.001, 1.5 + Math.random() * 2, mVein, vx, bY + 0.04, vz, false)
        }

        // ── TILE GRID ──
        const gM = new T.MeshBasicMaterial({ color: 0x9A8A78, transparent: true, opacity: 0.15 })
        for (let i = -W / 2 + 1.5; i < W / 2; i += 1.5) B(0.015, 0.001, D - 0.2, gM, i, bY + 0.04, 0, false)
        for (let i = -D / 2 + 1.5; i < D / 2; i += 1.5) B(W - 0.2, 0.001, 0.015, gM, 0, bY + 0.04, i, false)

        // ── BRICK MORTAR LINES on exterior walls ──
        const mMortar = new T.MeshBasicMaterial({ color: 0xC8B8A0, transparent: true, opacity: 0.35 })
        // Horizontal mortar lines on back wall
        for (let row = 0; row < 10; row++) {
          B(W - 0.2, 0.001, 0.015, mMortar, 0, bY + 0.32 * row + 0.16, -D / 2 + 0.21, false)
        }
        // Horizontal mortar lines on left wall
        for (let row = 0; row < 10; row++) {
          B(0.015, 0.001, D - 0.2, mMortar, -W / 2 + 0.21, bY + 0.32 * row + 0.16, 0, false)
        }

        // ── COVE LIGHTING strips (warm LED along ceiling edges) ──
        B(W * 0.44, 0.06, 0.06, mCoveLED, -W * 0.28, bY + wH - 0.08, -D / 2 + 0.5, false) // bedroom ceiling edge
        B(W * 0.50, 0.06, 0.06, mCoveLED, -W * 0.25, bY + wH - 0.08, D * 0.08, false)      // living ceiling edge

        // ── MAIN DOOR (solid teak + brass handle) ──
        B(2.0, 2.7, 0.12, mTeakDoor, 0, bY + 1.35, D / 2 + 0.02, edgeMatFurn)
        B(0.08, 0.15, 0.06, mBrass, 0.6, bY + 1.35, D / 2 + 0.10, false)  // brass handle

        // ═══════════════════
        // MASTER BEDROOM
        // ═══════════════════
        B(4.2, 0.44, 5.2, mDarkWood, -W * 0.27, bY + 0.22, -D * 0.30, edgeMatFurn) // bed frame
        B(4.2, 1.35, 0.14, mDarkWood, -W * 0.27, bY + 0.92, -D * 0.30 - 2.53, edgeMatFurn) // headboard
        B(3.9, 0.28, 4.9, mSheet, -W * 0.27, bY + 0.58, -D * 0.30, false) // mattress
        B(3.5, 0.14, 2.8, mDuvet, -W * 0.27, bY + 0.79, -D * 0.30 + 0.7, false) // duvet
        B(1.2, 0.20, 0.48, mPillow, -W * 0.27 - 0.75, bY + 0.86, -D * 0.30 - 1.9, false)
        B(1.2, 0.20, 0.48, mPillow, -W * 0.27 + 0.75, bY + 0.86, -D * 0.30 - 1.9, false)

        // Nightstands + lamps
        B(0.62, 0.50, 0.48, mMedWood, -W * 0.27 + 2.6, bY + 0.25, -D * 0.30 - 2.0, edgeMatFurn)
        B(0.62, 0.50, 0.48, mMedWood, -W * 0.27 - 2.6, bY + 0.25, -D * 0.30 - 2.0, edgeMatFurn)
        // Lamp cylinders
        for (let side of [-1, 1]) {
          const lx = -W * 0.27 + side * 2.6
          const lz = -D * 0.30 - 2.0
          const cyl = new T.Mesh(new T.CylinderGeometry(0.05, 0.07, 0.32, 10), mMedWood)
          cyl.position.set(lx, bY + 0.68, lz); cyl.castShadow = true; house.add(cyl)
          const shade = new T.Mesh(new T.CylinderGeometry(0.18, 0.13, 0.20, 10), mLamp)
          shade.position.set(lx, bY + 0.90, lz); house.add(shade)
        }

        // Wardrobe
        B(0.60, 2.3, 3.2, mDarkWood, -W / 2 + 0.50, bY + 1.15, -D * 0.28, edgeMatFurn)
        B(0.035, 0.28, 0.035, mSteel, -W / 2 + 0.82, bY + 1.15, -D * 0.28 - 0.28)
        B(0.035, 0.28, 0.035, mSteel, -W / 2 + 0.82, bY + 1.15, -D * 0.28 + 0.28)

        // Carpet
        B(2.8, 0.02, 1.6, mRug, -W * 0.27, bY + 0.025, -D * 0.30 + 3.2, false)

        // Window + curtains
        for (let xp of [-W * 0.27]) {
          B(2.8, 0.04, 0.04, mBronze, xp, bY + wH * 0.84, -D / 2 + 0.28, false)
          B(0.10, 2.0, 0.55, mCurtain, xp - 1.2, bY + wH * 0.84 - 1.0, -D / 2 + 0.30, false)
          B(0.10, 2.0, 0.55, mCurtain, xp + 1.2, bY + wH * 0.84 - 1.0, -D / 2 + 0.30, false)
        }

        // ═══════════════════
        // LIVING ROOM
        // ═══════════════════
        B(5.0, 0.52, 1.9, mSofa, -W * 0.25, bY + 0.26, D * 0.33, edgeMatFurn)
        B(5.0, 0.46, 0.30, mSofa, -W * 0.25, bY + 0.75, D * 0.33 + 0.80, edgeMatFurn)
        B(1.9, 0.52, 1.9, mSofa, -W * 0.25 - 3.45, bY + 0.26, D * 0.33, edgeMatFurn)
        B(1.2, 0.15, 0.45, mCush, -W * 0.25 - 0.8, bY + 0.60, D * 0.33 + 0.35, false)
        B(1.2, 0.15, 0.45, mCush, -W * 0.25 + 0.8, bY + 0.60, D * 0.33 + 0.35, false)
        B(1.2, 0.15, 0.45, mCush, -W * 0.25 + 2.0, bY + 0.60, D * 0.33 + 0.35, false)

        // Coffee table (glass on steel)
        B(2.2, 0.06, 0.9, mGlass, -W * 0.25, bY + 0.44, D * 0.33 - 1.7)
        for (let dx of [-1, 1]) for (let dz of [-1, 1])
          B(0.05, 0.40, 0.05, mCharcoal, -W * 0.25 + dx * 0.9, bY + 0.20, D * 0.33 - 1.7 + dz * 0.35, false)

        // TV unit + TV
        B(4.0, 0.72, 0.46, mDarkWood, -W * 0.25, bY + 0.36, D * 0.33 - 3.6, edgeMatFurn)
        B(2.8, 0.04, 1.6, M(0x151515, 0.08, 0.3), -W * 0.25, bY + 1.5, D * 0.33 - 3.85, false)

        // Area rug
        B(5.5, 0.02, 4.2, mRug, -W * 0.25, bY + 0.015, D * 0.31, false)

        // Plant
        B(0.38, 0.38, 0.38, mPot, -W / 2 + 0.70, bY + 0.19, D / 2 - 0.70, edgeMatFurn)
        const leaf = new T.Mesh(new T.SphereGeometry(0.45, 10, 10), mPlant)
        leaf.position.set(-W / 2 + 0.70, bY + 0.78, D / 2 - 0.70); leaf.castShadow = true; house.add(leaf)

        // ═══════════════════
        // KITCHEN
        // ═══════════════════
        B(W * 0.28, 0.90, 0.65, mCab, W * 0.35, bY + 0.45, D * 0.13, edgeMatFurn)
        B(W * 0.29, 0.05, 0.70, mGranite, W * 0.35, bY + 0.93, D * 0.13, edgeMatFurn)
        B(0.65, 0.90, 3.6, mCab, W / 2 - 0.52, bY + 0.45, D * 0.28, edgeMatFurn)
        B(0.70, 0.05, 3.7, mGranite, W / 2 - 0.52, bY + 0.93, D * 0.28, edgeMatFurn)
        B(0.65, 0.10, 0.42, mSteel, W * 0.35, bY + 0.88, D * 0.13) // sink
        B(0.55, 0.04, 0.42, M(0x1A1A1A, 0.12, 0.5), W * 0.35 + 2.0, bY + 0.96, D * 0.13, false) // stove
        B(W * 0.24, 0.68, 0.32, mCharcoal, W * 0.35, bY + 2.5, D * 0.13 + 0.17, edgeMatFurn) // upper cabs
        B(0.80, 1.90, 0.70, mSteel, W / 2 - 0.60, bY + 0.95, D / 2 - 0.55, edgeMatFurn) // fridge

        // ═══════════════════
        // DINING
        // ═══════════════════
        B(2.5, 0.07, 1.3, mLightWood, W * 0.05, bY + 0.80, D * 0.15, edgeMatFurn)
        for (let dx of [-1, 1]) for (let dz of [-1, 1])
          B(0.06, 0.76, 0.06, mMedWood, W * 0.05 + dx * 1.05, bY + 0.38, D * 0.15 + dz * 0.50, false)
        for (let s of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
          const cx = W * 0.05 + s[0] * 1.6, cz = D * 0.15 + s[1] * 0.95
          B(0.42, 0.04, 0.42, mChair, cx, bY + 0.48, cz, false)
          if (s[0] !== 0) B(0.04, 0.45, 0.36, mMedWood, cx + s[0] * 0.22, bY + 0.73, cz, false)
          if (s[1] !== 0) B(0.36, 0.45, 0.04, mMedWood, cx, bY + 0.73, cz + s[1] * 0.22, false)
        }

        // ═══════════════════
        // STUDY / GUEST ROOM
        // ═══════════════════
        B(2.6, 0.07, 0.85, mLightWood, W * 0.28, bY + 0.78, -D * 0.43, edgeMatFurn)
        for (let dx of [-1, 1]) for (let dz of [-1, 1])
          B(0.06, 0.74, 0.06, mMedWood, W * 0.28 + dx * 1.1, bY + 0.37, -D * 0.43 + dz * 0.35, false)
        B(0.48, 0.06, 0.48, mCharcoal, W * 0.28, bY + 0.48, -D * 0.43 + 1.15, false)
        B(0.48, 0.48, 0.06, mCharcoal, W * 0.28, bY + 0.78, -D * 0.43 + 1.40, false)

        // Bookshelf
        B(2.2, 2.0, 0.40, mDarkWood, W * 0.28, bY + 1.0, -D / 2 + 0.38, edgeMatFurn)
        const bkC = [0xA03020, 0x2068A0, 0x1A8040, 0xD08810, 0x703888, 0xC06018]
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++)
          B(0.38, 0.26, 0.20, M(bkC[(r * 4 + c) % bkC.length], 0.6), W * 0.28 - 0.78 + c * 0.55, bY + 0.38 + r * 0.65, -D / 2 + 0.36, false)

        // Guest bed
        B(1.9, 0.38, 3.6, mMedWood, W * 0.39, bY + 0.19, -D * 0.20, edgeMatFurn)
        B(1.75, 0.22, 3.4, mSheet, W * 0.39, bY + 0.49, -D * 0.20, false)
        B(1.75, 0.10, 2.0, mDuvet, W * 0.39, bY + 0.65, -D * 0.20 + 0.5, false)
        B(0.70, 0.15, 0.38, mPillow, W * 0.39, bY + 0.67, -D * 0.20 - 1.40, false)

        // Window + curtain
        B(2.4, 0.04, 0.04, mBronze, W * 0.28, bY + wH * 0.84, -D / 2 + 0.28, false)
        B(0.10, 1.8, 0.50, mCurtain, W * 0.28 - 1.05, bY + wH * 0.84 - 0.9, -D / 2 + 0.30, false)
        B(0.10, 1.8, 0.50, mCurtain, W * 0.28 + 1.05, bY + wH * 0.84 - 0.9, -D / 2 + 0.30, false)

        // ═══════════════════
        // VASTU MARKERS
        // ═══════════════════
        for (let p of [{ x: -W * 0.27, z: -D * 0.15 }, { x: -W * 0.25, z: D * 0.22 }, { x: W * 0.30, z: D * 0.28 }]) {
          const dot = new T.Mesh(new T.SphereGeometry(0.24, 16, 16), mDot)
          dot.position.set(p.x, bY + 0.28, p.z); house.add(dot)
          const ring = new T.Mesh(new T.RingGeometry(0.32, 0.44, 20), new T.MeshBasicMaterial({ color: 0xF5C518, transparent: true, opacity: 0.2, side: T.DoubleSide }))
          ring.rotation.x = -Math.PI / 2; ring.position.set(p.x, bY + 0.04, p.z); house.add(ring)
        }

        // Door mat
        B(1.3, 0.02, 0.6, M(0x6A5838, 0.95), 0, bY + 0.02, D / 2 + 0.15, false)
      }

      // ══════ RENDERER ══════
      if (!canvasRef.current) return  // final guard before GL context
      renderer = new T.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(vw, vh)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = T.PCFSoftShadowMap
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.outputEncoding = T.sRGBEncoding

      // ══════ ORBIT CONTROLS (camera moves, model stays fixed) ══════
      const dn = (e: any) => {
        drag = true
        px = e.clientX ?? e.touches?.[0]?.clientX ?? 0
        py = e.clientY ?? e.touches?.[0]?.clientY ?? 0
      }
      const mv = (e: any) => {
        if (!drag) return
        const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0
        const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0
        // Horizontal drag → azimuth (unlimited 360°)
        azimuth -= (cx - px) * 0.005
        // Vertical drag → polar (clamped to prevent flip)
        polar += (cy - py) * 0.004
        polar = Math.max(MIN_POLAR, Math.min(MAX_POLAR, polar))
        px = cx; py = cy
        updateCamera()
      }
      const up = () => drag = false
      const wh = (e: any) => {
        zoomRef.current = Math.max(26, Math.min(58, zoomRef.current + e.deltaY * 0.025))
        updateCamera()
      }

      const cvs = canvasRef.current
      if (!cvs) return
      cvs.addEventListener('mousedown', dn)
      cvs.addEventListener('touchstart', dn, { passive: true })
      cvs.addEventListener('wheel', wh, { passive: true })
      window.addEventListener('mousemove', mv)
      window.addEventListener('touchmove', mv, { passive: true })
      window.addEventListener('mouseup', up)
      window.addEventListener('touchend', up)

      // ══════ RENDER LOOP (only auto-rotate azimuth, never touch house rotation) ══════
      const vec = new T.Vector3()
      const loop = () => {
        frameId = requestAnimationFrame(loop)
        if (autoRotate && !drag) {
          azimuth += 0.003
          updateCamera()
        }
        renderer.render(scene, camera)
        
        // ── PROJECT 3D TAGS TO 2D SCREEN ──
        if (!showRoof) {
          const newTags = materialInfo.map(t => {
            vec.set(t.pos.x, t.pos.y, t.pos.z)
            vec.project(camera)
            // convert normalize coordinates (-1 to +1) to pixel coords
            const x = (vec.x *  .5 + .5) * vw
            const y = (vec.y * -.5 + .5) * vh
            return { ...t, screenX: x, screenY: y, visible: vec.z < 1.0 }
          })
          setTags(newTags)
        } else {
          setTags([])
        }
      }
      loop()
    }

    if ((window as any).THREE) build()
    else { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"; s.onload = build; document.head.appendChild(s) }
    return () => { cancelAnimationFrame(frameId); if (renderer) { renderer.dispose(); renderer.forceContextLoss() } }
  }, [isLoading, showRoof, autoRotate])

  const zoom = (d: number) => {
    zoomRef.current = Math.max(26, Math.min(58, zoomRef.current + d * 4))
    updateCamRef.current()
  }

  return (
    <div className="h-full flex flex-col bg-[#E0D5C8] text-slate-900 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#E0D5C8] gap-8 animate-in fade-in duration-700">
          <div className="relative"><div className="h-24 w-24 border-t-2 border-primary rounded-full animate-spin" /><Activity className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" /></div>
          <div className="text-center"><h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Building Interior</h3><p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Rendering Materials & Lighting...</p></div>
        </div>
      )}
      <div className="flex-1 relative">
        <div ref={containerRef} className="w-full h-full relative">
          <canvas ref={canvasRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />
          
          {/* FLOATING MATERIAL TAGS */}
          {tags.map((t) => (
            <div
              key={t.id}
              className={cn(
                "absolute pointer-events-none transition-opacity duration-200",
                t.visible && t.screenX > 0 && t.screenX < (containerRef.current?.clientWidth || 0) && t.screenY > 0 && t.screenY < (containerRef.current?.clientHeight || 0) ? "opacity-100" : "opacity-0"
              )}
              style={{ left: t.screenX, top: t.screenY, transform: 'translate(-50%, -100%)' }}
            >
              {/* Leader Line */}
              <div className="absolute left-1/2 bottom-[-16px] h-4 w-px border-l border-dashed border-[#FF6B2B]" />
              <div className="absolute left-1/2 bottom-[-20px] h-2 w-2 rounded-full bg-[#FF6B2B] shadow-[0_0_8px_rgba(255,107,43,0.8)] -translate-x-1/2" />
              
              {/* Tag Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-[#FF6B2B]/40 p-2.5 w-44 pointer-events-auto cursor-help hover:scale-105 transition-transform origin-bottom">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#FF6B2B]" />
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wide leading-none">{t.name}</h4>
                </div>
                <div className="space-y-0.5 ml-3">
                  <p className="text-[8px] font-bold text-slate-500 uppercase flex justify-between">Brand: <span className="text-slate-700">{t.brand}</span></p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase flex justify-between">Rate: <span className="text-[#FF6B2B]">{t.rate}</span></p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase flex justify-between">Rating: <span className="text-yellow-500 tracking-widest">{t.rating}</span></p>
                  <p className="text-[7.5px] font-medium text-slate-400 leading-tight mt-1 pt-1 border-t border-slate-100">{t.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-5 space-y-2">
          <button onClick={onBack} className="h-9 px-4 bg-white/60 backdrop-blur-lg border border-white/25 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all shadow-sm active:scale-95"><ArrowLeft className="h-3 w-3 mr-1.5 inline-block" /> Back</button>
          <div><h1 className="text-xl font-black uppercase tracking-tight text-slate-800 leading-none">3D <span className="text-primary">Studio</span></h1><p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">{area.toLocaleString()} sqft • {showRoof ? "Exterior" : "Interior"}</p></div>
        </div>
        <div className="absolute right-5 top-5 flex flex-col gap-2">
          <button onClick={() => setShowRoof(!showRoof)} className={cn("h-10 w-10 flex items-center justify-center rounded-xl border transition-all shadow-md active:scale-95", showRoof ? "bg-slate-800 border-slate-700 text-white" : "bg-white/60 backdrop-blur-lg border-white/25 text-slate-600")}>{showRoof ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
          <button onClick={() => setAutoRotate(!autoRotate)} className={cn("h-10 w-10 flex items-center justify-center rounded-xl border transition-all shadow-md active:scale-95", autoRotate ? "bg-primary border-primary text-white" : "bg-white/60 backdrop-blur-lg border-white/25 text-slate-600")}><RotateCw className="h-4 w-4" /></button>
          <button onClick={() => zoom(-1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-lg border border-white/25 text-slate-600 shadow-md active:scale-95"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => zoom(1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-lg border border-white/25 text-slate-600 shadow-md active:scale-95"><ZoomOut className="h-4 w-4" /></button>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/25 shadow-sm"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{showRoof ? "Exterior" : "Interior Cutaway"} • Live</span></div>
          <Button onClick={onCalculate} className="h-10 px-6 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[9px] tracking-[0.2em] rounded-xl shadow-xl shadow-primary/25 active:scale-95 transition-all"><Zap className="h-3.5 w-3.5 mr-1.5" /> Analyze Cost</Button>
        </div>
      </div>
    </div>
  )
}
