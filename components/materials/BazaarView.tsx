"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Search, 
  ShoppingCart, 
  Truck, 
  MapPin, 
  ChevronLeft,
  Package,
  Wrench,
  Construction,
  Zap,
  Droplets,
  HardHat,
  Globe,
  Star,
  Minus,
  Plus,
  X,
  Heart,
  Store,
  ExternalLink,
  ChevronRight,
  User,
  MoreVertical,
  ArrowRight,
  Tag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const CATEGORIES = [
  { id: "all", name: "All Inventory", icon: Globe },
  { id: "bulk", name: "Bulk Materials", icon: Package },
  { id: "heavy", name: "Heavy Machinery", icon: Construction },
  { id: "tools", name: "Power Tools", icon: Wrench },
  { id: "electric", name: "Electrical", icon: Zap },
  { id: "plumbing", name: "Plumbing", icon: Droplets },
  { id: "safety", name: "Safety Gear", icon: HardHat }
]

const ALL_PRODUCTS = [
  {
    id: 1,
    cat: "bulk",
    name: "Tata Tiscon TMT Bar Fe 550D",
    dealer: "Tata Steel Group",
    price: 68500,
    mrp: 75000,
    unit: "ton",
    rating: 4.9,
    reviews: 1240,
    discount: "9% off",
    link: "https://www.amazon.in/dp/B07Z6S7L8F",
    specs: { "Grade": "Fe 550D", "Diameter": "12mm", "Length": "12m" },
    images: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800", "https://images.unsplash.com/photo-1504917595217-d4dc5efa61df?q=80&w=800"]
  },
  {
    id: 2,
    cat: "bulk",
    name: "UltraTech OPC 53 Grade Cement",
    dealer: "UltraTech Premium",
    price: 425,
    mrp: 495,
    unit: "bag",
    rating: 4.8,
    reviews: 5600,
    discount: "14% off",
    link: "https://www.flipkart.com/search?q=ultratech+cement",
    specs: { "Type": "OPC", "Grade": "53", "Weight": "50kg" },
    images: ["https://images.unsplash.com/photo-1589939705384-5185138a047a?q=80&w=800", "https://images.unsplash.com/photo-1533467433245-09095690b201?q=80&w=800"]
  },
  {
    id: 4,
    cat: "heavy",
    name: "JCB 3DX Backhoe Loader",
    dealer: "JCB Global Hub",
    price: 3200000,
    mrp: 3500000,
    unit: "unit",
    rating: 4.9,
    reviews: 215,
    discount: "8% off",
    link: "https://www.jcb.com/en-in",
    specs: { "Engine": "Diesel", "Power": "74hp", "Weight": "7460kg" },
    images: ["https://images.unsplash.com/photo-1579402506828-567f3a8b277d?q=80&w=800", "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800"]
  },
  {
    id: 6,
    cat: "tools",
    name: "Bosch GSB 13 RE Impact Drill",
    dealer: "Bosch Industrial",
    price: 3850,
    mrp: 5500,
    unit: "kit",
    rating: 4.8,
    reviews: 12050,
    discount: "30% off",
    link: "https://www.amazon.in/Bosch-GSB-13-RE-600-Watt/dp/B006SBMG1S",
    specs: { "Power": "600W", "Chuck Capacity": "13mm", "Speed": "2800rpm" },
    images: ["https://images.unsplash.com/photo-1504148455328-497c5efdf156?q=80&w=800", "https://images.unsplash.com/photo-1530124560677-bdaeaeb2fdef?q=80&w=800"]
  },
  {
    id: 8,
    cat: "electric",
    name: "Havells 2.5 sq mm Wires (90m)",
    dealer: "Havells India",
    price: 2850,
    mrp: 3500,
    unit: "coil",
    rating: 4.9,
    reviews: 2400,
    discount: "18% off",
    link: "https://www.flipkart.com/havells-lifeline-plus-2-5-sq-mm-90-m-wire/p/itm7e7f6e6f6e6f6",
    specs: { "Length": "90m", "Voltage": "1100V", "Type": "FR-LSH" },
    images: ["https://images.unsplash.com/photo-1558484663-962a0339922e?q=80&w=800"]
  },
  {
    id: 10,
    cat: "plumbing",
    name: "Supreme SWV Pipe (110mm x 6m)",
    dealer: "Supreme Industries",
    price: 1850,
    mrp: 2200,
    unit: "pipe",
    rating: 4.8,
    reviews: 1200,
    discount: "16% off",
    link: "https://www.flipkart.com/search?q=supreme+pipes",
    specs: { "Diameter": "110mm", "Pressure": "6kgf", "Material": "UPVC" },
    images: ["https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=800"]
  }
]

