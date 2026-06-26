import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  Transaction, 
  PagarRecord, 
  MaterialPurchase,
  MachineryAsset,
  mockTransactions, 
  mockPagarRecords,
  mockMachineryAssets
} from '@/lib/services/mockData'

interface AttendanceLog {
  siteId: string
  date: string
  records: Record<string, any>
  submitted: boolean
}

interface FinanceState {
  transactions: Transaction[]
  pagarRecords: PagarRecord[]
  attendanceLogs: AttendanceLog[]
  materialPurchases: MaterialPurchase[]
  machineryAssets: MachineryAsset[]
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updatePagarStatus: (recordId: string, status: 'pending' | 'paid') => void
  disburseAllPending: () => void
  saveAttendance: (
    siteId: string, 
    date: string, 
    records: Record<string, any>, 
    submitted: boolean, 
    workerDetails?: Record<string, { name: string; dailyWage: number }>
  ) => void
  getAttendance: (siteId: string, date: string) => AttendanceLog | undefined
  addMaterialPurchase: (purchase: Omit<MaterialPurchase, 'id' | 'createdAt'>) => void
  deleteMaterialPurchase: (id: string) => void
  addMachineryAsset: (asset: Omit<MachineryAsset, 'id'>) => void
  deleteMachineryAsset: (id: string) => void
  updateMachineryStatus: (id: string, status: MachineryAsset['status']) => void
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      pagarRecords: mockPagarRecords,
      attendanceLogs: [],
      materialPurchases: [],
      machineryAssets: mockMachineryAssets,

      addTransaction: (newTx) => set((state) => ({
        transactions: [
          {
            ...newTx,
            id: `t-${Date.now()}`,
            date: newTx.date || new Date().toISOString().split('T')[0]
          },
          ...state.transactions
        ]
      })),

      updatePagarStatus: (recordId, status) => set((state) => ({
        pagarRecords: state.pagarRecords.map(record => 
          record.id === recordId ? { ...record, status } : record
        )
      })),

      disburseAllPending: () => set((state) => ({
        pagarRecords: state.pagarRecords.map(record => ({ ...record, status: 'paid' }))
      })),

      saveAttendance: (siteId, date, records, submitted, workerDetails) => set((state) => {
        const logKey = `${siteId}-${date}`;
        const existingLog = state.attendanceLogs.find(l => l.siteId === siteId && l.date === date);
        const oldRecords = existingLog?.records || {};

        let newLogs = [...state.attendanceLogs];
        const newLog = { siteId, date, records, submitted };
        const existingIdx = newLogs.findIndex(l => l.siteId === siteId && l.date === date);
        
        if (existingIdx >= 0) newLogs[existingIdx] = newLog;
        else newLogs.push(newLog);

        let newPagar = [...state.pagarRecords];

        if (submitted) {
          Object.entries(records).forEach(([workerId, newRec]) => {
            const oldRec = oldRecords[workerId] || { status: null, overtimeHours: 0 };
            const pIdx = newPagar.findIndex(p => p.workerId === workerId);
            
            const details = workerDetails?.[workerId] || { name: `Worker #${workerId}`, dailyWage: 800 };
            const wage = details.dailyWage || 800;

            const getPayout = (status: string | null) => status === 'Present' ? wage : (status === 'Half Day' ? (wage / 2) : 0);
            const oldPayout = getPayout(oldRec.status) + (oldRec.overtimeHours * (wage / 8));
            const newPayout = getPayout(newRec.status) + (newRec.overtimeHours * (wage / 8));
            const payoutDelta = newPayout - oldPayout;

            const oldPresent = oldRec.status === 'Present' ? 1 : (oldRec.status === 'Half Day' ? 0.5 : 0);
            const newPresent = newRec.status === 'Present' ? 1 : (newRec.status === 'Half Day' ? 0.5 : 0);
            const presentDelta = newPresent - oldPresent;

            const otDelta = (newRec.overtimeHours || 0) - (oldRec.overtimeHours || 0);

            // Determine Payout Period dynamically based on submission date
            const dateObj = new Date(date);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[dateObj.getMonth()] || "Apr";
            const day = dateObj.getDate();
            const periodStr = day <= 15 ? `${month} 01 – ${month} 15` : `${month} 16 – ${month} 30`;

            if (pIdx > -1) {
              newPagar[pIdx] = {
                ...newPagar[pIdx],
                netPayable: Math.max(0, newPagar[pIdx].netPayable + payoutDelta),
                daysPresent: Math.max(0, newPagar[pIdx].daysPresent + presentDelta),
                overtimeHours: Math.max(0, newPagar[pIdx].overtimeHours + otDelta)
              };
            } else {
              // Create new PagarRecord
              newPagar.push({
                id: `p-${Date.now()}-${workerId}`,
                workerId,
                workerName: details.name,
                siteId,
                period: periodStr,
                daysPresent: newPresent,
                overtimeHours: newRec.overtimeHours || 0,
                advanceDeducted: 0,
                netPayable: newPayout,
                status: 'pending'
              });
            }
          })
        }

        return { attendanceLogs: newLogs, pagarRecords: newPagar }
      }),

