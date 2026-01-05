'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Target, Eye, EyeOff, Copy, Check } from 'lucide-react'

function AuthDebugContent() {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const allParams = Object.fromEntries(searchParams.entries())
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">OAuth Debug Info</h1>
          <p className="text-gray-400">Use this page to troubleshoot OAuth callback issues</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg p-6 space-y-6">
          {/* Current URL Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Current URL Information</h3>
            
            <div className="bg-gray-800 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Full URL:</span>
                <button
                  onClick={() => copyToClipboard(currentUrl)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-xs text-gray-300 font-mono break-all">{currentUrl}</div>
            </div>

            <div className="bg-gray-800 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Origin:</span>
                <button
                  onClick={() => copyToClipboard(origin)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">Copy</span>
                </button>
              </div>
              <div className="text-xs text-gray-300 font-mono">{origin}</div>
            </div>
          </div>

          {/* URL Parameters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">URL Parameters</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm">{showDetails ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>

            {showDetails && (
              <div className="bg-gray-800 rounded p-4">
                <div className="text-xs text-gray-300 font-mono">
                  {Object.keys(allParams).length === 0 ? (
                    <span className="text-gray-500">No parameters found</span>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(allParams).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-2">
                          <span className="text-blue-400">{key}:</span>
                          <span className="text-gray-300">{value || '(empty)'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Expected vs Actual */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Expected Parameters</h3>
            <div className="bg-gray-800 rounded p-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>code=... (authorization code from OAuth)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">?</span>
                  <span>access_token=... (direct session token)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">✗</span>
                  <span>error=... (error message if failed)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Check */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Environment Status</h3>
            <div className="bg-gray-800 rounded p-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Supabase URL:</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Supabase Key:</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-400' : 'text-red-400'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Environment:</span>
                  <span className="text-blue-400">{process.env.NODE_ENV}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-black rounded-lg hover:from-gray-400 hover:to-gray-600 transition-colors"
            >
              Back to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthDebug() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading debug info...</p>
        </div>
      </div>
    }>
      <AuthDebugContent />
    </Suspense>
  )
}