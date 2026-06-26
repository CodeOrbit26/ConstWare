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
  firstName?: string
  lastName?: string
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

export const mockAlerts: Alert[] = []

export const mockStats: SiteStats = {
  todayLabourCost: 0,
  totalExpenses: 0,
  activeWorkers: 0,
  activeSites: 0
}

export const mockSites: SiteDetail[] = []

export const mockWorkers: Worker[] = []

export const mockWorkerReviews: WorkerReview[] = []

export const mockMaterials: Material[] = []

export const mockTransactions: Transaction[] = []

export const mockPagarRecords: PagarRecord[] = []

export const mockMaterialTransactions: MaterialTransaction[] = []

export const mockDPRs: DPR[] = []

export const mockExpenseHistory: ExpenseData[] = []

export type PurchaseCategory = 'Cement' | 'Steel' | 'Sand' | 'Bricks' | 'Tiles' | 'Paint' | 'Plumbing' | 'Electrical' | 'Wood' | 'Other'
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit'

export interface MaterialPurchase {
  id: string
  materialName: string
  category: PurchaseCategory
  quantity: number
  unit: string
  totalAmount: number
  supplierName: string
  purchaseDate: string
  siteId: string
  siteName: string
  paymentMode: PaymentMode
  notes: string
  proofUrl?: string
  createdAt: string
}

export const mockMaterialPurchases: MaterialPurchase[] = []

export interface MachineryAsset {
  id: string
  name: string
  type: string
  siteId: string
  siteName: string
  status: 'Operational' | 'Maintenance' | 'Idle' | 'Broken'
  fuelLevel: number
  lastService: string
  nextService: string
  operator: string
}

export const mockMachineryAssets: MachineryAsset[] = []

