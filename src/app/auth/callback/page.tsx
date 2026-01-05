'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Target, CheckCircle, AlertCircle, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'

function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const [debugInfo, setDebugInfo] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkUserProfile } = useAuth()

  // Log all URL parameters for debugging
  useEffect(() => {
    // Check both query params AND hash fragments
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Also check hash parameters (they come after #)
    let hashAccessToken: string | undefined
    let hashRefreshToken: string | undefined
    let hashCode: string | undefined
    let hashError: string | undefined
    
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.startsWith('#')) {
        const params = new URLSearchParams(hash.substring(1))
        hashAccessToken = params.get('access_token') || undefined
        hashRefreshToken = params.get('refresh_token') || undefined
        hashCode = params.get('code') || undefined
        hashError = params.get('error') || undefined
      }
    }
    
    const allParams = {
      ...queryParams,
      code: queryParams.code || hashCode,
      error: queryParams.error || hashError,
      access_token: queryParams.access_token || hashAccessToken,
      refresh_token: queryParams.refresh_token || hashRefreshToken
    }
    
    setDebugInfo(JSON.stringify(allParams, null, 2))
    console.log('All URL parameters (query + hash):', allParams)
  }, [searchParams])

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Extract parameters from both query and hash
      const queryParams = Object.fromEntries(searchParams.entries())
      
      let hashAccessToken: string | undefined
      let hashRefreshToken: string | undefined
      
      if (typeof window !== 'undefined') {
        const hash = window.location.hash
        if (hash.startsWith('#')) {
          const params = new URLSearchParams(hash.substring(1))
          hashAccessToken = params.get('access_token') || undefined
          hashRefreshToken = params.get('refresh_token') || undefined
        }
      }
      
      const code = queryParams.code
      const error = queryParams.error
      const accessToken = queryParams.access_token || hashAccessToken
      const refreshToken = queryParams.refresh_token || hashRefreshToken
      
      console.log('Final extracted params:', { code, error, accessToken, refreshToken })
      
      if (error) {
        setStatus('error')
        setMessage(`Authentication failed: ${error}`)
        return
      }

      const supabase = createClient()
      if (!supabase) {
        console.log('Using mock mode for authentication')
        setTimeout(() => {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          setTimeout(() => {
            router.push('/onboarding')
          }, 1500)
        }, 1000)
        return
      }

      try {
        let userSession = null
        let attempts = 0
        const maxAttempts = 8

        // Enhanced session detection with multiple methods and attempts
        const detectSession = async (): Promise<any> => {
          attempts++
          console.log(`Session detection attempt ${attempts}/${maxAttempts}`)
          
          // Method 1: Direct session check
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          console.log('Direct session check:', { session, sessionError })
          
          if (session?.user) {
            return session
          }

          // Method 2: Use tokens if available
          if (accessToken && refreshToken && !session) {
            console.log('Setting session with tokens...')
            const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            console.log('Set session result:', { sessionData, setSessionError })
            
            if (!setSessionError && sessionData?.user) {
              return sessionData
            }
          }

          // Method 3: Try getUser if no session
          if (!session?.user && !accessToken) {
            console.log('Trying getUser method...')
            const { data: { user } } = await supabase.auth.getUser()
            console.log('getUser result:', { user })
            
            if (user) {
              return { user }
            }
          }

          // Wait and retry if we haven't exceeded attempts
          if (attempts < maxAttempts) {
            const delay = Math.min(1000 * attempts, 3000) // Progressive delay
            console.log(`Waiting ${delay}ms before retry...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            return null
          }

          return null
        }

        // Try multiple attempts with delays
        while (attempts < maxAttempts && !userSession) {
          userSession = await detectSession()
        }

        if (userSession?.user) {
          console.log('✅ User authenticated successfully:', userSession.user.email)
          
          // Check if user has completed onboarding
          let profileCheck
          try {
            profileCheck = await checkUserProfile(userSession.user.id)
            console.log('Profile check:', profileCheck)
          } catch (profileError) {
            console.warn('Profile check failed, assuming new user:', profileError)
            // Assume new user if profile check fails
            profileCheck = { hasCompletedOnboarding: false }
          }
          
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Add more debugging before redirect
          console.log('About to redirect to:', profileCheck.hasCompletedOnboarding ? '/dashboard' : '/onboarding')
          
          // Try multiple redirect methods
          setTimeout(() => {
            if (profileCheck.hasCompletedOnboarding) {
              console.log('Redirecting to dashboard...')
              try {
                router.push('/dashboard')
                // Fallback redirect if router.push fails
                setTimeout(() => {
                  window.location.href = '/dashboard'
                }, 500)
              } catch (routerError) {
                console.error('Router push failed:', routerError)
                window.location.href = '/dashboard'
              }
            } else {
              console.log('Redirecting to onboarding...')
              try {
                router.push('/onboarding')
                // Fallback redirect if router.push fails
                setTimeout(() => {
                  window.location.href = '/onboarding'
                }, 500)
              } catch (routerError) {
                console.error('Router push failed:', routerError)
                window.location.href = '/onboarding'
              }
            }
          }, 1000) // Reduced delay
        } else {
          console.log('❌ No user session found after all attempts')
          setStatus('error')
          setMessage('Authentication completed but session not found. Please try again.')
          
          // Redirect to debug page after error
          setTimeout(() => {
            router.push('/auth/debug')
          }, 2000)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage(`Authentication error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    handleAuthCallback()
  }, [searchParams, router, checkUserProfile])

  const handleRetry = async () => {
    setIsRetrying(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRetrying(false)
    window.location.reload()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-gray-300 to-transparent rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-gray-200 to-transparent rounded-full opacity-25 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">OAuth Callback</h1>
          <p className="text-gray-400">Processing authentication...</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg p-6 space-y-6">
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-800 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Debug Information</h3>
                <button
                  onClick={() => copyToClipboard(currentUrl)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">Copy URL</span>
                </button>
              </div>
              <div className="text-xs text-gray-300 font-mono break-all">{debugInfo}</div>
            </div>
          )}
          
          {/* Status Display */}
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin"></div>
                <p className="text-gray-300 text-center">{message}</p>
                {isRetrying && (
                  <p className="text-yellow-400 text-sm">Retrying authentication...</p>
                )}
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <p className="text-green-400 text-center font-medium">{message}</p>
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
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Retrying...' : 'Retry'}
                  </button>
                  <button
                    onClick={() => router.push('/auth/debug')}
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Debug Page
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

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Processing authentication...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}