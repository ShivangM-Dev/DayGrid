'use client'

import { gsap } from 'gsap'

export const createTaskEntranceAnimation = (element: HTMLElement) => {
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

export const createTaskDragAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    scale: 1.05,
    rotation: 2,
    duration: 0.2,
    ease: "power2.out",
  })
}

export const createTaskDropAnimation = (element: HTMLElement) => {
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
  
  return timeline
}

export const createTaskCompletionAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    scale: 1.2,
    opacity: 0,
    rotation: 360,
    duration: 0.6,
    ease: "power2.in",
  })
}

export const createErrorAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    x: [-10, 10, -10, 10, 0] as any,
    duration: 0.5,
    ease: "power2.inOut",
  })
}

export const createFadeInAnimation = (element: HTMLElement, duration: number = 0.5, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
  )
}

export const createSlideUpAnimation = (element: HTMLElement, duration: number = 0.6, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration, delay, ease: "power3.out" }
  )
}

export const createTimeline = () => {
  return gsap.timeline({
    defaults: {
      ease: "power2.inOut",
    },
  })
}

export const animateStaggeredEntrance = (elements: HTMLElement[], stagger: number = 0.1) => {
  const timeline = createTimeline()
  
  elements.forEach((element, index) => {
    timeline.add(createTaskEntranceAnimation(element), index * stagger)
  })
  
  return timeline
}