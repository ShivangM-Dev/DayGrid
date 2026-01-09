'use client'

import { Card, CardContent, CardHeader } from '@/components/shared/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react'

interface ProgressItem {
  label: string
  value: number
  total: number
  color?: string
  icon?: 'clock' | 'target' | 'trending' | 'check'
}

interface DayProgressProps {
  title?: string
  items: ProgressItem[]
  className?: string
}

export function DayProgress({ title = "Today's Progress", items, className }: DayProgressProps) {
  const getIcon = (icon?: string) => {
    switch (icon) {
      case 'clock':
        return <Clock className="w-4 h-4" />
      case 'target':
        return <Target className="w-4 h-4" />
      case 'trending':
        return <TrendingUp className="w-4 h-4" />
      case 'check':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getProgressColor = (color?: string) => {
    switch (color) {
      case 'success':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'danger':
        return 'bg-red-500'
      default:
        return 'bg-primary'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const percentage = Math.min((item.value / item.total) * 100, 100)
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(item.icon)}
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.value}/{item.total}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      getProgressColor(item.color)
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}