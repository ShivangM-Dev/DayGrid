'use client'

import { PublicNavigation } from '@/components/shared/navigation/public-navigation'
import { BackgroundEffects } from '@/components/public-side/layout/background-effects'
import { HeroSection } from '@/components/public-side/hero/hero-section'
import { FeaturesSection } from '@/components/public-side/features/features-section'
import { HowItWorksSection } from '@/components/public-side/how-it-works/how-it-works-section'
import { CTASection } from '@/components/public-side/cta/cta-section'
import { FooterSection } from '@/components/public-side/footer/footer-section'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundEffects />
      <PublicNavigation currentPath="/" />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}