'use client'

import { useTaskStore } from '@/store/task-store'
import { Task, TaskType } from '@/types'
import { useDayState } from './use-day-state'

export function useTasks() {
  const taskStore = useTaskStore()
  const { canModifySchedule } = useDayState()

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    taskStore.addTask(task)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    taskStore.updateTask(id, updates)
  }

  const deleteTask = (id: string) => {
    taskStore.deleteTask(id)
  }

  const scheduleTask = (id: string, time: number) => {
    if (!canModifySchedule()) return
    taskStore.updateTask(id, { scheduledTime: time })
  }

  const completeTask = (id: string) => {
    taskStore.updateTask(id, { completed: true })
  }

  const failTask = (id: string) => {
    taskStore.updateTask(id, { failed: true })
  }

  const abandonTask = (id: string) => {
    taskStore.updateTask(id, { abandoned: true })
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
    isLoading: false,
    error: null,
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
  }
}