      getAttendance: (siteId, date) => {
        const state = useFinanceStore.getState()
        return state.attendanceLogs.find(l => l.siteId === siteId && l.date === date)
      },

      addMaterialPurchase: (purchase) => set((state) => {
        const purchaseId = `mp-${Date.now()}`
        const transactionId = `t-${Date.now()}`
        return {
          materialPurchases: [
            {
              ...purchase,
              id: purchaseId,
              createdAt: new Date().toISOString()
            },
            ...state.materialPurchases
          ],
          transactions: [
            {
              id: transactionId,
              type: 'expense' as const,
              category: 'Material' as const,
              amount: purchase.totalAmount,
              date: purchase.purchaseDate,
              description: `${purchase.materialName} — ${purchase.supplierName}`,
              siteId: purchase.siteId,
              loggedBy: 'Contractor',
              receiptUrl: purchase.proofUrl,
              materialId: purchaseId,
              supplier: purchase.supplierName,
              quantity: purchase.quantity
            },
            ...state.transactions
          ]
        }
      }),

      deleteMaterialPurchase: (id) => set((state) => ({
        materialPurchases: state.materialPurchases.filter(p => p.id !== id),
        transactions: state.transactions.filter(t => t.materialId !== id)
      })),

      addMachineryAsset: (asset) => set((state) => ({
        machineryAssets: [
          {
            ...asset,
            id: `m-${Date.now()}`
          },
          ...state.machineryAssets
        ]
      })),

      deleteMachineryAsset: (id) => set((state) => ({
        machineryAssets: state.machineryAssets.filter(m => m.id !== id)
      })),

      updateMachineryStatus: (id, status) => set((state) => ({
        machineryAssets: state.machineryAssets.map(m => 
          m.id === id ? { ...m, status } : m
        )
      }))
    }),
    {
      name: 'constware-finance-storage-v4',
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null
          let activeUserId = "global"
          try {
            const session = localStorage.getItem("constware_mock_session")
            if (session) {
              const user = JSON.parse(session)
              if (user && user.id) {
                activeUserId = user.id
              }
            }
          } catch (e) {}
          const data = localStorage.getItem(`${name}_${activeUserId}`)
          return data ? JSON.parse(data) : null
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return
          let activeUserId = "global"
          try {
            const session = localStorage.getItem("constware_mock_session")
            if (session) {
              const user = JSON.parse(session)
              if (user && user.id) {
                activeUserId = user.id
              }
            }
          } catch (e) {}
          localStorage.setItem(`${name}_${activeUserId}`, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return
          let activeUserId = "global"
          try {
            const session = localStorage.getItem("constware_mock_session")
            if (session) {
              const user = JSON.parse(session)
              if (user && user.id) {
                activeUserId = user.id
              }
            }
          } catch (e) {}
          localStorage.removeItem(`${name}_${activeUserId}`)
        }
      }
    }
  )
)
