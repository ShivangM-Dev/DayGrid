'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useAnimation } from '@/hooks'

interface SlideUpProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  distance?: number
  className?: string
}

export function SlideUp({ 
  children, 
  duration = 0.6, 
  delay = 0,
  distance = 30,
  className 
}: SlideUpProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const { createTimeline } = useAnimation()

  useEffect(() => {
    if (!elementRef.current) return

    const timeline = createTimeline()
    timeline.fromTo(
      elementRef.current,
      { 
        opacity: 0, 
        y: distance,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration,
        delay,
        ease: "power3.out"
      }
    )

    return () => {
      timeline.kill()
    }
  }, [duration, delay, distance, createTimeline])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}