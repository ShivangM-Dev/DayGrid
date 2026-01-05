'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Target, CheckCircle } from 'lucide-react'

export default function AuthDirectSuccess() {
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const [message, setMessage] = useState('Finalizing authentication...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const finalizeAuth = async () => {
      try {
        const supabase = createClient()
        
        if (!supabase) {
          // Mock success for development
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          setTimeout(() => {
            router.push('/onboarding')
          }, 1000)
          return
        }

        // Extract tokens from both query and hash
        const queryCode = searchParams.get('code')
        const queryAccessToken = searchParams.get('access_token')
        const queryRefreshToken = searchParams.get('refresh_token')
        
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
        
        const accessToken = queryAccessToken || hashAccessToken
        const refreshToken = queryRefreshToken || hashRefreshToken
        
        console.log('Direct success tokens:', { queryCode, queryAccessToken, hashAccessToken, hashRefreshToken })

        let userSession = null

        if (accessToken && refreshToken) {
          console.log('Setting session with tokens...')
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (!setSessionError && sessionData?.user) {
            userSession = sessionData
          }
        } else if (queryCode) {
          console.log('Exchanging code for session...')
          const { data, error } = await supabase.auth.exchangeCodeForSession(queryCode)
          
          if (!error && data?.user) {
            userSession = data
          }
        }

        // Multiple attempts to get session
        if (!userSession) {
          for (let attempt = 1; attempt <= 5; attempt++) {
            console.log(`Session attempt ${attempt}`)
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
              userSession = session
              break
            }
          }
        }

        // Try getUser as last resort
        if (!userSession) {
          console.log('Trying getUser as last resort...')
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            userSession = { user }
          }
        }

        if (userSession?.user) {
          console.log('✅ Authentication successful:', userSession.user.email)
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Simple redirect - assume new user goes to onboarding
          setTimeout(() => {
            router.push('/onboarding')
          }, 1500)
        } else {
          setStatus('error')
          setMessage('Failed to establish session. Please try again.')
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      } catch (err) {
        console.error('Direct success error:', err)
        setStatus('error')
        setMessage('Authentication error. Please try again.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    }

    // Small delay to ensure page loads
    setTimeout(finalizeAuth, 500)
  }, [searchParams, router])

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
          <p className="text-gray-400">Setting up your session...</p>
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
                  Redirecting to your dashboard setup...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}