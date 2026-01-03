import { z } from 'zod'
import { TaskType } from '@/types'

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title must be less than 200 characters'),
  priority: z.number().min(1, 'Priority must be between 1 and 10').max(10, 'Priority must be between 1 and 10'),
  duration: z.number().min(0.5, 'Duration must be at least 0.5 hours').max(8, 'Duration cannot exceed 8 hours'),
  type: z.nativeEnum(TaskType),
  scheduledTime: z.number().min(0).max(23).optional(),
  completed: z.boolean().default(false),
  failed: z.boolean().default(false),
  abandoned: z.boolean().default(false),
  isLocked: z.boolean().default(false),
})

export const createTaskSchema = taskSchema.pick({
  title: true,
  priority: true,
  duration: true,
  type: true,
})

export const scheduleTaskSchema = taskSchema.pick({
  scheduledTime: true,
}).extend({
  taskId: z.string().min(1, 'Task ID is required'),
})

export const updateTaskSchema = taskSchema.partial().extend({
  taskId: z.string().min(1, 'Task ID is required'),
})

export const taskActionSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  action: z.enum(['complete', 'fail', 'abandon']),
})

export const daySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['planning', 'active', 'completed']),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
})

export const startDaySchema = daySchema.pick({
  date: true,
})

export const validateTaskData = (data: unknown) => {
  return taskSchema.safeParse(data)
}

export const validateCreateTaskData = (data: unknown) => {
  return createTaskSchema.safeParse(data)
}

export const validateScheduleTaskData = (data: unknown) => {
  return scheduleTaskSchema.safeParse(data)
}

export const validateUpdateTaskData = (data: unknown) => {
  return updateTaskSchema.safeParse(data)
}

export const validateTaskActionData = (data: unknown) => {
  return taskActionSchema.safeParse(data)
}