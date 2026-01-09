'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Target } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    // Simulate Google sign in delay
    setTimeout(() => {
      router.push('/dashboard')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-gray-300 to-transparent rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-gray-200 to-transparent rounded-full opacity-25 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your DayGrid dashboard</p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-white">Sign In with Google</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-3 h-12"
            >
              <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google" width="20" height="20" />
              {isLoading ? 'Signing In...' : 'Continue with Google'}
            </Button>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-center text-gray-400 text-xs">
                Demo Mode: Click to simulate Google sign in and access the dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}