export interface Alert {
  id: string
  type: 'labour_shortage' | 'material_low' | 'cost_overrun' | 'dpr_missing' | 'suspicious_activity'
  severity: 'critical' | 'warning'
  title: string
  site: string
  siteId?: string
  description: string
  timeAgo: string
  isRead: boolean
  actionLabel: string
  href: string
}

export interface SiteStats {
  todayLabourCost: number
  totalExpenses: number
  activeWorkers: number
  activeSites: number
}

export interface SiteOverview {
  id: string
  name: string
  location: string
  supervisor: string
  workers: number
  todayExpenses: number
  progress: number
  health: 'green' | 'amber' | 'red'
  lat: number
  lng: number
}

export interface SiteDetail extends SiteOverview {
  client: string
  clientToken: string
  budgetTotal: number
  startDate: string
  endDate: string
  description: string
  status: 'active' | 'on_hold' | 'completed'
  milestones: { id: string; title: string; date: string; completed: boolean }[]
  siteAccessCode?: string  // 12-char unique code: CW + Client + Site + Date + Contractor + City
}

export interface Worker {
  id: string
  name: string
  phone: string
  skill: 'Mason' | 'Carpenter' | 'Plumber' | 'Electrician' | 'Helper' | 'Supervisor' | 'Bar Bender' | 'Painter' | 'Welder'
  dailyWage: number
  assignedSiteId: string
  attendanceToday?: 'present' | 'half_day' | 'absent'
  lastGpsDistance?: number
  rating: number
  kycVerified: boolean
  aadhaarNumber?: string
  photoUrl?: string
  completedProjects: number
  reliabilityScore: number // percentage
  status: 'available' | 'on_site' | 'unavailable'
}

export interface WorkerReview {
  id: string
  workerId: string
  reviewerName: string
  siteName: string
  rating: number
  comment: string
  date: string
}

export type MaterialCategory = 'Cement' | 'Steel' | 'Sand' | 'Bricks' | 'Other'

export interface Material {
  id: string
  name: string
  category: MaterialCategory
  unit: string
  currentStock: number
  minStock: number
  unitPrice: number
  siteId: string
}

export interface MaterialTransaction {
  id: string
  materialId: string
  type: 'in' | 'out'
  quantity: number
  unitPrice?: number
  totalValue?: number
  supplier?: string
  date: string
  proofUrl?: string
  purpose?: string
  recordedBy: string
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: 'Labour' | 'Material' | 'Machinery' | 'Other' | 'Misc' | 'Client Payment'
  amount: number
  date: string
  description: string
  siteId: string
  loggedBy: string
  receiptUrl?: string
  materialId?: string
  supplier?: string
  quantity?: number
}

export interface PagarRecord {
  id: string
  workerId: string
  workerName: string
  siteId: string
  period: string
  daysPresent: number
  overtimeHours: number
  advanceDeducted: number
  netPayable: number
  status: 'pending' | 'paid'
}

export interface DPRPhoto {
  url: string
  caption?: string
}

export interface DPRMaterial {
  materialId: string
  name: string
  quantity: number
  unit: string
}

export interface DPR {
  id: string
  date: string
  summary: string
  siteId: string
  submitted: boolean
  submittedBy?: string
  submittedAt?: string
  attendance?: {
    present: number
    halfDay: number
    absent: number
    total: number
  }
  workDoneTags?: string[]
  photos?: DPRPhoto[]
  materialsUsed?: DPRMaterial[]
  issues?: {
    description: string
    severity: 'none' | 'low' | 'medium' | 'high'
  }
  tomorrowPlan?: string
}

