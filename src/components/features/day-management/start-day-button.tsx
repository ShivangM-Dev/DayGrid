'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDay } from '@/hooks'
import { Play, Lock, AlertTriangle } from 'lucide-react'

interface StartDayButtonProps {
  onDayStart?: () => void
  disabled?: boolean
  className?: string
}

export function StartDayButton({ onDayStart, disabled = false, className }: StartDayButtonProps) {
  const { state: dayState, activateDay, canModifySchedule } = useDay()

  const handleStartDay = () => {
    activateDay()
    onDayStart?.()
  }

  // Check if all tasks are scheduled
  const allTasksScheduled = dayState.currentDay?.tasks.every(task => task.scheduledTime !== undefined) ?? true

  // Check if day can be started
  const canStartDay = canModifySchedule() && allTasksScheduled && !disabled

  const getStatusMessage = () => {
    if (!canModifySchedule()) {
      return {
        message: 'Day is already active or completed',
        icon: Lock,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      }
    }

    if (!allTasksScheduled) {
      const unscheduledCount = dayState.currentDay?.tasks.filter(task => task.scheduledTime === undefined).length || 0
      return {
        message: `${unscheduledCount} task${unscheduledCount !== 1 ? 's' : ''} need${unscheduledCount !== 1 ? '' : 's'} to be scheduled`,
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      }
    }

    return {
      message: 'All tasks scheduled. Ready to start your day!',
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    }
  }

  const status = getStatusMessage()
  const StatusIcon = status.icon

  if (dayState.currentDay?.status !== 'planning') {
    return (
      <Card className={`${className} border-gray-200`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-gray-500">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-sm">Day is already active</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} ${status.bgColor} border-2`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Message */}
          <div className={`flex items-center gap-2 ${status.color}`}>
            <StatusIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{status.message}</span>
          </div>

          {/* Start Day Button */}
          <Button
            onClick={handleStartDay}
            disabled={!canStartDay}
            className="w-full"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Day
          </Button>

          {/* Additional Information */}
          {dayState.currentDay && (
            <div className="text-xs text-gray-600 space-y-1">
              <div>Total tasks: {dayState.currentDay.tasks.length}</div>
              <div>Scheduled: {dayState.currentDay.tasks.filter(t => t.scheduledTime !== undefined).length}</div>
              
              {dayState.currentDay.hasHighPriorityTask && (
                <div className="font-medium text-red-600">
                  ⚠️ High priority task detected
                </div>
              )}
            </div>
          )}

          {/* Warning about schedule locking */}
          {canStartDay && (
            <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              <strong>Warning:</strong> Once you start the day, the schedule becomes locked 
              and you won't be able to modify task timings. Only task completion status can be changed.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}