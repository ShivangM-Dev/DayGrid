import { LucideIcon } from 'lucide-react'

// Base interfaces for public-side components

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
}

export interface Phase {
  icon: LucideIcon
  title: string
  subtitle: string
  features: string[]
  number: string
  delay: number
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

// Component prop interfaces

export interface HeroSectionProps {
  className?: string
}

export interface BackgroundEffectsProps {
  className?: string
}

export interface FeaturesSectionProps {
  className?: string
  leftFeatures?: Feature[]
  rightFeatures?: Feature[]
}

export interface HowItWorksSectionProps {
  className?: string
  phases?: Phase[]
}

export interface CTASectionProps {
  className?: string
}

export interface FooterSectionProps {
  className?: string
  footerSections?: FooterSection[]
}

// Animation delay configurations
export interface AnimationDelays {
  hero: {
    badge: number
    headline: number
    subtitle: number
    cta: number
    indicators: number
  }
  features: {
    header: number
    firstFeature: number
  }
  howItWorks: {
    header: number
    firstIndicator: number
    firstPhase: number
  }
  cta: {
    fadeIn: number
  }
}