export interface ExpenseData {
  day: string
  Labour: number
  Material: number
  Machinery: number
}

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'labour_shortage',
    severity: 'critical',
    title: 'Critical Labour Shortage',
    site: 'Green Valley Residency',
    siteId: 'site-1',
    description: 'Only 32 of 50 workers present at Green Valley. Slab casting may delay.',
    timeAgo: '2h ago',
    isRead: false,
    actionLabel: 'Assign Workers',
    href: '/contractor/workers'
  },
  {
    id: '2',
    type: 'material_low',
    severity: 'warning',
    title: 'Material Below Threshold',
    site: 'Skyline Towers',
    siteId: 'site-2',
    description: 'Cement (Ultratech) stock at 15 bags, below safety threshold of 100.',
    timeAgo: '5h ago',
    isRead: false,
    actionLabel: 'Order Now',
    href: '/contractor/materials'
  },
  {
    id: '3',
    type: 'cost_overrun',
    severity: 'critical',
    title: 'Budget Threshold Warning',
    site: 'Lotus Business Park',
    siteId: 'site-3',
    description: 'Budget 92% consumed at Lotus Business Park. Projected overrun in 4 days.',
    timeAgo: '1d ago',
    isRead: true,
    actionLabel: 'Review Expenses',
    href: '/contractor/finance'
  },
  {
    id: '4',
    type: 'dpr_missing',
    severity: 'warning',
    title: 'DPR Submission Missing',
    site: 'Riverside Villas',
    siteId: 'site-4',
    description: 'No daily report submitted for Riverside Villas today.',
    timeAgo: '12h ago',
    isRead: false,
    actionLabel: 'Mark DPR',
    href: '/contractor/sites/site-4'
  },
  {
    id: '5',
    type: 'suspicious_activity',
    severity: 'warning',
    title: 'GPS Perimeter Breach',
    site: 'Green Valley Residency',
    siteId: 'site-1',
    description: 'Attendance GPS mismatch detected at Green Valley. 3 workers flagged.',
    timeAgo: '1h ago',
    isRead: false,
    actionLabel: 'Investigate',
    href: '/contractor/attendance'
  }
]

export const mockStats: SiteStats = {
  todayLabourCost: 45000,
  totalExpenses: 1250000,
  activeWorkers: 156,
  activeSites: 8
}

export const mockSites: SiteDetail[] = [
  {
    id: 'site-1',
    name: 'Green Valley Residency',
    location: 'Sector 45, GGN',
    supervisor: 'Rahul Singh',
    workers: 45,
    todayExpenses: 12500,
    progress: 65,
    health: 'green',
    client: 'Aditya Birla',
    clientToken: 'token-gv-123',
    budgetTotal: 5000000,
    startDate: '2025-10-01',
    endDate: '2026-12-30',
    description: 'Premium residential project with 3 towers of 14 floors each.',
    status: 'active',
    siteAccessCode: 'CWABGV01ASGG',  // CW + Aditya Birla + Green Valley + 01 + Abhay Sharma + GGN
    milestones: [
      { id: 'm1', title: 'Foundation', date: '2025-11-15', completed: true },
      { id: 'm2', title: 'Ground Floor Slab', date: '2026-01-10', completed: true },
      { id: 'm3', title: 'Brickwork & Plastering', date: '2026-08-20', completed: false },
      { id: 'm4', title: 'Finishing & Handover', date: '2026-12-30', completed: false },
    ],
    lat: 28.4595,
    lng: 77.0266
  },
  {
    id: 'site-2',
    name: 'Skyline Towers',
    location: 'Worli, Mumbai',
    supervisor: 'Amit Patel',
    workers: 32,
    todayExpenses: 8400,
    progress: 42,
    health: 'amber',
    client: 'Reliance Infra',
    clientToken: 'token-st-456',
    budgetTotal: 12000000,
    startDate: '2026-01-15',
    endDate: '2027-06-01',
    description: 'Commercial complex with grade A office spaces.',
    status: 'active',
    siteAccessCode: 'CWRIST15ASMU',  // CW + Reliance Infra + Skyline Towers + 15 + Abhay Sharma + Mumbai
    milestones: [
      { id: 'm1', title: 'Excavation', date: '2026-02-15', completed: true },
      { id: 'm2', title: 'Basement P1', date: '2026-05-10', completed: false },
    ],
    lat: 18.9902,
    lng: 72.8147
  },
  {
    id: 'site-3',
    name: 'Lotus Business Park',
    location: 'Whitefield, BLR',
    supervisor: 'Suresh Kumar',
    workers: 28,
    todayExpenses: 15000,
    progress: 88,
    health: 'amber',
    client: 'Lotus Group',
    clientToken: 'LB-WHT-01',
    budgetTotal: 8500000,
    startDate: '2025-05-01',
    endDate: '2026-06-30',
    description: 'IT park with sustainable architecture.',
    status: 'on_hold',
    siteAccessCode: 'CWLGLB01ASBL',  // CW + Lotus Group + Lotus Business + 01 + Abhay Sharma + BLR
    milestones: [
      { id: 'm1', title: 'Structure Ready', date: '2026-02-01', completed: true },
      { id: 'm2', title: 'Finishing', date: '2026-05-30', completed: false },
    ],
    lat: 12.9698,
    lng: 77.7500
  }
]