export function BazaarView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const view = searchParams.get('view')

  const [activeCategory, setActiveCategory] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [cart, setCart] = React.useState<any[]>([])
  const [currentImg, setCurrentImg] = React.useState(0)

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [productId, view])

  const filteredProducts = ALL_PRODUCTS.filter(p => {
    const matchesCat = activeCategory === "all" || p.cat === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.dealer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const selectedProduct = ALL_PRODUCTS.find(p => p.id === Number(productId))

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
       setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item))
    } else {
       setCart([...cart, { ...product, qty: 1 }])
    }
    toast.success(`Tracked ${product.name} in pipeline`)
  }

  const openProduct = (id: number) => {
    window.open(`/contractor/bazaar?id=${id}`, '_blank')
  }

  const openCart = () => {
    window.open(`/contractor/bazaar?view=cart`, '_blank')
  }

  // --- PRODUCT DETAIL PAGE VIEW ---
  if (selectedProduct) {
     return (
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-12">
           <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => window.close()} className="text-slate-400 hover:text-white flex items-center gap-2">
                 <X className="h-5 w-5" /> Close Tab
              </Button>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                    <img src={selectedProduct.images[currentImg]} className="w-full h-full object-cover transition-all" />
                 </div>
                 <div className="flex gap-4">
                    {selectedProduct.images.map((img, i) => (
                      <button key={i} onClick={() => setCurrentImg(i)} className={cn("h-20 w-20 rounded-xl overflow-hidden border-2", currentImg === i ? "border-primary" : "border-white/5 opacity-50")}>
                         <img src={img} className="h-full w-full object-cover" />
                      </button>
                    ))}
                 </div>
              </div>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Verified Material</Badge>
                    <h1 className="text-4xl font-bold text-white leading-tight">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {selectedProduct.rating}</span>
                       <span className="flex items-center gap-1"><Store className="h-4 w-4" /> {selectedProduct.dealer}</span>
                    </div>
                 </div>
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-baseline gap-4 mb-4">
                       <span className="text-5xl font-bold text-white">₹{selectedProduct.price.toLocaleString()}</span>
                       <span className="text-slate-500 line-through text-xl">₹{selectedProduct.mrp.toLocaleString()}</span>
                       <Badge className="bg-green-500/20 text-green-500">{selectedProduct.discount}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-14 font-bold" onClick={() => addToCart(selectedProduct)}>Add to Cart</Button>
                       <Button className="h-14 bg-primary font-bold" onClick={() => window.open(selectedProduct.link, '_blank')}>Buy Direct</Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    )
  }

  // --- CART VIEW ---
  if (view === 'cart') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <h1 className="text-3xl font-bold flex items-center gap-4"><ShoppingCart className="h-8 w-8 text-primary" /> Procurement Queue</h1>
              <Button variant="ghost" onClick={() => window.close()}>Close Tab</Button>
           </div>
           {cart.length === 0 ? (
             <div className="py-20 text-center text-slate-500">Your cart is empty.</div>
           ) : (
             <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 items-center">
                     <img src={item.images[0]} className="h-24 w-24 rounded-xl object-cover" />
                     <div className="flex-1">
                        <h4 className="text-lg font-bold">{item.name}</h4>
                        <p className="text-sm text-slate-500">{item.dealer}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-bold text-white">₹{(item.price * item.qty).toLocaleString()}</p>
                        <Button variant="ghost" className="text-red-500" onClick={() => setCart(cart.filter(x => x.id !== item.id))}>Remove</Button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    )
  }

  // --- MAIN BAZAAR HOME ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-primary/30 pb-20">
      
      {/* 1. TOP UTILITY HEADER (ALIGNMENT FIXED) */}
      <div className="bg-slate-950 px-8 py-2 border-b border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
         <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
               <MapPin className="h-3 w-3 text-primary" /> Sector 4 Control Node Node
            </button>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex gap-4">
               <span className="hover:text-primary transition-colors cursor-pointer">Partner Portal</span>
               <span className="hover:text-primary transition-colors cursor-pointer">Tactical Support</span>
            </div>
         </div>
         <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Sourcing Matrix v1.2</span>
         </div>
      </div>

      {/* 2. MAIN NAV HEADER (FLIPKART LAYOUT - RE-ALIGNED) */}
      <nav className="h-20 px-8 flex items-center justify-between bg-[#020617] border-b border-white/5 sticky top-0 z-[60] backdrop-blur-xl gap-12">
        {/* LOGO AREA */}
        <div className="shrink-0">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                 <Globe className="h-6 w-6" />
              </div>
              <h1 className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">The<span className="text-primary not-italic">Bazaar</span></h1>
           </div>
        </div>

        {/* SEARCH AREA (CENTERED) */}
        <div className="flex-1 max-w-2xl relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
           <Input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search Strategic Materials, Dealer Brands and Fleet..." 
             className="h-11 pl-12 bg-slate-900 border-white/10 rounded-xl text-sm transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/5 placeholder:text-slate-700 shadow-xl"
           />
        </div>

        {/* ACTION AREA */}
        <div className="flex items-center gap-10 shrink-0">
           <button className="flex flex-col items-center gap-1 group">
              <User className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-white uppercase tracking-widest">Account</span>
           </button>
           
           <button onClick={openCart} className="flex flex-col items-center gap-1 group relative">
              <ShoppingCart className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-white uppercase tracking-widest">Pipeline</span>
              {cart.length > 0 && (
                 <span className="absolute -top-2 -right-2 h-4 w-4 bg-primary text-white text-[9px] font-black rounded-lg flex items-center justify-center border-2 border-[#020617]">
                    {cart.length}
                 </span>
              )}
           </button>

           <MoreVertical className="h-5 w-5 text-slate-700 cursor-pointer hover:text-white transition-colors" />
        </div>
      </nav>

      {/* 3. CATEGORY ICONS BAR (PROPERLY ALIGNED & CENTERED) */}
      <div className="bg-[#020617] border-b border-white/5 py-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-16 px-8 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-3 transition-all shrink-0 group min-w-[80px]",
                  activeCategory === cat.id ? "scale-105" : "opacity-40 hover:opacity-100"
                )}
              >
                 <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all bg-slate-900 border border-white/5 group-hover:border-primary/30 shadow-2xl",
                    activeCategory === cat.id && "bg-primary border-primary shadow-primary/20"
                 )}>
                    <cat.icon className={cn("h-7 w-7", activeCategory === cat.id ? "text-white" : "text-slate-400")} />
                 </div>
                 <span className={cn(
                    "text-[10px] font-bold tracking-[0.15em] uppercase text-center",
                    activeCategory === cat.id ? "text-primary" : "text-slate-500"
                 )}>{cat.name}</span>
              </button>
            ))}
        </div>
      </div>

      <main className="max-w-[1500px] mx-auto px-8 py-10 space-y-12">
          
          {/* HERO BANNER SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="md:col-span-3 relative rounded-[2.5rem] overflow-hidden group shadow-2xl h-[380px] border border-white/5">
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-center p-16 space-y-8">
                   <div className="space-y-3">
                      <Badge className="bg-primary text-white font-bold px-4 py-1.5 rounded-lg text-[10px] tracking-widest uppercase">Special Allocation</Badge>
                      <h2 className="text-6xl font-black italic text-white tracking-tighter uppercase leading-none">Bulk Sourcing Hub</h2>
                      <p className="text-xl text-slate-400 font-medium tracking-tight">Direct manufacturer rates for 50+ Ton orders. <span className="text-primary italic">Verified Node.</span></p>
                   </div>
                   <Button className="w-fit h-14 px-10 bg-primary hover:bg-orange-600 rounded-2xl font-bold uppercase tracking-widest flex items-center gap-4 text-xs transition-all shadow-xl shadow-primary/20">Explore Inventory <ChevronRight className="h-5 w-5" /></Button>
                </div>
             </div>
             
             <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 p-8 flex flex-col justify-between shadow-2xl group border-l-4 border-l-primary">
                <div className="space-y-6">
                   <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Tag className="h-7 w-7" /></div>
                   <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">Strategic<br />Deal Matrix</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">Save up to 15% on Multi-Unit Machinery leases this sector season.</p>
                </div>
                <Button variant="ghost" className="text-primary font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 px-0 hover:bg-transparent">View Matrix <ArrowRight className="h-4 w-4" /></Button>
             </div>
          </div>

          <section className="bg-slate-900/10 border border-white/5 rounded-[3rem] p-10 space-y-10">
             <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div className="space-y-1">
                   <h3 className="text-2xl font-bold text-white tracking-tight">Material Curation Node</h3>
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Hand-picked by Elite Site Strategists</p>
                </div>
                <Button variant="outline" className="h-10 px-6 border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-xl">View Archive</Button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                {ALL_PRODUCTS.map(p => (
                   <div key={p.id} onClick={() => openProduct(p.id)} className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 hover:border-primary/40 transition-all cursor-pointer group text-center space-y-4 shadow-xl">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative border border-white/5">
                         <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <Badge className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-lg">{p.discount}</Badge>
                      </div>
                      <div className="space-y-1">
                         <h5 className="text-[11px] font-bold text-slate-400 line-clamp-1 group-hover:text-white transition-colors">{p.name}</h5>
                         <p className="text-sm font-black text-white italic tracking-tighter">₹{p.price.toLocaleString()}</p>
                         <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Procured via {p.dealer}</p>
                      </div>
                   </div>
                ))}
             </div>
          </section>

          <div className="space-y-10">
             <div className="flex items-center gap-6">
                <h3 className="text-3xl font-bold text-white tracking-tighter italic uppercase">Market Core</h3>
                <div className="flex-1 h-px bg-white/5" />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
               {filteredProducts.map(prod => (
                 <div key={prod.id} className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all flex flex-col group cursor-pointer shadow-2xl relative" onClick={() => openProduct(prod.id)}>
                     <div className="aspect-[4/3] relative overflow-hidden group-hover:shadow-[inset_0_0_100px_rgba(249,115,22,0.1)] transition-all">
                        <img src={prod.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <Badge className="absolute top-6 left-6 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-xl shadow-lg shadow-orange-500/20">{prod.discount}</Badge>
                     </div>
                     <div className="p-8 flex-1 flex flex-col space-y-6">
                        <div className="flex-1 space-y-2">
                           <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
                              <span>{prod.cat} Node</span>
                              <span className="flex items-center gap-1.5"><Star className="h-3 w-3 fill-primary text-primary" /> {prod.rating}</span>
                           </div>
                           <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight leading-tight line-clamp-1">{prod.name}</h4>
                           <p className="text-xs text-slate-600 font-bold flex items-center gap-2 uppercase tracking-widest"><Store className="h-3 w-3" /> {prod.dealer}</p>
                        </div>
                        <div className="space-y-6 pt-6 border-t border-white/5 font-sans">
                           <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black italic text-white tracking-tight">₹{prod.price.toLocaleString()}</span>
                              <span className="text-xs text-slate-600 line-through">₹{prod.mrp.toLocaleString()}</span>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 h-12 rounded-[1.2rem] border-white/10 hover:border-primary text-[10px] font-bold uppercase transition-all bg-white/5" onClick={(e) => { e.stopPropagation(); addToCart(prod); }}>Pipeline</Button>
                              <Button className="flex-1 h-12 bg-primary hover:bg-orange-600 rounded-[1.2rem] text-[10px] font-bold uppercase text-white shadow-xl shadow-primary/10" onClick={(e) => { e.stopPropagation(); window.open(prod.link, '_blank'); }}>Buy Direct</Button>
                           </div>
                        </div>
                     </div>
                 </div>
               ))}
             </div>
          </div>
      </main>
    </div>
  )
}
