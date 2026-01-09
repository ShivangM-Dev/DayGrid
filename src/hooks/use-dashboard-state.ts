'use client'

import { useState, useEffect } from 'react'
import { useDayState } from './use-day-state'
import { useTasks } from './use-tasks'
import { format, subDays } from 'date-fns'
import { Task } from '@/types'

export type DashboardState = 'unplanned' | 'planning' | 'active'

interface DashboardStateReturn {
  currentState: DashboardState
  transitionTo: (state: DashboardState) => void
  canTransitionTo: (state: DashboardState) => boolean
  previousDayTasks: Task[]
  previousDayProgress: {
    total: number
    completed: number
    productivity: number
  }
}

export function useDashboardState(): DashboardStateReturn {
  const { state: dayState } = useDayState()
  const { tasks } = useTasks()
  const [currentState, setCurrentState] = useState<DashboardState>('unplanned')

  // Get previous day's data (filter tasks that were from yesterday based on createdAt)
  const yesterday = subDays(new Date(), 1)
  const yesterdayString = format(yesterday, 'yyyy-MM-dd')
  
  const previousDayTasks = tasks.filter((task: Task) => {
    const taskDate = format(task.createdAt, 'yyyy-MM-dd')
    return taskDate === yesterdayString
  })
  
  const previousDayProgress = {
    total: previousDayTasks.length,
    completed: previousDayTasks.filter((t: Task) => t.completed).length,
    productivity: previousDayTasks.length > 0 
      ? Math.round((previousDayTasks.filter((t: Task) => t.completed).length / previousDayTasks.length) * 100)
      : 0
  }

  // Auto-determine state based on day state
  useEffect(() => {
    if (!dayState.currentDay) {
      setCurrentState('unplanned')
    } else if (dayState.currentDay.status === 'planning') {
      setCurrentState('planning')
    } else if (dayState.currentDay.status === 'active') {
      setCurrentState('active')
    } else if (dayState.currentDay.status === 'completed') {
      // If day is completed, reset to unplanned for next day
      setCurrentState('unplanned')
    }
  }, [dayState.currentDay])

  const transitionTo = (state: DashboardState) => {
    if (canTransitionTo(state)) {
      setCurrentState(state)
    }
  }

  const canTransitionTo = (state: DashboardState): boolean => {
    switch (currentState) {
      case 'unplanned':
        return state === 'planning'
      case 'planning':
        return state === 'active'
      case 'active':
        return false // Can't transition from active (must complete day first)
      default:
        return false
    }
  }

  return {
    currentState,
    transitionTo,
    canTransitionTo,
    previousDayTasks,
    previousDayProgress
  }
}