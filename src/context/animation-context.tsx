'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { gsap } from 'gsap'

interface AnimationContextType {
  animateTaskEntrance: (element: HTMLElement) => any
  animateTaskDrag: (element: HTMLElement) => any
  animateTaskDrop: (element: HTMLElement) => any
  animateTaskCompletion: (element: HTMLElement) => any
  animateError: (element: HTMLElement) => any
  createTimeline: () => any
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: ReactNode }) {
  const animateTaskEntrance = (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { 
        scale: 0.5, 
        opacity: 0,
        rotation: -5
      },
      { 
        scale: 1, 
        opacity: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    )
  }

  const animateTaskDrag = (element: HTMLElement): gsap.core.Tween => {
    return gsap.to(element, {
      scale: 1.05,
      rotation: 2,
      duration: 0.2,
      ease: "power2.out",
    })
  }

  const animateTaskDrop = (element: HTMLElement): gsap.core.Tween => {
    const timeline = gsap.timeline()
    
    timeline.to(element, {
      scale: 1.1,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(element, {
      scale: 1,
      duration: 0.2,
      ease: "elastic.out(1, 0.3)",
    })
    
    return timeline as any
  }

  const animateTaskCompletion = (element: HTMLElement): gsap.core.Tween => {
    return gsap.to(element, {
      scale: 1.2,
      opacity: 0,
      rotation: 360,
      duration: 0.6,
      ease: "power2.in",
    })
  }

  const animateError = (element: HTMLElement): gsap.core.Tween => {
    return gsap.to(element, {
      x: [-10, 10, -10, 10, 0] as any,
      duration: 0.5,
      ease: "power2.inOut",
    })
  }

  const createTimeline = (): gsap.core.Timeline => {
    return gsap.timeline({
      defaults: {
        ease: "power2.inOut",
      },
    })
  }

  return (
    <AnimationContext.Provider
      value={{
        animateTaskEntrance,
        animateTaskDrag,
        animateTaskDrop,
        animateTaskCompletion,
        animateError,
        createTimeline,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}