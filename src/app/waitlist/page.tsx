'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/shared/ui/button'
import { ChevronRight, CheckCircle, Sparkles } from 'lucide-react'
import { 
  AnimatedText, 
  FloatingElement
} from '@/components/shared/animations/landing-animations'
import { WaitlistForm } from '@/components/main-application/waitlist/waitlist-form'
import { BackgroundEffects } from '@/components/public-side/layout/background-effects'

export default function WaitlistPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFormSubmit = async (_data: unknown) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitted(true)
    return Promise.resolve()
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <BackgroundEffects />

        <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative">
          <div className="max-w-md w-full text-center relative z-10">
            <FloatingElement duration={4} amplitude={6}>
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl opacity-20 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </FloatingElement>
            
            <AnimatedText delay={0.3}>
              <h1 className="text-5xl md:text-6xl font-light mb-6 leading-none tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  You&apos;re
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent font-extralight">
                  In
                </span>
              </h1>
            </AnimatedText>
            
            <AnimatedText delay={0.5}>
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed font-light">
                Welcome to <span className="text-gray-200 font-light">DayGrid</span>. 
                We&apos;ll notify you when early access is available.
              </p>
            </AnimatedText>
            
            <AnimatedText delay={0.7}>
              <Link href="/">
                <Button 
                  className="bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200 text-black font-light tracking-wide rounded-2xl py-3 px-8 transition-all duration-300"
                >
                  Return Home
                </Button>
              </Link>
            </AnimatedText>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundEffects />

      <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative">
        <div className="max-w-md w-full text-center relative z-10">
          <AnimatedText delay={0.3}>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-2xl rounded-full text-sm text-gray-300 mb-8 border border-gray-800/50 shadow-2xl">
              <Sparkles className="w-4 h-4 mr-3 text-gray-200" style={{animationDuration: '4s'}} />
              <span className="font-light tracking-wide">Early Access</span>
              <span className="mx-3 text-gray-600">•</span>
              <span className="text-gray-400">Limited Spots</span>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={0.5}>
            <h1 className="text-5xl md:text-6xl font-light mb-6 leading-none tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Get Early
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent font-extralight">
                Access
              </span>
            </h1>
          </AnimatedText>
          
          <AnimatedText delay={0.7}>
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed font-light">
              Be among <span className="text-gray-200 font-light">first</span> to experience 
              <span className="text-gray-100 font-light">future</span> of productivity.
            </p>
          </AnimatedText>
          
          <AnimatedText delay={0.9}>
            <div className="space-y-6">
              <WaitlistForm onSubmit={handleFormSubmit} />
              
              <div className="text-center">
                <Link 
                  href="/"
                  className="text-gray-500 hover:text-gray-300 text-sm font-light transition-colors duration-300"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </AnimatedText>
        </div>
      </section>
    </div>
  )
}