'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Target, CheckCircle, AlertCircle } from 'lucide-react'

function AuthSuccessContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Finalizing authentication...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkUserProfile } = useAuth()

  const nextUrl = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    const finalizeAuthentication = async () => {
      try {
        const supabase = createClient()
        
        if (!supabase) {
          // Mock success for development
          setTimeout(() => {
            setStatus('success')
            setMessage('Authentication successful! Redirecting...')
            setTimeout(() => {
              router.push('/onboarding')
            }, 1500)
          }, 1000)
          return
        }

        // Get current session (should be set by server callback)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!session?.user) {
          // Try to get user directly
          const { data: { user } } = await supabase.auth.getUser()
          
          if (!user) {
            throw new Error('No authenticated user found')
          }
          
          // Wait for session to be established
          await new Promise(resolve => setTimeout(resolve, 2000))
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          
          if (!retrySession?.user) {
            throw new Error('Failed to establish session')
          }
        }

        // Check if user has completed onboarding
        const userId = session?.user?.id || ''
        if (!userId) {
          throw new Error('No user ID found')
        }
        const profileCheck = await checkUserProfile(userId)
        
        setStatus('success')
        setMessage('Authentication successful! Redirecting...')
        
        setTimeout(() => {
          if (profileCheck.hasCompletedOnboarding) {
            router.push(nextUrl)
          } else {
            router.push('/onboarding')
          }
        }, 1500)
        
      } catch (err) {
        console.error('Auth success error:', err)
        setStatus('error')
        setMessage('Failed to finalize authentication. Please try again.')
      }
    }

    finalizeAuthentication()
  }, [nextUrl, router, checkUserProfile])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-gray-300 to-transparent rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-gray-200 to-transparent rounded-full opacity-25 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Success</h1>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg p-8">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin"></div>
                <p className="text-gray-300 text-center">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <p className="text-green-400 text-center font-medium">{message}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Redirecting to {nextUrl === '/dashboard' ? 'your dashboard' : nextUrl}...
                </p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 text-red-500" />
                <p className="text-red-400 text-center font-medium">{message}</p>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-black rounded-lg hover:from-gray-400 hover:to-gray-600 transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    onClick={() => router.push('/auth/debug')}
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Debug Info
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading authentication...</p>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  )
}