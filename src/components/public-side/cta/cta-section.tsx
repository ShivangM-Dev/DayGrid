import Link from 'next/link'
import { Button } from '@/components/shared/ui/button'
import { FadeInOnScroll } from '@/components/shared/animations/landing-animations'
import { 
  ArrowRight, 
  Rocket,
  Shield,
  Award
} from 'lucide-react'
import { CTASectionProps } from '@/types/public-side'

/**
 * CTASection component - Final call-to-action section
 * Encourages users to request early access with premium badges
 */
export function CTASection({ className }: CTASectionProps = {}) {
  return (
    <section className={`py-32 px-6 lg:px-8 relative ${className || ''}`}>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <FadeInOnScroll>
          {/* Main Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-12 leading-none tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent font-extralight">
              Daily Potential
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Join <span className="text-gray-200">discerning professionals</span> who've elevated their productivity with DayGrid. 
            <span className="text-gray-200"> Begin your transformation.</span>
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/waitlist">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gray-50 to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 text-xl px-16 py-6 shadow-2xl hover:shadow-gray-300/40 transition-all duration-500 font-light tracking-wide rounded-2xl group"
              >
                <Rocket className="mr-4 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                Request Early Access
                <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
          
          {/* Premium Badges */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-20">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50">
              <Shield className="w-5 h-5 mr-3 text-emerald-400" />
              <span className="text-gray-200 font-light tracking-wide">Direct Support</span>
            </div>
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50">
              <Award className="w-5 h-5 mr-3 text-yellow-400" />
              <span className="text-gray-200 font-light tracking-wide">Founding Member Status</span>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  )
}