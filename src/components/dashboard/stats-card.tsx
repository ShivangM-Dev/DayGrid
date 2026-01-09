'use client'

import { Card, CardContent } from '@/components/shared/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  icon: LucideIcon
  description?: string
  className?: string
  variant?: 'default' | 'gradient' | 'glass'
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  variant = 'default'
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (change?.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (change?.trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const variants = {
    default: 'bg-card border-border hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 hover-lift relative overflow-hidden group',
    gradient: 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 hover-lift relative overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
    glass: 'bg-background/30 backdrop-blur-md border-border/30 hover:bg-background/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 hover-lift relative overflow-hidden group'
  }

  return (
    <Card className={cn(variants[variant], className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{value}</p>
            
            {change && (
              <div className="flex items-center gap-2 mt-3">
                <div className={cn('p-1 rounded-full bg-background/50', getTrendColor())}>
                  {getTrendIcon()}
                </div>
                <span className={cn('text-sm font-bold', getTrendColor())}>
                  {Math.abs(change.value)}%
                </span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground mt-3 font-medium">{description}</p>
            )}
          </div>
          
          <div className={cn(
            'flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg',
            variant === 'gradient' ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-primary/10 group-hover:bg-primary/20'
          )}>
            <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        
        {/* Subtle animated gradient border for premium cards */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
        )}
      </CardContent>
    </Card>
  )
}