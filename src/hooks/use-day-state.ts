'use client'

import { useDayStore } from '@/store/day-store'
import { DayState, DayStatus, Task, TaskLog } from '@/types'
import { BusinessHoursService } from '@/lib/business-hours'

export function useDayState() {
  const dayStore = useDayStore()

  const startNewDay = (date: string) => {
    dayStore.startNewDay(date)
  }

  const setDayState = (dayState: DayState) => {
    dayStore.setDayState(dayState)
  }

  const activateDay = () => {
    dayStore.updateDayStatus(DayStatus.ACTIVE)
  }

  const completeDay = () => {
    dayStore.updateDayStatus(DayStatus.COMPLETED)
  }

  const addTaskToDay = (task: Task) => {
    if (!dayStore.currentDay) return
    
    // Check if adding this task would violate high priority exclusivity
    const hasHighPriorityTask = dayStore.currentDay.tasks.some(t => t.priority >= 7)
    
    if (task.priority >= 7 && hasHighPriorityTask && dayStore.currentDay.highPriorityTaskId !== task.id) {
      throw new Error('Only one task can have high priority (7-10)')
    }
    
    const updatedTasks = [...dayStore.currentDay.tasks, task]
    
    dayStore.setDayState({
      ...dayStore.currentDay,
      tasks: updatedTasks,
      hasHighPriorityTask: task.priority >= 7,
      highPriorityTaskId: task.priority >= 7 ? task.id : dayStore.currentDay.highPriorityTaskId,
    })
  }

  const addTaskLog = (log: TaskLog) => {
    if (!dayStore.currentDay) return
    
    dayStore.setDayState({
      ...dayStore.currentDay,
      immutableLog: [...dayStore.currentDay.immutableLog, log],
    })
  }

  const setHighPriorityTask = (taskId: string | undefined) => {
    if (!dayStore.currentDay) return
    
    dayStore.setDayState({
      ...dayStore.currentDay,
      hasHighPriorityTask: !!taskId,
      highPriorityTaskId: taskId,
    })
  }

  const canModifySchedule = (): boolean => {
    return dayStore.currentDay?.status === DayStatus.PLANNING
  }

  const canRescheduleTask = (task: Task): boolean => {
    if (!canModifySchedule()) return false
    
    const rescheduleableTypes = ['meeting', 'class', 'appointment']
    return rescheduleableTypes.includes(task.type)
  }

  const validateTimeSlot = (startTime: number, duration: number, excludeTaskId?: string, date?: string): boolean => {
    if (!dayStore.currentDay) return false
    
    // Validate 15-minute granularity
    if (startTime % 0.25 !== 0 || duration % 0.25 !== 0) {
      return false
    }
    
    // Use configurable business hours
    const taskDate = date ? new Date(date) : new Date()
    const businessHoursConfig = BusinessHoursService.getBusinessHours()
    
    // Check if task time is within business hours
    const taskEnd = startTime + duration
    let isWithinBusinessHours = true
    
    // Check each quarter-hour segment of the task
    for (let time = startTime; time < taskEnd; time += 0.25) {
      if (!BusinessHoursService.isBusinessHour(time, taskDate)) {
        isWithinBusinessHours = false
        break
      }
    }
    
    if (!isWithinBusinessHours) {
      return false
    }
    
    const endTime = startTime + duration
    
    for (const task of dayStore.currentDay.tasks) {
      if (task.id === excludeTaskId || task.scheduledTime === undefined) continue
      
      const taskStart = task.scheduledTime
      const taskEnd = taskStart + task.duration
      
      if ((startTime < taskEnd && endTime > taskStart)) {
        return false
      }
    }
    
    return true
  }

  return {
    state: {
      currentDay: dayStore.currentDay,
      isLoading: false,
      error: null,
    },
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
  }
}