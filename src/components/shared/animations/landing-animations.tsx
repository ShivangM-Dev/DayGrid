'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface AnimatedTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedText({ children, className = '', delay = 0 }: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        delay,
        ease: 'power3.out',
      }
    )
  }, [delay])

  return <div ref={ref} className={className}>{children}</div>
}

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale: 0.95,
        y: 30,
        rotationX: 15,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        transformPerspective: 1000,
      }
    )
  }, [delay])

  return <div ref={ref} className={className}>{children}</div>
}

interface FadeInOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FadeInOnScroll({ children, className = '', delay = 0, duration = 0.8 }: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              {
                opacity: 0,
                y: 60,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: duration,
                delay: delay,
                ease: 'power3.out',
              }
            )
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, duration])

  return <div ref={ref} className={className}>{children}</div>
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  amplitude?: number
}

export function FloatingElement({ 
  children, 
  className = '', 
  duration = 4, 
  amplitude = 8 
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const timeline = gsap.timeline({ repeat: -1 })
    
    timeline
      .to(ref.current, {
        y: amplitude,
        rotation: 1,
        duration: duration / 2,
        ease: 'sine.inOut',
      })
      .to(ref.current, {
        y: -amplitude,
        rotation: -1,
        duration: duration / 2,
        ease: 'sine.inOut',
      })

    return () => {
      timeline.kill()
    }
  }, [duration, amplitude])

  return <div ref={ref} className={className}>{children}</div>
}

interface GradientShiftProps {
  children: React.ReactNode
  className?: string
}

export function GradientShift({ children, className = '' }: GradientShiftProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      backgroundPosition: '200% 0',
      duration: 3,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function Parallax({ children, className = '', speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      gsap.to(ref.current, {
        y: -scrolled * speed,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return <div ref={ref} className={className}>{children}</div>
}

interface StaggerInProps {
  children: React.ReactNode[]
  className?: string
  stagger?: number
}

export function StaggerIn({ children, className = '', stagger = 0.1 }: StaggerInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current.children,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: stagger,
        ease: 'power2.out',
      }
    )
  }, [stagger])

  return <div ref={ref} className={className}>{children}</div>
}

interface GlitchEffectProps {
  children: React.ReactNode
  className?: string
}

export function GlitchEffect({ children, className = '' }: GlitchEffectProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 8 })
    
    timeline
      .to(ref.current, {
        x: 1,
        skewX: 1,
        duration: 0.1,
      })
      .to(ref.current, {
        x: -1,
        skewX: -1,
        duration: 0.1,
      })
      .to(ref.current, {
        x: 0,
        skewX: 0,
        duration: 0.1,
      })

    return () => {
      timeline.kill()
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}

interface SubtlePulseProps {
  children: React.ReactNode
  className?: string
  scale?: number
  duration?: number
}

export function SubtlePulse({ 
  children, 
  className = '', 
  scale = 1.02,
  duration = 3 
}: SubtlePulseProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      scale: scale,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [scale, duration])

  return <div ref={ref} className={className}>{children}</div>
}

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function RevealOnScroll({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const getStartPosition = () => {
      switch (direction) {
        case 'up': return { opacity: 0, y: 60 }
        case 'down': return { opacity: 0, y: -60 }
        case 'left': return { opacity: 0, x: -60 }
        case 'right': return { opacity: 0, x: 60 }
        default: return { opacity: 0, y: 60 }
      }
    }

    const getEndPosition = () => {
      switch (direction) {
        case 'up':
        case 'down': return { opacity: 1, y: 0 }
        case 'left':
        case 'right': return { opacity: 1, x: 0 }
        default: return { opacity: 1, y: 0 }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              getStartPosition(),
              {
                ...getEndPosition(),
                duration: 1,
                delay: delay,
                ease: 'power3.out',
              }
            )
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, direction])

  return <div ref={ref} className={className}>{children}</div>
}