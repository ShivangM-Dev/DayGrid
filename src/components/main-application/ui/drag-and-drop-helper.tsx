'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { cn } from '@/lib/utils'
import { Fingerprint, Smartphone, Mouse } from 'lucide-react'

interface DragAndDropHelperProps {
  className?: string
  onDismiss?: () => void
}

export function DragAndDropHelper({ className, onDismiss }: DragAndDropHelperProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('drag-drop-helper-dismissed', 'true')
    onDismiss?.()
  }

  useEffect(() => {
    const wasDismissed = localStorage.getItem('drag-drop-helper-dismissed')
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])

  if (dismissed) return null

  return (
    <Card className={cn(
      'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 shadow-lg',
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {isMobile ? (
              <Fingerprint className="w-5 h-5 text-primary" />
            ) : (
              <Mouse className="w-5 h-5 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground mb-1">
              {isMobile ? 'Touch & Drag' : 'Click & Drag'}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {isMobile 
                ? 'Touch and hold a task, then drag it to a time slot to schedule it.'
                : 'Click and hold a task, then drag it to a time slot to schedule it.'
              }
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                className="text-xs h-7 px-3"
              >
                Got it
              </Button>
              
              {isMobile && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}