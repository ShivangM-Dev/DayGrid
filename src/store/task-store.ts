import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, TaskType } from '@/types'

interface TaskStore {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTasksByType: (type: TaskType) => Task[]
  getHighPriorityTasks: () => Task[]
  getScheduledTasks: () => Task[]
  getUnscheduledTasks: () => Task[]
  clearTasks: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id 
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      getTasksByType: (type) => {
        return get().tasks.filter(task => task.type === type)
      },
      
      getHighPriorityTasks: () => {
        return get().tasks.filter(task => task.priority >= 7)
      },
      
      getScheduledTasks: () => {
        return get().tasks.filter(task => task.scheduledTime !== undefined)
      },
      
      getUnscheduledTasks: () => {
        return get().tasks.filter(task => task.scheduledTime === undefined)
      },
      
      clearTasks: () => set({ tasks: [] })
    }),
    {
      name: 'daygrid-tasks-storage',
    }
  )
)