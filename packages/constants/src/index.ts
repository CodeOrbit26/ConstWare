export const CITY_MULTIPLIERS = {
  'Mumbai': 1.35,
  'Delhi NCR': 1.25,
  'Bangalore': 1.20,
  'Hyderabad': 1.15,
  'Chennai': 1.15,
  'Pune': 1.10,
  'Kolkata': 1.05,
  'Ahmedabad': 1.00,
  'Jaipur': 0.92,
  'Lucknow': 0.90,
  'Bhopal': 0.88,
  'Indore': 0.88,
  'Bhind/MP': 0.78,
  'Tier-2 City': 0.88,
  'Rural Area': 0.75
} as const;

export const BASE_RATES_2025 = {
  civil: {
    economy: 1200,
    standard: 1600,
    premium: 2200,
    luxury: 3500
  },
  cement_bag: 400,
  steel_ton: 58000,
  sand_cum: 1800,
  aggregate_cum: 1400,
  bricks_pcs: 8,
  aac_blocks_cum: 4200,
  plywood_sqft: 120,
  paint_liter: 180,
  pvc_pipe_meter: 320,
  electric_wire_meter: 45,
  tiles_sqft: 55,
  marble_sqft: 180,
  flushed_door: 8000,
  aluminum_window_sqft: 450
} as const;

export const LABOUR_RATES_2025 = {
  head_mason: 1100,
  mason: 900,
  bar_bender: 850,
  carpenter: 1000,
  electrician: 1200,
  plumber: 1000,
  painter: 800,
  helper: 600,
  tile_layer: 900
} as const;

export const GRADE_INFO = {
  'ECONOMY': { range: '₹1200 - 1600/sqft', desc: 'Basic quality materials' },
  'STANDARD': { range: '₹1600 - 2200/sqft', desc: 'Good mid-range branded materials' },
  'PREMIUM': { range: '₹2200 - 3500/sqft', desc: 'High-end luxury finishes & fittings' },
  'LUXURY': { range: '₹3500+/sqft', desc: 'Ultra-premium imported materials' }
} as const;

export const SPECIAL_FEATURES = [
  { id: 'basement_wp', label: 'Basement Waterproofing', cost: 45000 },
  { id: 'rwh', label: 'Rainwater Harvesting', cost: 35000 },
  { id: 'solar', label: 'Solar Panel Provision', cost: 80000 },
  { id: 'elevator', label: 'Elevator/Lift Provision', cost: 450000 },
  { id: 'pool', label: 'Swimming Pool', cost: 800000 },
  { id: 'kitchen', label: 'Modular Kitchen', cost: 120000 },
  { id: 'smart_home', label: 'Home Automation', cost: 250000 },
  { id: 'security', label: 'CCTV & Security', cost: 45000 },
  { id: 'generator', label: 'Generator Backup', cost: 120000 },
  { id: 'landscaping', label: 'Landscaping & Garden', cost: 60000 },
  { id: 'boundary', label: 'Boundary Wall', cost: 35000 },
  { id: 'parking', label: 'Covered Parking', cost: 80000 }
] as const;
