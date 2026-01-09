'use client'

import { useTaskStore } from '@/store/task-store'
import { Task, TaskType } from '@/types'
import { useDayState } from './use-day-state'
import { taskService, isRealSupabase, subscribeToTasks } from '@/lib/supabase/database-service'
import { useState, useEffect } from 'react'

export function useTasks() {
  const taskStore = useTaskStore()
  const { canModifySchedule } = useDayState()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // No auth - just use local state

  // Removed Supabase integration - local only

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null)
    
    const task: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Always add to local store first for immediate UI updates
    taskStore.addTask(task)

    // Local only - no Supabase integration
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setError(null)
    
    // Always update local store first
    taskStore.updateTask(id, { ...updates, updatedAt: new Date() })

    // Local only - no Supabase integration
  }

  const deleteTask = async (id: string) => {
    setError(null)
    
    // Store task in case we need to restore it
    const taskToDelete = taskStore.tasks.find(t => t.id === id)
    
    // Always remove from local store first
    taskStore.deleteTask(id)

    // Local only - no Supabase integration
  }

  const scheduleTask = async (id: string, time: number) => {
    if (!canModifySchedule()) return
    
    await updateTask(id, { scheduledTime: time })
  }

  const completeTask = async (id: string) => {
    await updateTask(id, { completed: true })
  }

  const failTask = async (id: string) => {
    await updateTask(id, { failed: true })
  }

  const abandonTask = async (id: string) => {
    await updateTask(id, { abandoned: true })
  }

  const setTasks = (tasks: Task[]) => {
    taskStore.clearTasks()
    tasks.forEach(task => taskStore.addTask(task))
  }

  const getTasksByType = (type: TaskType): Task[] => {
    return taskStore.getTasksByType(type)
  }

  const getHighPriorityTasks = (): Task[] => {
    return taskStore.getHighPriorityTasks()
  }

  const getScheduledTasks = (): Task[] => {
    return taskStore.getScheduledTasks()
  }

  const getUnscheduledTasks = (): Task[] => {
    return taskStore.getUnscheduledTasks()
  }

  return {
    tasks: taskStore.tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    scheduleTask,
    completeTask,
    failTask,
    abandonTask,
    setTasks,
    getTasksByType,
    getHighPriorityTasks,
    getScheduledTasks,
    getUnscheduledTasks,
    refreshTasks: undefined,
    isRealSupabase: false,
  }
}