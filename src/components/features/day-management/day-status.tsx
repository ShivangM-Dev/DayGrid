'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DayState, DayStatus } from '@/types'
import { useDay } from '@/hooks'
import { Play, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface DayStatusProps {
  dayState: DayState
  onStartDay?: () => void
  onCompleteDay?: () => void
  className?: string
}

export function DayStatusComponent({ 
  dayState, 
  onStartDay, 
  onCompleteDay, 
  className 
}: DayStatusProps) {
  const { canModifySchedule } = useDay()

  const getStatusIcon = () => {
    switch (dayState.status) {
      case DayStatus.PLANNING:
        return <Clock className="w-5 h-5 text-blue-600" />
      case DayStatus.ACTIVE:
        return <Play className="w-5 h-5 text-green-600" />
      case DayStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5 text-gray-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (dayState.status) {
      case DayStatus.PLANNING:
        return 'border-blue-200 bg-blue-50'
      case DayStatus.ACTIVE:
        return 'border-green-200 bg-green-50'
      case DayStatus.COMPLETED:
        return 'border-gray-200 bg-gray-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getStatusText = () => {
    switch (dayState.status) {
      case DayStatus.PLANNING:
        return 'Planning Mode'
      case DayStatus.ACTIVE:
        return 'Day Active'
      case DayStatus.COMPLETED:
        return 'Day Completed'
      default:
        return 'Unknown Status'
    }
  }

  const getStatusDescription = () => {
    switch (dayState.status) {
      case DayStatus.PLANNING:
        return 'You can add, edit, and schedule tasks. The schedule is flexible.'
      case DayStatus.ACTIVE:
        return 'The day has started. Schedule is now locked. You can only mark tasks as complete, failed, or abandoned.'
      case DayStatus.COMPLETED:
        return 'The day has ended. All activities are now read-only.'
      default:
        return ''
    }
  }

  const getCompletionRate = () => {
    const completedTasks = dayState.tasks.filter(task => task.completed).length
    const totalActiveTasks = dayState.tasks.filter(task => !task.abandoned).length
    return totalActiveTasks > 0 ? Math.round((completedTasks / totalActiveTasks) * 100) : 0
  }

  const hasUnscheduledTasks = dayState.tasks.some(task => task.scheduledTime === undefined)
  const hasIncompleteTasks = dayState.tasks.some(task => !task.completed && !task.failed && !task.abandoned)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            {dayState.date}
          </CardTitle>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          {getStatusDescription()}
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-600">Total Tasks</div>
            <div className="text-lg font-bold">{dayState.tasks.length}</div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Scheduled</div>
            <div className="text-lg font-bold">
              {dayState.tasks.filter(t => t.scheduledTime !== undefined).length}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Completed</div>
            <div className="text-lg font-bold text-green-600">
              {dayState.tasks.filter(t => t.completed).length}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Failed</div>
            <div className="text-lg font-bold text-red-600">
              {dayState.tasks.filter(t => t.failed).length}
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        {dayState.status !== DayStatus.PLANNING && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Completion Rate</span>
              <span className="font-bold">{getCompletionRate()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionRate()}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* High Priority Task Alert */}
        {dayState.hasHighPriorityTask && dayState.highPriorityTaskId && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <div className="text-sm text-red-800">
              <strong>High Priority Task Active</strong>
              <div className="text-xs opacity-90">
                Only one high priority task (7-10) is allowed per day
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          {dayState.status === DayStatus.PLANNING && (
            <Button
              onClick={onStartDay}
              disabled={hasUnscheduledTasks}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Day
              {hasUnscheduledTasks && (
                <span className="ml-2 text-xs opacity-75">
                  (Schedule all tasks first)
                </span>
              )}
            </Button>
          )}
          
          {dayState.status === DayStatus.ACTIVE && (
            <Button
              onClick={onCompleteDay}
              disabled={hasIncompleteTasks}
              variant="outline"
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Day
              {hasIncompleteTasks && (
                <span className="ml-2 text-xs opacity-75">
                  (Complete remaining tasks first)
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Day Timing Information */}
        {dayState.startTime && (
          <div className="text-xs text-gray-500 border-t pt-2">
            Day started at: {dayState.startTime.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}