export const mockWorkers: Worker[] = [
  { 
    id: 'w1', 
    name: 'Rajesh Kumar', 
    phone: '9876543210',
    skill: 'Mason', 
    dailyWage: 800, 
    assignedSiteId: 'site-1', 
    attendanceToday: 'present', 
    lastGpsDistance: 120,
    rating: 4.8,
    kycVerified: true,
    completedProjects: 12,
    reliabilityScore: 95,
    status: 'on_site'
  },
  { 
    id: 'w2', 
    name: 'Sanjay Yadav', 
    phone: '9876543211',
    skill: 'Helper', 
    dailyWage: 500, 
    assignedSiteId: 'site-1', 
    attendanceToday: 'half_day', 
    lastGpsDistance: 650,
    rating: 3.5,
    kycVerified: false,
    completedProjects: 4,
    reliabilityScore: 78,
    status: 'on_site'
  },
  { 
    id: 'w3', 
    name: 'Muni Ram', 
    phone: '9876543212',
    skill: 'Carpenter', 
    dailyWage: 750, 
    assignedSiteId: 'site-1', 
    attendanceToday: 'absent', 
    lastGpsDistance: 0,
    rating: 4.2,
    kycVerified: true,
    completedProjects: 8,
    reliabilityScore: 88,
    status: 'available'
  },
  { 
    id: 'w4', 
    name: 'Vinod Pal', 
    phone: '9876543213',
    skill: 'Electrician', 
    dailyWage: 900, 
    assignedSiteId: 'site-2', 
    attendanceToday: 'present', 
    lastGpsDistance: 45,
    rating: 4.5,
    kycVerified: true,
    completedProjects: 6,
    reliabilityScore: 92,
    status: 'on_site'
  },
  { 
    id: 'w5', 
    name: 'Lokesh Sharma', 
    phone: '9876543214',
    skill: 'Mason', 
    dailyWage: 800, 
    assignedSiteId: 'site-2', 
    attendanceToday: 'present', 
    lastGpsDistance: 80,
    rating: 4.9,
    kycVerified: true,
    completedProjects: 15,
    reliabilityScore: 98,
    status: 'on_site'
  },
]

export const mockWorkerReviews: WorkerReview[] = [
  { id: 'rev1', workerId: 'w1', reviewerName: 'Amit Patel', siteName: 'Green Valley Residency', rating: 5, comment: 'Excellent precision in block work. Very punctual.', date: '2026-03-20' },
  { id: 'rev2', workerId: 'w1', reviewerName: 'Rahul Singh', siteName: 'Skyline Towers', rating: 4, comment: 'Hardworking and follows instructions well.', date: '2026-02-15' },
]

export const mockMaterials: Material[] = [
  { id: 'mat1', name: 'Cement (Ultratech)', category: 'Cement', unit: 'Bags', currentStock: 15, minStock: 100, unitPrice: 450, siteId: 'site-1' },
  { id: 'mat2', name: 'Steel TMT 12mm', category: 'Steel', unit: 'Tons', currentStock: 2.5, minStock: 5, unitPrice: 65000, siteId: 'site-1' },
  { id: 'mat3', name: 'Bricks (Red)', category: 'Bricks', unit: 'Units', currentStock: 5000, minStock: 2000, unitPrice: 8, siteId: 'site-1' },
  { id: 'mat4', name: 'Coarse Sand', category: 'Sand', unit: 'Cubic Ft', currentStock: 800, minStock: 300, unitPrice: 60, siteId: 'site-1' },
]

export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'expense', category: 'Labour', amount: 45000, date: '2026-04-10', description: 'Daily wage payment site 1', siteId: 'site-1', loggedBy: 'Rahul Singh' },
  { id: 't2', type: 'expense', category: 'Material', amount: 120000, date: '2026-04-08', description: '500 bags cement delivery', siteId: 'site-1', loggedBy: 'Rahul Singh', materialId: 'mat1' },
  { id: 't3', type: 'expense', category: 'Machinery', amount: 8000, date: '2026-04-09', description: 'JCB rental 1 day', siteId: 'site-1', loggedBy: 'Amit Patel' },
  { id: 't4', type: 'expense', category: 'Misc', amount: 2500, date: '2026-04-11', description: 'Site cleaning supplies', siteId: 'site-2', loggedBy: 'Amit Patel' },
  { id: 't5', type: 'income', category: 'Client Payment', amount: 500000, date: '2026-04-01', description: '1st Milestone Payment', siteId: 'site-1', loggedBy: 'System' },
  { id: 't6', type: 'income', category: 'Client Payment', amount: 250000, date: '2026-03-25', description: 'Booking Advance', siteId: 'site-2', loggedBy: 'System' },
  { id: 't7', type: 'expense', category: 'Material', amount: 85000, date: '2026-04-05', description: 'Steel rebars for 4th floor', siteId: 'site-2', loggedBy: 'Amit Patel' },
]

