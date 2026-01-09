'use client'

import { createClient } from '@/lib/supabase/client'

// Initialize Supabase client
const supabase = createClient()

// Mock user ID for local mode
const MOCK_USER_ID = 'local_user'

// Check if we're using real Supabase or mock mode
export const isRealSupabase = false // Force local mode

// Simple helper to bypass TypeScript issues
function supabaseFrom(table: string) {
  if (!supabase) return null
  return (supabase as any).from(table)
}

// User operations
export const userService = {
  // Get current user profile
  async getProfile(userId: string = MOCK_USER_ID) {
    return { data: null, error: null }
  },

  // Check if user profile exists (for onboarding flow)
  async profileExists(userId: string = MOCK_USER_ID) {
    return { 
      exists: false, 
      hasCompletedOnboarding: true, // Assume completed for local mode
      profile: null,
      error: null
    }
  },

  // Create/update user profile
  async upsertProfile(user: any) {
    return { data: null, error: null }
  },

  // Complete onboarding with full user profile
  async completeOnboarding(userId: string = MOCK_USER_ID, onboardingData: {
    name: string;
    timezone: string;
    preferences: {
      workingHours: { start: number; end: number };
      defaultTaskDuration: number;
      notifications: {
        taskReminders: boolean;
        dayStart: boolean;
        deadlineAlerts: boolean;
      };
      theme: 'light' | 'dark' | 'system';
    };
  }) {
    return { data: null, error: null }
  }
}

// Task operations
export const taskService = {
  // Get all tasks for a user
  async getTasks(userId: string = MOCK_USER_ID) {
    return { data: [], error: null }
  },

  // Create a new task
  async createTask(task: any) {
    return { data: null, error: null }
  },

  // Update a task
  async updateTask(taskId: string, updates: any, userId: string = MOCK_USER_ID) {
    return { data: null, error: null }
  },

  // Delete a task
  async deleteTask(taskId: string, userId: string = MOCK_USER_ID) {
    return { data: null, error: null }
  }
}

// Day operations
export const dayService = {
  // Get day state for a user and date
  async getDay(userId: string = MOCK_USER_ID, date: string) {
    return { data: null, error: null }
  },

  // Create or update day state
  async upsertDay(day: any) {
    return { data: null, error: null }
  },

  // Complete a day
  async completeDay(userId: string = MOCK_USER_ID, date: string) {
    return { data: null, error: null }
  }
}

// Real-time subscriptions (disabled in local mode)
export function subscribeToTasks(userId: string = MOCK_USER_ID, callback: (payload: any) => void) {
  return { unsubscribe: () => {} }
}

export function subscribeToDays(userId: string = MOCK_USER_ID, callback: (payload: any) => void) {
  return { unsubscribe: () => {} }
}