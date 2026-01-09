'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { TaskForm } from '@/components/main-application/task-inbox/task-form'
import { TaskCard } from '@/components/main-application/task-inbox/task-card'
import { DailyGrid } from '@/components/main-application/daily-grid/daily-grid'
import { DayStatusComponent } from '@/components/main-application/day-management/day-status'
import { StartDayButton } from '@/components/main-application/day-management/start-day-button'
import { useTasks } from '@/hooks/use-tasks'
import { useDayState } from '@/hooks/use-day-state'
import { useDashboardState } from '@/hooks/use-dashboard-state'
import { format, startOfDay } from 'date-fns'
import { Calendar, Clock, Target, Plus, TrendingUp, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'
import { DashboardNavigation } from '@/components/shared/navigation/dashboard-navigation'
import { StatsCard } from '@/components/dashboard/stats-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { DayProgress } from '@/components/dashboard/day-progress'
import { TaskWidget } from '@/components/dashboard/task-widget'
import { DragAndDropHelper } from '@/components/main-application/ui/drag-and-drop-helper'
import { UnplannedDayUI } from '@/components/dashboard/states/unplanned-day-ui'
import { PlanningDayUI } from '@/components/dashboard/states/planning-day-ui'
import { ActiveDayUI } from '@/components/dashboard/states/active-day-ui'

export default function Dashboard() {
  const { tasks, getUnscheduledTasks, getScheduledTasks } = useTasks()
  const { state: dayState, startNewDay, activateDay, completeDay } = useDayState()
  const { currentState, transitionTo, previousDayTasks, previousDayProgress } = useDashboardState()
  const [selectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const unscheduledTasks = getUnscheduledTasks()
  const scheduledTasks = getScheduledTasks()

  const handleStartNewDay = () => {
    startNewDay(selectedDate)
    transitionTo('planning')
  }

  const handleActivateDay = () => {
    activateDay()
    transitionTo('active')
  }

  const handleCompleteDay = () => {
    completeDay()
    transitionTo('unplanned')
  }

  const handleTaskCreated = () => {
    // Task creation logic is handled by the context
  }



  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0

  const highPriorityTasks = tasks.filter(t => t.priority >= 7)
  const todayTasks = scheduledTasks.filter(t => t.scheduledTime !== undefined)

  const progressItems = [
    {
      label: "Tasks Completed",
      value: tasks.filter(t => t.completed).length,
      total: tasks.length,
      color: "success",
      icon: "check" as const
    },
    {
      label: "Tasks Scheduled",
      value: scheduledTasks.length,
      total: tasks.length,
      color: "warning",
      icon: "clock" as const
    },
    {
      label: "High Priority",
      value: highPriorityTasks.filter(t => t.completed).length,
      total: highPriorityTasks.length,
      color: "danger",
      icon: "target" as const
    },
    {
      label: "Today's Progress",
      value: todayTasks.filter(t => t.completed).length,
      total: todayTasks.length,
      icon: "trending" as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation currentPage="dashboard" />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* State-based UI Rendering */}
        {currentState === 'unplanned' && (
          <UnplannedDayUI 
            onPlanDay={handleStartNewDay}
            previousDayTasks={previousDayTasks}
            previousDayProgress={previousDayProgress}
          />
        )}

        {currentState === 'planning' && (
          <PlanningDayUI 
            onStartDay={handleActivateDay}
          />
        )}

        {currentState === 'active' && (
          <ActiveDayUI 
            onCompleteDay={handleCompleteDay}
          />
        )}
      </main>
    </div>
  )
}