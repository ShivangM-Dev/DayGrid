'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { DayState, DayStatus, Task, TaskLog } from '@/types'

interface DayContextState {
  currentDay: DayState | null
  isLoading: boolean
  error: string | null
}

type DayAction =
  | { type: 'START_NEW_DAY'; payload: { date: string } }
  | { type: 'SET_DAY_STATE'; payload: DayState }
  | { type: 'UPDATE_DAY_STATUS'; payload: DayStatus }
  | { type: 'ADD_TASK_TO_DAY'; payload: Task }
  | { type: 'ADD_TASK_LOG'; payload: TaskLog }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HIGH_PRIORITY_TASK'; payload: string | undefined }

const initialState: DayContextState = {
  currentDay: null,
  isLoading: false,
  error: null,
}

function dayReducer(state: DayContextState, action: DayAction): DayContextState {
  switch (action.type) {
    case 'START_NEW_DAY':
      const newDay: DayState = {
        date: action.payload.date,
        status: DayStatus.PLANNING,
        tasks: [],
        immutableLog: [],
        hasHighPriorityTask: false,
      }
      return {
        ...state,
        currentDay: newDay,
        isLoading: false,
        error: null,
      }
    case 'SET_DAY_STATE':
      return {
        ...state,
        currentDay: action.payload,
        isLoading: false,
        error: null,
      }
    case 'UPDATE_DAY_STATUS':
      if (!state.currentDay) return state
      return {
        ...state,
        currentDay: {
          ...state.currentDay,
          status: action.payload,
          ...(action.payload === DayStatus.ACTIVE && { startTime: new Date() }),
        },
      }
    case 'ADD_TASK_TO_DAY':
      if (!state.currentDay) return state
      return {
        ...state,
        currentDay: {
          ...state.currentDay,
          tasks: [...state.currentDay.tasks, action.payload],
        },
      }
    case 'ADD_TASK_LOG':
      if (!state.currentDay) return state
      return {
        ...state,
        currentDay: {
          ...state.currentDay,
          immutableLog: [...state.currentDay.immutableLog, action.payload],
        },
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case 'SET_HIGH_PRIORITY_TASK':
      if (!state.currentDay) return state
      return {
        ...state,
        currentDay: {
          ...state.currentDay,
          hasHighPriorityTask: !!action.payload,
          highPriorityTaskId: action.payload,
        },
      }
    default:
      return state
  }
}

interface DayContextType {
  state: DayContextState
  startNewDay: (date: string) => void
  setDayState: (dayState: DayState) => void
  activateDay: () => void
  completeDay: () => void
  addTaskToDay: (task: Task) => void
  addTaskLog: (log: TaskLog) => void
  setHighPriorityTask: (taskId: string | undefined) => void
  canModifySchedule: () => boolean
  canRescheduleTask: (task: Task) => boolean
  validateTimeSlot: (startTime: number, duration: number, excludeTaskId?: string) => boolean
}

const DayContext = createContext<DayContextType | undefined>(undefined)

export function DayProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dayReducer, initialState)

  const startNewDay = (date: string) => {
    dispatch({ type: 'START_NEW_DAY', payload: { date } })
  }

  const setDayState = (dayState: DayState) => {
    dispatch({ type: 'SET_DAY_STATE', payload: dayState })
  }

  const activateDay = () => {
    dispatch({ type: 'UPDATE_DAY_STATUS', payload: DayStatus.ACTIVE })
  }

  const completeDay = () => {
    dispatch({ type: 'UPDATE_DAY_STATUS', payload: DayStatus.COMPLETED })
  }

  const addTaskToDay = (task: Task) => {
    dispatch({ type: 'ADD_TASK_TO_DAY', payload: task })
  }

  const addTaskLog = (log: TaskLog) => {
    dispatch({ type: 'ADD_TASK_LOG', payload: log })
  }

  const setHighPriorityTask = (taskId: string | undefined) => {
    dispatch({ type: 'SET_HIGH_PRIORITY_TASK', payload: taskId })
  }

  const canModifySchedule = (): boolean => {
    return state.currentDay?.status === DayStatus.PLANNING
  }

  const canRescheduleTask = (task: Task): boolean => {
    if (!canModifySchedule()) return false
    
    const rescheduleableTypes = ['meeting', 'class', 'appointment']
    return rescheduleableTypes.includes(task.type)
  }

  const validateTimeSlot = (startTime: number, duration: number, excludeTaskId?: string): boolean => {
    if (!state.currentDay) return false
    
    const businessHoursStart = 6
    const businessHoursEnd = 22
    
    if (startTime < businessHoursStart || startTime + duration > businessHoursEnd) {
      return false
    }
    
    const endTime = startTime + duration
    
    for (const task of state.currentDay.tasks) {
      if (task.id === excludeTaskId || task.scheduledTime === undefined) continue
      
      const taskStart = task.scheduledTime
      const taskEnd = taskStart + task.duration
      
      if ((startTime < taskEnd && endTime > taskStart)) {
        return false
      }
    }
    
    return true
  }

  return (
    <DayContext.Provider
      value={{
        state,
        startNewDay,
        setDayState,
        activateDay,
        completeDay,
        addTaskToDay,
        addTaskLog,
        setHighPriorityTask,
        canModifySchedule,
        canRescheduleTask,
        validateTimeSlot,
      }}
    >
      {children}
    </DayContext.Provider>
  )
}

export function useDay() {
  const context = useContext(DayContext)
  if (context === undefined) {
    throw new Error('useDay must be used within a DayProvider')
  }
  return context
}