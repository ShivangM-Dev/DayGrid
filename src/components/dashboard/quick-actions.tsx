'use client'

import { Card, CardContent, CardHeader } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { cn } from '@/lib/utils'
import { Plus, Clock, Target, Calendar } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface QuickActionProps {
  title: string
  description: string
  icon: LucideIcon
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary'
}

function QuickAction({ title, description, icon: Icon, onClick, variant = 'default' }: QuickActionProps) {
  const variants = {
    default: 'hover:bg-accent/50 border-border/50',
    primary: 'hover:bg-primary/10 border-primary/20 bg-primary/5',
    secondary: 'hover:bg-secondary/50 border-secondary/50 bg-secondary/20'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-lg border transition-all duration-200 text-left group',
        variants[variant]
      )}
      disabled={!onClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/50 group-hover:bg-background transition-colors">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}

interface QuickActionsProps {
  onCreateTask?: () => void
  onPlanDay?: () => void
  onViewCalendar?: () => void
  onSetGoals?: () => void
  className?: string
}

export function QuickActions({
  onCreateTask,
  onPlanDay,
  onViewCalendar,
  onSetGoals,
  className
}: QuickActionsProps) {
  const actions = [
    {
      title: 'Create Task',
      description: 'Add a new task to your inbox',
      icon: Plus,
      onClick: onCreateTask,
      variant: 'primary' as const
    },
    {
      title: 'Plan Day',
      description: 'Schedule tasks for today',
      icon: Clock,
      onClick: onPlanDay,
      variant: 'default' as const
    },
    {
      title: 'View Calendar',
      description: 'See your weekly schedule',
      icon: Calendar,
      onClick: onViewCalendar,
      variant: 'default' as const
    },
    {
      title: 'Set Goals',
      description: 'Define daily objectives',
      icon: Target,
      onClick: onSetGoals,
      variant: 'secondary' as const
    }
  ]

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <QuickAction
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={action.onClick}
            variant={action.variant}
          />
        ))}
      </CardContent>
    </Card>
  )
}