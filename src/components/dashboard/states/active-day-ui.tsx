'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { TaskWidget } from '@/components/dashboard/task-widget'
import { DayProgress } from '@/components/dashboard/day-progress'
import { StatsCard } from '@/components/dashboard/stats-card'
import { DailyGrid } from '@/components/main-application/daily-grid/daily-grid'
import { DailyGridFooter } from '@/components/main-application/daily-grid/daily-grid-footer'
import { useTasks } from '@/hooks/use-tasks'
import { useDayState } from '@/hooks/use-day-state'
import { format } from 'date-fns'
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Timer
} from 'lucide-react'

interface ActiveDayUIProps {
  onCompleteDay: () => void
}

export function ActiveDayUI({ onCompleteDay }: ActiveDayUIProps) {
  const { tasks, getScheduledTasks, getUnscheduledTasks } = useTasks()
  const { state: dayState } = useDayState()
  const [selectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [elapsedTime, setElapsedTime] = useState(0)

  const scheduledTasks = getScheduledTasks()
  const unscheduledTasks = getUnscheduledTasks()

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const inProgressTasks = tasks.filter(t => !t.completed && !t.failed && !t.abandoned).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const highPriorityTasks = tasks.filter(t => t.priority >= 7)
  const highPriorityCompleted = highPriorityTasks.filter(t => t.completed).length

  const todayTasks = scheduledTasks
  const todayCompleted = todayTasks.filter(t => t.completed).length

  // Timer effect
  useEffect(() => {
    const startTime = dayState.currentDay?.startTime
    if (startTime) {
      const interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [dayState.currentDay?.startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressItems = [
    {
      label: "Tasks Completed",
      value: completedTasks,
      total: totalTasks,
      color: "success" as const,
      icon: "check" as const
    },
    {
      label: "Scheduled Today",
      value: todayCompleted,
      total: todayTasks.length,
      color: "warning" as const,
      icon: "clock" as const
    },
    {
      label: "High Priority",
      value: highPriorityCompleted,
      total: highPriorityTasks.length,
      color: "danger" as const,
      icon: "target" as const
    },
    {
      label: "Completion Rate",
      value: completionRate,
      total: 100,
      color: "primary" as const,
      icon: "trending" as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Active Day Header */}
      <div className="animate-slide-up-fade">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                  Day in Progress 🚀
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Keep up the great work! You're doing amazing today.
                </p>
                
                {/* Timer */}
                <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-border/30">
                  <Timer className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-mono font-semibold text-lg">{formatTime(elapsedTime)}</span>
                  <span className="text-sm text-muted-foreground">Time elapsed</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={onCompleteDay}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold px-6 py-3 shadow-lg hover-lift"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Day
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            change={{ value: inProgressTasks, trend: 'up' }}
            icon={Target}
            description={`${inProgressTasks} in progress`}
            variant="gradient"
            className="hover-lift border-green-200 dark:border-green-700"
          />
        </div>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
          <StatsCard
            title="Completion Rate"
            value={`${completionRate}%`}
            change={{ value: completionRate > 50 ? 5 : -2, trend: completionRate > 50 ? 'up' : 'down' }}
            icon={TrendingUp}
            description="Daily average"
            variant="gradient"
            className="hover-lift border-green-200 dark:border-green-700"
          />
        </div>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
          <StatsCard
            title="Completed Today"
            value={todayCompleted}
            change={{ value: todayCompleted, trend: 'up' }}
            icon={CheckCircle}
            description="Out of {todayTasks.length} scheduled"
            variant="gradient"
            className="hover-lift border-green-200 dark:border-green-700"
          />
        </div>
        <div className="animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
          <StatsCard
            title="High Priority"
            value={highPriorityCompleted}
            change={{ value: highPriorityTasks.length - highPriorityCompleted, trend: 'down' }}
            icon={AlertCircle}
            description={`${highPriorityTasks.length - highPriorityCompleted} remaining`}
            variant="gradient"
            className="hover-lift border-green-200 dark:border-green-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Progress & Task Lists */}
        <div className="space-y-6 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
          {/* Day Progress */}
          <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DayProgress
                title=""
                items={progressItems}
              />
            </CardContent>
          </Card>

          {/* In Progress Tasks */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskWidget
                tasks={tasks.filter(t => !t.completed && !t.failed && !t.abandoned)}
                title=""
                variant="compact"
                maxItems={5}
                draggable={true}
              />
            </CardContent>
          </Card>

          {/* Unscheduled Tasks */}
          {unscheduledTasks.length > 0 && (
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Unscheduled Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskWidget
                  tasks={unscheduledTasks}
                  title=""
                  variant="compact"
                  maxItems={3}
                  draggable={true}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Active Grid */}
        <div className="xl:col-span-2 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
          <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">📅</div>
                  Active Schedule
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-[500px]">
                <DailyGrid
                  date={selectedDate}
                  tasks={scheduledTasks}
                  className="min-h-[500px] bg-gradient-to-br from-background/80 to-background/60 border-none rounded-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Grid Footer - Summary */}
      <div className="mt-4 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
        <DailyGridFooter tasks={scheduledTasks} />
      </div>

      {/* Motivational Footer */}
      <div className="animate-slide-up-fade" style={{ animationDelay: '0.8s' }}>
        <Card className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 border-green-200 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-4xl">🎯</div>
              <h3 className="text-xl font-semibold text-foreground">You're Doing Great!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {completionRate >= 75 
                  ? "Excellent work! You're crushing your goals today. Keep this momentum going!"
                  : completionRate >= 50
                  ? "Good progress! You're more than halfway there. Stay focused and finish strong!"
                  : "You're building momentum! Every task completed is a step forward. Keep going!"
                }
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks}</div>
                  <div className="text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}