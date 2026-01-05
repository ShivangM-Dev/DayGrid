'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { userService } from '@/lib/supabase/database-service'
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
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

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
          // Check if user has completed onboarding
          const profileCheck = await userService.profileExists(session.user.id)
          
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profileCheck.profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            timezone: profileCheck.profile?.timezone || 'UTC',
            preferences: profileCheck.profile?.preferences || {
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
          
          setHasCompletedOnboarding(profileCheck.hasCompletedOnboarding || false)
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
          setHasCompletedOnboarding(false)
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
          // Check if user has completed onboarding
          const profileCheck = await userService.profileExists(session.user.id)
          
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profileCheck.profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            timezone: profileCheck.profile?.timezone || 'UTC',
            preferences: profileCheck.profile?.preferences || {
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
          
          setHasCompletedOnboarding(profileCheck.hasCompletedOnboarding || false)
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
          setHasCompletedOnboarding(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock login for development
      console.log('Mock login:', email)
      return { user: { id: 'mock_user_' + Date.now() } }
    }

    const supabase = createClient()
    if (!supabase) {
      console.log('Mock login:', email)
      return { user: { id: 'mock_user_' + Date.now() } }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock Google login for development
      console.log('Mock Google login')
      // In mock mode, simulate successful OAuth by redirecting to callback
      window.location.href = '/auth/callback?access_token=mock_token&refresh_token=mock_refresh'
      return { user: { id: 'mock_google_user_' + Date.now() } }
    }

    const supabase = createClient()
    if (!supabase) {
      console.log('Mock Google login - redirecting to callback')
      // In mock mode, simulate successful OAuth by redirecting to callback
      window.location.href = '/auth/callback?access_token=mock_token&refresh_token=mock_refresh'
      return { user: { id: 'mock_google_user_' + Date.now() } }
    }

    console.log('Starting Google OAuth flow...')
    const redirectUrl = `${window.location.origin}/auth/callback`
    console.log('OAuth redirect URL:', redirectUrl)

    // Add debugging - log current environment
    console.log('Environment:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      currentOrigin: window.location.origin,
      redirectUrl
    })

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('OAuth error:', error)
      // Add user-friendly error and redirect to debug page
      window.location.href = `/auth/debug?error=${encodeURIComponent(error.message)}`
      throw error
    }

    console.log('OAuth initiated:', data)
    // The OAuth flow should redirect to Google, so we may not reach this point
    return data
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock signup for development
      console.log('Mock signup:', email, name)
      return { user: { id: 'mock_user_' + Date.now() } }
    }

    const supabase = createClient()
    if (!supabase) {
      console.log('Mock signup:', email, name)
      return { user: { id: 'mock_user_' + Date.now() } }
    }

    const { data, error } = await supabase.auth.signUp({
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

    return data
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

  const checkUserProfile = useCallback(async (userId: string) => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock for development - assume onboarding completed
      return { exists: true, hasCompletedOnboarding: true }
    }

    const result = await userService.profileExists(userId)
    return result
  }, [])

  const completeOnboarding = useCallback(async (onboardingData: {
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
  }) => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock for development
      console.log('Mock complete onboarding:', onboardingData)
      setHasCompletedOnboarding(true)
      return { data: null, error: null }
    }

    if (!authState.user) {
      throw new Error('User not authenticated')
    }

    const result = await userService.completeOnboarding(authState.user.id, onboardingData)
    
    if (!result.error) {
      setHasCompletedOnboarding(true)
      // Update user state with new preferences
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          name: onboardingData.name,
          timezone: onboardingData.timezone,
          preferences: onboardingData.preferences,
          updatedAt: new Date(),
        } : null
      }))
    }
    
    return result
  }, [authState.user])

  return {
    ...authState,
    hasCompletedOnboarding,
    login,
    loginWithGoogle,
    signup,
    logout,
    checkUserProfile,
    completeOnboarding,
  }
}