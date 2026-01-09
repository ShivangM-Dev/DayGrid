'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Task, TaskType } from '@/types'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SCHEDULE_TASK'; payload: { id: string; time: number } }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'FAIL_TASK'; payload: string }
  | { type: 'ABANDON_TASK'; payload: string }

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        error: null,
      }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
        error: null,
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        error: null,
      }
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        error: null,
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
    case 'SCHEDULE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, scheduledTime: action.payload.time, updatedAt: new Date() }
            : task
        ),
      }
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: true, updatedAt: new Date() }
            : task
        ),
      }
    case 'FAIL_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, failed: true, updatedAt: new Date() }
            : task
        ),
      }
    case 'ABANDON_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, abandoned: true, updatedAt: new Date() }
            : task
        ),
      }
    default:
      return state
  }
}

interface TaskContextType {
  state: TaskState
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  scheduleTask: (id: string, time: number) => void
  completeTask: (id: string) => void
  failTask: (id: string) => void
  abandonTask: (id: string) => void
  setTasks: (tasks: Task[]) => void
  getTasksByType: (type: TaskType) => Task[]
  getHighPriorityTasks: () => Task[]
  getScheduledTasks: () => Task[]
  getUnscheduledTasks: () => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Check if adding this task would violate specific priority exclusivity
    if (taskData.priority >= 7) {
      const existingTaskWithSamePriority = state.tasks.find(task => task.priority === taskData.priority)
      
      if (existingTaskWithSamePriority) {
        throw new Error(`Only one task can have priority ${taskData.priority}`)
      }
    }

    const task: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    dispatch({ type: 'ADD_TASK', payload: task })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    // Check if updating priority would violate specific priority exclusivity
    if (updates.priority !== undefined && updates.priority >= 7) {
      const existingTaskWithSamePriority = state.tasks.find(task => 
        task.priority === updates.priority && task.id !== id
      )
      
      if (existingTaskWithSamePriority) {
        throw new Error(`Only one task can have priority ${updates.priority}`)
      }
    }

    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } })
  }

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }

  const scheduleTask = (id: string, time: number) => {
    dispatch({ type: 'SCHEDULE_TASK', payload: { id, time } })
  }

  const completeTask = (id: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: id })
  }

  const failTask = (id: string) => {
    dispatch({ type: 'FAIL_TASK', payload: id })
  }

  const abandonTask = (id: string) => {
    dispatch({ type: 'ABANDON_TASK', payload: id })
  }

  const setTasks = (tasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: tasks })
  }

  const getTasksByType = (type: TaskType): Task[] => {
    return state.tasks.filter(task => task.type === type)
  }

  const getHighPriorityTasks = (): Task[] => {
    return state.tasks.filter(task => task.priority >= 7)
  }

  const getScheduledTasks = (): Task[] => {
    return state.tasks.filter(task => task.scheduledTime !== undefined)
  }

  const getUnscheduledTasks = (): Task[] => {
    return state.tasks.filter(task => task.scheduledTime === undefined)
  }

  return (
    <TaskContext.Provider
      value={{
        state,
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
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}