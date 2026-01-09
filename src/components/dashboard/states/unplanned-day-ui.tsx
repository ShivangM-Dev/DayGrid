'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { TaskWidget } from '@/components/dashboard/task-widget'
import { DayProgress } from '@/components/dashboard/day-progress'
import { StatsCard } from '@/components/dashboard/stats-card'
import { format, subDays } from 'date-fns'
import { Calendar, Target, TrendingUp, Play, CheckCircle } from 'lucide-react'
import { Task } from '@/types'

interface UnplannedDayUIProps {
  onPlanDay: () => void
  previousDayTasks: Task[]
  previousDayProgress: {
    total: number
    completed: number
    productivity: number
  }
}

export function UnplannedDayUI({ onPlanDay, previousDayTasks, previousDayProgress }: UnplannedDayUIProps) {
  const yesterday = format(subDays(new Date(), 1), 'EEEE, MMMM d')

  const progressItems = [
    {
      label: "Tasks Completed",
      value: previousDayProgress.completed,
      total: previousDayProgress.total,
      color: "success" as const,
      icon: "check" as const
    },
    {
      label: "Productivity",
      value: previousDayProgress.productivity,
      total: 100,
      color: "warning" as const,
      icon: "trending" as const
    },
    {
      label: "Day Progress",
      value: previousDayProgress.total > 0 ? Math.round((previousDayProgress.completed / previousDayProgress.total) * 100) : 0,
      total: 100,
      color: "primary" as const,
      icon: "target" as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome and Plan Day Section */}
      <div className="animate-slide-up-fade">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="space-y-4">
              <div className="text-6xl">🌅</div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Ready to Plan Your Day?
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Let's make today productive! Plan your tasks and schedule your time.
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={onPlanDay}
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg shadow-lg hover-lift"
            >
              <Play className="w-5 h-5 mr-2" />
              Plan Your Day
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Previous Day Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
          <StatsCard
            title="Yesterday's Tasks"
            value={previousDayProgress.total}
            icon={Calendar}
            description="Total tasks completed"
            variant="gradient"
            className="hover-lift"
          />
        </div>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
          <StatsCard
            title="Completion Rate"
            value={`${previousDayProgress.productivity}%`}
            icon={TrendingUp}
            description="Daily productivity"
            variant="gradient"
            className="hover-lift"
          />
        </div>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
          <StatsCard
            title="Completed"
            value={previousDayProgress.completed}
            icon={CheckCircle}
            description="Tasks done yesterday"
            variant="gradient"
            className="hover-lift"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Previous Day Progress */}
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
          <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 shadow-lg hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">📊</div>
                {yesterday} Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DayProgress
                title=""
                items={progressItems}
              />
              {previousDayProgress.total === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tasks from yesterday</p>
                  <p className="text-sm mt-1">Start fresh today!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Previous Day Tasks */}
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
          <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 shadow-lg hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">📋</div>
                Yesterday's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskWidget
                tasks={previousDayTasks}
                title=""
                variant="compact"
                maxItems={6}
                className="min-h-[200px]"
                draggable={false}
              />
              {previousDayTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-3xl mb-2">🎯</div>
                  <p>No tasks from yesterday</p>
                  <p className="text-sm mt-1">Plan your first tasks today!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-4xl">💪</div>
              <h3 className="text-xl font-semibold text-foreground">New Day, New Opportunities!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every day is a chance to be better than yesterday. Start by planning your tasks, 
                schedule your time effectively, and make today count!
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 bg-background/50 rounded-full border border-border/30">
                  🎯 Set Clear Goals
                </span>
                <span className="px-3 py-1 bg-background/50 rounded-full border border-border/30">
                  ⏰ Manage Time Well
                </span>
                <span className="px-3 py-1 bg-background/50 rounded-full border border-border/30">
                  🚀 Stay Focused
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}