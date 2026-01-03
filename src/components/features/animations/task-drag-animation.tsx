'use client'

import React, { useRef, useEffect } from 'react'
import { useAnimation } from '@/hooks'

interface TaskDragAnimationProps {
  children: React.ReactNode
  isDragging?: boolean
  className?: string
}

export function TaskDragAnimation({ children, isDragging = false, className }: TaskDragAnimationProps) {
  const { elementRef, animateDrag } = useAnimation()

  useEffect(() => {
    if (!elementRef.current) return

    if (isDragging) {
      const animation = animateDrag()
      return () => {
        animation.kill()
      }
    }
  }, [isDragging, animateDrag])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}