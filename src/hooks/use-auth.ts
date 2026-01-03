'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check if we're in browser and have Supabase configured
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Server-side or no Supabase config - use mock auth
      const mockUser: User = {
        id: 'mock_user_1',
        email: 'demo@daygrid.com',
        name: 'Demo User',
        timezone: 'UTC',
        preferences: {
          workingHours: { start: 9, end: 17 },
          defaultTaskDuration: 1,
          notifications: {
            taskReminders: true,
            dayStart: true,
            deadlineAlerts: true,
          },
          theme: 'light',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      })
      return
    }

    const supabase = createClient()
    if (!supabase) {
      // Fallback to mock if no client
      const mockUser: User = {
        id: 'mock_user_1',
        email: 'demo@daygrid.com',
        name: 'Demo User',
        timezone: 'UTC',
        preferences: {
          workingHours: { start: 9, end: 17 },
          defaultTaskDuration: 1,
          notifications: {
            taskReminders: true,
            dayStart: true,
            deadlineAlerts: true,
          },
          theme: 'light',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      })
      return
    }

    // Real Supabase auth
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            timezone: 'UTC',
            preferences: {
              workingHours: { start: 9, end: 17 },
              defaultTaskDuration: 1,
              notifications: {
                taskReminders: true,
                dayStart: true,
                deadlineAlerts: true,
              },
              theme: 'light',
            },
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date(),
          }
          
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            timezone: 'UTC',
            preferences: {
              workingHours: { start: 9, end: 17 },
              defaultTaskDuration: 1,
              notifications: {
                taskReminders: true,
                dayStart: true,
                deadlineAlerts: true,
              },
              theme: 'light',
            },
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date(),
          }
          
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock login for development
      console.log('Mock login:', email)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      console.log('Mock login:', email)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock signup for development
      console.log('Mock signup:', email, name)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      console.log('Mock signup:', email, name)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock logout for development
      console.log('Mock logout')
      return
    }

    const supabase = createClient()
    if (!supabase) {
      console.log('Mock logout')
      return
    }

    await supabase.auth.signOut()
  }, [])

  return {
    ...authState,
    login,
    signup,
    logout,
  }
}