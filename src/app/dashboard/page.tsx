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
import { useAuth } from '@/hooks/use-auth'
import { format, startOfDay } from 'date-fns'
import { Calendar, Clock, Target, Plus } from 'lucide-react'
import { DashboardNavigation } from '@/components/shared/navigation/dashboard-navigation'

export default function Dashboard() {
  const { tasks, getUnscheduledTasks, getScheduledTasks } = useTasks()
  const { state: dayState, startNewDay, activateDay } = useDayState()
  const { isAuthenticated, user, logout } = useAuth()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const unscheduledTasks = getUnscheduledTasks()
  const scheduledTasks = getScheduledTasks()

  const handleStartNewDay = () => {
    startNewDay(selectedDate)
  }

  const handleActivateDay = () => {
    activateDay()
  }

  const handleTaskCreated = () => {
    // Task creation logic is handled by the context
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DashboardNavigation currentPage="dashboard" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Task Management */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Day Status */}
            {dayState.currentDay && (
              <DayStatusComponent
                dayState={dayState.currentDay}
                onStartDay={handleActivateDay}
              />
            )}

            {/* Start Day Button */}
            {!dayState.currentDay && (
              <StartDayButton
                onDayStart={handleStartNewDay}
              />
            )}

            {/* Add Task Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskForm onSuccess={handleTaskCreated} />
              </CardContent>
            </Card>

            {/* Unscheduled Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Unscheduled Tasks ({unscheduledTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unscheduledTasks.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    All tasks are scheduled!
                  </div>
                ) : (
                  unscheduledTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      className="cursor-move"
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Daily Grid */}
          <div className="lg:col-span-2">
            <DailyGrid
              date={selectedDate}
              tasks={scheduledTasks}
              className="min-h-[600px]"
            />
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-green-600">{scheduledTasks.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unscheduled</p>
                  <p className="text-2xl font-bold text-yellow-600">{unscheduledTasks.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {tasks.filter(t => t.completed).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}