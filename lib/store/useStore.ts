import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  Transaction, 
  PagarRecord, 
  mockTransactions, 
  mockPagarRecords 
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
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updatePagarStatus: (recordId: string, status: 'pending' | 'paid') => void
  disburseAllPending: () => void
  saveAttendance: (siteId: string, date: string, records: Record<string, any>, submitted: boolean) => void
  getAttendance: (siteId: string, date: string) => AttendanceLog | undefined
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      pagarRecords: mockPagarRecords,
      attendanceLogs: [],

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

      saveAttendance: (siteId, date, records, submitted) => set((state) => {
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
            
            if (pIdx > -1) {
              const getPayout = (status: string | null) => status === 'Present' ? 800 : (status === 'Half Day' ? 400 : 0);
              const oldPayout = getPayout(oldRec.status) + (oldRec.overtimeHours * 100);
              const newPayout = getPayout(newRec.status) + (newRec.overtimeHours * 100);
              const payoutDelta = newPayout - oldPayout;

              const oldPresent = oldRec.status === 'Present' ? 1 : (oldRec.status === 'Half Day' ? 0.5 : 0);
              const newPresent = newRec.status === 'Present' ? 1 : (newRec.status === 'Half Day' ? 0.5 : 0);
              const presentDelta = newPresent - oldPresent;

              const otDelta = (newRec.overtimeHours || 0) - (oldRec.overtimeHours || 0);

              newPagar[pIdx] = {
                ...newPagar[pIdx],
                netPayable: newPagar[pIdx].netPayable + payoutDelta,
                daysPresent: newPagar[pIdx].daysPresent + presentDelta,
                overtimeHours: newPagar[pIdx].overtimeHours + otDelta
              };
            }
          })
        }

        return { attendanceLogs: newLogs, pagarRecords: newPagar }
      }),

      getAttendance: (siteId, date) => {
        const state = useFinanceStore.getState()
        return state.attendanceLogs.find(l => l.siteId === siteId && l.date === date)
      }
    }),
    {
      name: 'constware-finance-storage',
    }
  )
)
