'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Task } from '@/types'
import { useTask, useDay } from '@/hooks'
import { TimeSlot } from './time-slot'

interface DailyGridProps {
  date: string
  tasks?: Task[]
  className?: string
}

export function DailyGrid({ date, tasks = [], className }: DailyGridProps) {
  const { scheduleTask } = useTask()
  const { canModifySchedule } = useDay()

  const handleTaskDrop = (taskId: string, hour: number) => {
    scheduleTask(taskId, hour)
  }

  // Generate hours from 0 to 23 (24-hour format)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getScheduledTasksForHour = (hour: number) => {
    return tasks.filter(task => task.scheduledTime === hour)
  }

  const getTasksForTimeRange = (startHour: number, endHour: number) => {
    return tasks.filter(task => {
      if (task.scheduledTime === undefined) return false
      const taskEnd = task.scheduledTime + task.duration
      return task.scheduledTime < endHour && taskEnd > startHour
    })
  }

  const isOverlappingTask = (hour: number, task: Task) => {
    if (task.scheduledTime === undefined) return false
    const taskEnd = task.scheduledTime + task.duration
    return hour >= task.scheduledTime && hour < taskEnd
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          Daily Schedule - {new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </CardTitle>
        <div className="text-sm text-gray-600">
          {canModifySchedule() ? 
            'Planning Mode: Drag tasks to schedule them' : 
            'Active Mode: Schedule is locked'
          }
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">Time</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                  <span className="text-gray-600">Low Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-gray-600">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-gray-600">High Priority</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time slots */}
          <div className="divide-y divide-gray-200">
            {hours.map((hour) => {
              const hourTasks = getScheduledTasksForHour(hour)
              const hasMultiHourTask = tasks.some(task => isOverlappingTask(hour, task) && task.duration > 1 && task.scheduledTime !== hour)
              
              return (
                <div key={hour} className="relative">
                  {hasMultiHourTask && (
                    <div className="absolute inset-0 bg-gray-50 opacity-50 z-0"></div>
                  )}
                  
                  <TimeSlot
                    hour={hour}
                    tasks={hourTasks}
                    onTaskDrop={canModifySchedule() ? handleTaskDrop : undefined}
                    className={hasMultiHourTask ? 'relative z-10' : ''}
                  />
                </div>
              )
            })}
          </div>

          {/* Footer with summary */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600">Total Tasks</div>
                <div className="text-lg font-bold">{tasks.length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Scheduled</div>
                <div className="text-lg font-bold">{tasks.filter(t => t.scheduledTime !== undefined).length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Completed</div>
                <div className="text-lg font-bold text-green-600">{tasks.filter(t => t.completed).length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Failed</div>
                <div className="text-lg font-bold text-red-600">{tasks.filter(t => t.failed).length}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}