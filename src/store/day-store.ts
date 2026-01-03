import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DayState, DayStatus } from '@/types'

interface DayStore {
  currentDay: DayState | null
  setDayState: (dayState: DayState) => void
  updateDayStatus: (status: DayStatus) => void
  startNewDay: (date: string) => void
  clearCurrentDay: () => void
}

export const useDayStore = create<DayStore>()(
  persist(
    (set, get) => ({
      currentDay: null,
      
      setDayState: (dayState) => set({ currentDay: dayState }),
      
      updateDayStatus: (status) => set((state) => {
        if (!state.currentDay) return state
        
        return {
          currentDay: {
            ...state.currentDay,
            status,
            ...(status === DayStatus.ACTIVE && { startTime: new Date() })
          }
        }
      }),
      
      startNewDay: (date) => set({
        currentDay: {
          date,
          status: DayStatus.PLANNING,
          tasks: [],
          immutableLog: [],
          hasHighPriorityTask: false,
        }
      }),
      
      clearCurrentDay: () => set({ currentDay: null })
    }),
    {
      name: 'daygrid-day-storage',
    }
  )
)