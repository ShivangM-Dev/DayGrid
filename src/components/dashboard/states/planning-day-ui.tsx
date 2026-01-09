'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { TaskForm } from '@/components/main-application/task-inbox/task-form'
import { TaskWidget } from '@/components/dashboard/task-widget'
import { DailyGrid } from '@/components/main-application/daily-grid/daily-grid'
import { DailyGridFooter } from '@/components/main-application/daily-grid/daily-grid-footer'
import { DragAndDropHelper } from '@/components/main-application/ui/drag-and-drop-helper'
import { TaskCard } from '@/components/main-application/task-inbox/task-card'
import { useTasks } from '@/hooks/use-tasks'
import { useDayState } from '@/hooks/use-day-state'
import { format } from 'date-fns'
import { Plus, Grid3X3, Play, CheckCircle, Clock, Target } from 'lucide-react'

interface PlanningDayUIProps {
  onStartDay: () => void
}

export function PlanningDayUI({ onStartDay }: PlanningDayUIProps) {
  const { tasks, getUnscheduledTasks, getScheduledTasks } = useTasks()
  const { state: dayState } = useDayState()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const unscheduledTasks = getUnscheduledTasks()
  const scheduledTasks = getScheduledTasks()

  const hasScheduledTasks = scheduledTasks.length > 0
  const canStartDay = hasScheduledTasks

  const handleTaskCreated = () => {
    // Task creation logic is handled by the context
  }

  return (
    <div className="space-y-6">
      {/* Planning Header */}
      <div className="animate-slide-up-fade">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Plan Your Day
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Create tasks and organize them in your daily schedule
                </p>
                
                {/* Planning Steps */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-primary font-medium">Create Tasks</span>
                    </div>
                    <span className="text-primary">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-primary font-medium">Schedule in Grid</span>
                    </div>
                    <span className="text-primary">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-primary font-medium">Start Day</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button 
                  onClick={onStartDay}
                  disabled={!canStartDay}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Day
                  {!canStartDay && (
                    <span className="ml-2 text-xs opacity-75">
                      (Schedule tasks first)
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Planning Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Unscheduled Tasks</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{unscheduledTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Scheduled Tasks</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{scheduledTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Tasks</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Planning Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Task Creation & Unscheduled Tasks */}
        <div className="space-y-6 animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
          {/* Task Creation */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm 
                trigger={
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                }
                onSuccess={handleTaskCreated}
              />
              
              {unscheduledTasks.length > 0 && (
                <div className="mt-4 text-xs text-muted-foreground text-center p-2 bg-background/50 rounded-lg border border-border/30">
                  📝 You have <span className="font-bold text-primary">{unscheduledTasks.length}</span> task{unscheduledTasks.length !== 1 ? 's' : ''} to schedule
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unscheduled Tasks */}
          <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">📋</div>
                  Unscheduled Tasks
                </div>
                <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                  Drag to grid
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] border-2 border-dashed border-border/30 rounded-lg p-3 bg-background/30 hover:border-primary/50 transition-colors">
                <TaskWidget
                  tasks={unscheduledTasks}
                  title=""
                  variant="compact"
                  maxItems={8}
                  draggable={true}
                />
              </div>
              
              {unscheduledTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm">No unscheduled tasks</p>
                  <p className="text-xs mt-1">Create tasks above to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drag & Drop Helper */}
          <DragAndDropHelper />
        </div>

        {/* Right Column - Daily Grid */}
        <div className="xl:col-span-2 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
          <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5" />
                  Daily Schedule Grid
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-sm text-muted-foreground">Drag & Drop</span>
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
              
              {scheduledTasks.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold mb-2">Start Scheduling Your Day</h3>
                  <p className="text-sm mb-4">Drag tasks from the left panel to schedule them in time slots</p>
                  <div className="flex justify-center gap-2 text-xs">
                    <span className="px-3 py-1 bg-background/50 rounded-full border border-border/30">
                      🎯 Plan your priorities
                    </span>
                    <span className="px-3 py-1 bg-background/50 rounded-full border border-border/30">
                      ⏰ Set time blocks
                    </span>
                    <span className="px-3 py-1 bg-background/50 rounded-full border border-border/30">
                      🚀 Be productive
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Grid Footer - Summary */}
      <div className="mt-4 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
        <DailyGridFooter tasks={scheduledTasks} />
      </div>

      {/* Planning Tips */}
      <div className="animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-foreground">💡 Planning Tips</h3>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Start with your most important task
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Group similar tasks together
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Include breaks in your schedule
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Be realistic about time estimates
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}