export const mockPagarRecords: PagarRecord[] = [
  { id: 'p1', workerId: 'w1', workerName: 'Rajesh Kumar', siteId: 'site-1', period: 'Apr 1 - Apr 15', daysPresent: 14, overtimeHours: 8, advanceDeducted: 1000, netPayable: 11200, status: 'pending' },
  { id: 'p2', workerId: 'w2', workerName: 'Sanjay Yadav', siteId: 'site-1', period: 'Apr 1 - Apr 15', daysPresent: 12, overtimeHours: 0, advanceDeducted: 0, netPayable: 6000, status: 'paid' },
]

export const mockMaterialTransactions: MaterialTransaction[] = [
  { id: 'mt1', materialId: 'mat1', type: 'in', quantity: 500, unitPrice: 450, totalValue: 225000, supplier: 'UltraTech Corp', date: '2026-04-05', recordedBy: 'Rahul Singh' },
  { id: 'mt2', materialId: 'mat1', type: 'out', quantity: 120, purpose: '4th Floor Slab', date: '2026-04-10', recordedBy: 'Rahul Singh' },
  { id: 'mt3', materialId: 'mat2', type: 'in', quantity: 10, unitPrice: 65000, totalValue: 650000, supplier: 'Tata Steel', date: '2026-04-01', recordedBy: 'Rahul Singh' },
  { id: 'mt4', materialId: 'mat3', type: 'out', quantity: 2000, purpose: 'Internal Partition Walls', date: '2026-04-11', recordedBy: 'Rahul Singh' },
]

export const mockDPRs: DPR[] = [
  { 
    id: 'dpr1', 
    date: '2026-04-10', 
    summary: 'Casting of 4th floor columns complete. 65% plastering done on tower B.', 
    siteId: 'site-1', 
    submitted: true,
    submittedBy: 'Rahul Singh',
    submittedAt: '2026-04-10 18:30',
    attendance: { present: 42, halfDay: 3, absent: 5, total: 50 },
    workDoneTags: ['Slab', 'Columns', 'Plastering'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5', caption: 'Column casting progress' },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd', caption: 'Internal plastering tower B' },
    ],
    materialsUsed: [
      { materialId: 'mat1', name: 'Cement (Ultratech)', quantity: 45, unit: 'Bags' },
      { materialId: 'mat4', name: 'Coarse Sand', quantity: 200, unit: 'Cubic Ft' },
    ],
    issues: { description: 'Water pressure low in tower B. Plastering slightly delayed.', severity: 'low' },
    tomorrowPlan: 'Start block work on 5th floor. Electrical conduit laying.'
  },
  { 
    id: 'dpr2', 
    date: '2026-04-09', 
    summary: 'Plumbing work started on 2nd floor.', 
    siteId: 'site-1', 
    submitted: true,
    submittedBy: 'Rahul Singh',
    submittedAt: '2026-04-09 19:15',
    attendance: { present: 45, halfDay: 0, absent: 5, total: 50 },
    workDoneTags: ['Plumbing', 'Finishing'],
    issues: { description: 'None', severity: 'none' },
    tomorrowPlan: 'Complete plumbing for block A.'
  },
  { 
    id: 'dpr3', 
    date: '2026-04-08', 
    summary: 'Slab work ongoing.', 
    siteId: 'site-1', 
    submitted: false 
  },
]

export const mockExpenseHistory: ExpenseData[] = [
  { day: 'Mon', Labour: 12000, Material: 18000, Machinery: 5000 },
  { day: 'Tue', Labour: 11500, Material: 12000, Machinery: 4500 },
  { day: 'Wed', Labour: 13000, Material: 25000, Machinery: 6000 },
  { day: 'Thu', Labour: 12200, Material: 15000, Machinery: 5200 },
  { day: 'Fri', Labour: 14000, Material: 22000, Machinery: 8000 },
  { day: 'Sat', Labour: 11000, Material: 10000, Machinery: 4000 },
  { day: 'Sun', Labour: 5000, Material: 2000, Machinery: 1000 },
]
