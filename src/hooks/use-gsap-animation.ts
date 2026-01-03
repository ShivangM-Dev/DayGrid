'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useAnimation } from '../context/animation-context'

export function useGsapAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)
  const animationContext = useAnimation()

  const animateEntrance = () => {
    if (elementRef.current) {
      return animationContext.animateTaskEntrance(elementRef.current)
    }
    return gsap.timeline()
  }

  const animateDrag = () => {
    if (elementRef.current) {
      return animationContext.animateTaskDrag(elementRef.current)
    }
    return gsap.timeline()
  }

  const animateDrop = () => {
    if (elementRef.current) {
      return animationContext.animateTaskDrop(elementRef.current)
    }
    return gsap.timeline()
  }

  const animateCompletion = () => {
    if (elementRef.current) {
      return animationContext.animateTaskCompletion(elementRef.current)
    }
    return gsap.timeline()
  }

  const animateError = () => {
    if (elementRef.current) {
      return animationContext.animateError(elementRef.current)
    }
    return gsap.timeline()
  }

  const createTimeline = () => {
    return animationContext.createTimeline()
  }

  return {
    elementRef,
    animateEntrance,
    animateDrag,
    animateDrop,
    animateCompletion,
    animateError,
    createTimeline,
  }
}