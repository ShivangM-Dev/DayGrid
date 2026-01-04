'use client'

import { useTaskStore } from '@/store/task-store'
import { Task, TaskType } from '@/types'
import { useDayState } from './use-day-state'
import { useAuth } from './use-auth'
import { taskService, isRealSupabase, subscribeToTasks } from '@/lib/supabase/database-service'
import { useState, useEffect } from 'react'

export function useTasks() {
  const taskStore = useTaskStore()
  const { canModifySchedule } = useDayState()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load tasks from Supabase when user is authenticated
  useEffect(() => {
    if (user && isRealSupabase) {
      loadTasksFromSupabase()
      
      // Set up real-time subscription
      const subscription = subscribeToTasks(user.id, (payload: any) => {
        console.log('Real-time task update:', payload)
        
        // Refresh tasks when changes occur
        if (payload.eventType === 'INSERT' || 
            payload.eventType === 'UPDATE' || 
            payload.eventType === 'DELETE') {
          loadTasksFromSupabase()
        }
      })
      
      return () => {
        subscription?.unsubscribe()
      }
    }
  }, [user?.id])

  const loadTasksFromSupabase = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await taskService.getTasks(user.id)
      
      if (error) {
        console.error('Error loading tasks:', error)
        setError(error.message)
      } else if (data) {
        // Convert Supabase data to Task format
        const tasks = data.map((dbTask: any) => ({
          id: dbTask.id,
          userId: dbTask.user_id,
          title: dbTask.title,
          priority: dbTask.priority,
          duration: dbTask.duration,
          type: dbTask.type as TaskType,
          scheduledTime: dbTask.scheduled_time,
          completed: dbTask.completed,
          failed: dbTask.failed,
          abandoned: dbTask.abandoned,
          isLocked: dbTask.is_locked,
          createdAt: new Date(dbTask.created_at),
          updatedAt: new Date(dbTask.updated_at),
        }))
        
        // Update local store with Supabase data
        taskStore.clearTasks()
        tasks.forEach((task: Task) => taskStore.addTask(task))
      }
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

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

    // If Supabase is available, also save there
    if (user && isRealSupabase) {
      try {
        const { data, error } = await taskService.createTask({
          userId: user.id,
          title: task.title,
          priority: task.priority,
          duration: task.duration,
          type: task.type,
          scheduledTime: task.scheduledTime,
          completed: task.completed,
          failed: task.failed,
          abandoned: task.abandoned,
          isLocked: task.isLocked,
        })

        if (error) {
          console.error('Error creating task in Supabase:', error)
          setError(error.message)
          
          // Remove from local store if Supabase failed
          taskStore.deleteTask(task.id)
        } else if (data) {
          // Replace local task with Supabase task
          taskStore.deleteTask(task.id)
          const updatedTask: Task = {
            ...task,
            id: data.id,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
          taskStore.addTask(updatedTask)
        }
      } catch (err) {
        console.error('Error creating task:', err)
        setError(err instanceof Error ? err.message : 'Failed to create task')
        taskStore.deleteTask(task.id)
      }
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setError(null)
    
    // Always update local store first
    taskStore.updateTask(id, { ...updates, updatedAt: new Date() })

    // If Supabase is available, also update there
    if (user && isRealSupabase) {
      try {
        const { data, error } = await taskService.updateTask(id, updates, user.id)

        if (error) {
          console.error('Error updating task in Supabase:', error)
          setError(error.message)
          // Could implement rollback logic here if needed
        } else if (data) {
          // Sync with Supabase data
          taskStore.updateTask(id, {
            ...updates,
            updatedAt: new Date(data.updated_at),
          })
        }
      } catch (err) {
        console.error('Error updating task:', err)
        setError(err instanceof Error ? err.message : 'Failed to update task')
      }
    }
  }

  const deleteTask = async (id: string) => {
    setError(null)
    
    // Store task in case we need to restore it
    const taskToDelete = taskStore.tasks.find(t => t.id === id)
    
    // Always remove from local store first
    taskStore.deleteTask(id)

    // If Supabase is available, also delete there
    if (user && isRealSupabase) {
      try {
        const { error } = await taskService.deleteTask(id, user.id)

        if (error) {
          console.error('Error deleting task in Supabase:', error)
          setError(error.message)
          
          // Restore task if Supabase deletion failed
          if (taskToDelete) {
            taskStore.addTask(taskToDelete)
          }
        }
      } catch (err) {
        console.error('Error deleting task:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete task')
        
        // Restore task if Supabase deletion failed
        if (taskToDelete) {
          taskStore.addTask(taskToDelete)
        }
      }
    }
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
    refreshTasks: isRealSupabase ? loadTasksFromSupabase : undefined,
    isRealSupabase,
  }
}