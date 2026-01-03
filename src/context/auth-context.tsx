'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual authentication with Supabase
      // For now, simulate a successful login
      const mockUser: User = {
        id: 'user_1',
        email,
        name: email.split('@')[0],
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
      setUser(mockUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual signup with Supabase
      // For now, simulate a successful signup
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
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
      setUser(mockUser)
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    // TODO: Implement actual logout with Supabase
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}