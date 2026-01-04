'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useAnimation } from '@/hooks'

interface FadeInProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  from?: { opacity: number; y?: number }
  to?: { opacity: number; y?: number }
  className?: string
}

export function FadeIn({ 
  children, 
  duration = 0.5, 
  delay = 0,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  className 
}: FadeInProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const { createTimeline } = useAnimation()

  useEffect(() => {
    if (!elementRef.current) return

    const timeline = createTimeline()
    timeline.fromTo(elementRef.current, from, to)
      .duration(duration)
      .delay(delay)

    return () => {
      timeline.kill()
    }
  }, [duration, delay, from, to, createTimeline])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}