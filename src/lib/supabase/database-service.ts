'use client'

import { createClient } from '@/lib/supabase/client'

// Initialize Supabase client
const supabase = createClient()

// Check if we're using real Supabase or mock mode
export const isRealSupabase = !!supabase

// Simple helper to bypass TypeScript issues
function supabaseFrom(table: string) {
  if (!supabase) return null
  return (supabase as any).from(table)
}

// User operations
export const userService = {
  // Get current user profile
  async getProfile(userId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Create/update user profile
  async upsertProfile(user: any) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('users')
      .upsert(user)
      .select()
      .single()
    
    return { data, error }
  }
}

// Task operations
export const taskService = {
  // Get all tasks for a user
  async getTasks(userId: string) {
    if (!supabase) return { data: [], error: null }
    
    const { data, error } = await supabaseFrom('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  },

  // Create a new task
  async createTask(task: any) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('tasks')
      .insert({
        id: crypto.randomUUID(),
        user_id: task.userId,
        title: task.title,
        priority: task.priority,
        duration: task.duration,
        type: task.type,
        scheduled_time: task.scheduledTime || null,
        completed: task.completed || false,
        failed: task.failed || false,
        abandoned: task.abandoned || false,
        is_locked: task.isLocked || false,
      })
      .select()
      .single()
    
    return { data, error }
  },

  // Update a task
  async updateTask(taskId: string, updates: any, userId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('tasks')
      .update({
        title: updates.title,
        priority: updates.priority,
        duration: updates.duration,
        type: updates.type,
        scheduled_time: updates.scheduledTime || null,
        completed: updates.completed,
        failed: updates.failed,
        abandoned: updates.abandoned,
        is_locked: updates.isLocked,
      })
      .eq('id', taskId)
      .eq('user_id', userId) // Security: ensure user owns task
      .select()
      .single()
    
    return { data, error }
  },

  // Delete a task
  async deleteTask(taskId: string, userId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId) // Security: ensure user owns task
      .select()
      .single()
    
    return { data, error }
  }
}

// Day operations
export const dayService = {
  // Get day state for a user and date
  async getDay(userId: string, date: string) {
    if (!supabase) return { data: null, error: null }
    
    const { data, error } = await supabaseFrom('days')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()
    
    return { data, error }
  },

  // Create or update day state
  async upsertDay(day: any) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('days')
      .upsert({
        id: day.id || crypto.randomUUID(),
        user_id: day.userId,
        date: day.date,
        status: day.status,
        start_time: day.startTime ? day.startTime.toISOString() : null,
        end_time: day.endTime ? day.endTime.toISOString() : null,
        has_high_priority_task: day.hasHighPriorityTask || false,
        high_priority_task_id: day.highPriorityTaskId || null,
      })
      .select()
      .single()
    
    return { data, error }
  },

  // Complete a day
  async completeDay(userId: string, date: string) {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') }
    
    const { data, error } = await supabaseFrom('days')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('date', date)
      .select()
      .single()
    
    return { data, error }
  }
}

// Real-time subscriptions
export function subscribeToTasks(userId: string, callback: (payload: any) => void) {
  if (!supabase) return { unsubscribe: () => {} }

  const channel = (supabase as any)
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()

  return {
    unsubscribe: () => (supabase as any).removeChannel(channel)
  }
}

export function subscribeToDays(userId: string, callback: (payload: any) => void) {
  if (!supabase) return { unsubscribe: () => {} }

  const channel = (supabase as any)
    .channel('days-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'days',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()

  return {
    unsubscribe: () => (supabase as any).removeChannel(channel)
  }
}