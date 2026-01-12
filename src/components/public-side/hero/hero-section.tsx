'use client'

import Link from 'next/link'
import { Button } from '@/components/shared/ui/button'
import { AnimatedText } from '@/components/shared/animations/landing-animations'
import { 
  ArrowRight, 
  Sparkles, 
  Rocket
} from 'lucide-react'
import { HeroSectionProps } from '@/types/public-side'

/**
 * HeroSection component - Main landing page hero
 * Features premium design with animations and CTA buttons
 */
export function HeroSection({ className }: HeroSectionProps = {}) {
  return (
    <section className={`pt-48 pb-40 px-6 lg:px-8 relative ${className || ''}`}>
      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Premium Badge */}
        <AnimatedText delay={0.3}>
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-2xl rounded-full text-sm text-gray-300 mb-16 border border-gray-800/50 shadow-2xl">
            <Sparkles className="w-4 h-4 mr-3 text-gray-200" style={{animationDuration: '4s'}} />
            <span className="font-light tracking-wide">Advanced Daily Management</span>
            <span className="mx-3 text-gray-600">•</span>
            <span className="text-gray-400">Professional Scheduling</span>
          </div>
        </AnimatedText>
        
        {/* Main Headline */}
        <AnimatedText delay={0.5}>
          <h1 className="text-7xl md:text-9xl font-light mb-12 leading-none tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Precision
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent font-extralight">
              Meets Purpose
            </span>
          </h1>
        </AnimatedText>
        
        {/* Subtitle */}
        <AnimatedText delay={0.7}>
          <p className="text-2xl md:text-3xl text-gray-400 mb-20 max-w-5xl mx-auto leading-relaxed font-light">
            Transform <span className="text-gray-200 font-light">daily chaos</span> into 
            <span className="text-gray-100 font-light"> elegant clarity</span>. 
            Experience task management crafted for those who demand excellence in every detail.
          </p>
        </AnimatedText>
        
        {/* CTA Buttons */}
        <AnimatedText delay={0.9}>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/waitlist">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gray-50 to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 text-lg px-12 py-5 shadow-2xl hover:shadow-gray-300/30 transition-all duration-500 font-light tracking-wide rounded-2xl"
              >
                <Rocket className="mr-3 w-5 h-5" />
                Request Early Access
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </AnimatedText>
        
        {/* Premium Indicators */}
        <AnimatedText delay={1.1}>
          <div className="flex flex-col sm:flex-row gap-12 justify-center items-center mt-24 text-gray-500">
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
              <span className="text-xs font-light tracking-widest uppercase">Limited Availability</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
              <span className="text-xs font-light tracking-widest uppercase">Founding Member Benefits</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
              <span className="text-xs font-light tracking-widest uppercase">Priority Support</span>
            </div>
          </div>
        </AnimatedText>
        
      </div>
    </section>
  )
}