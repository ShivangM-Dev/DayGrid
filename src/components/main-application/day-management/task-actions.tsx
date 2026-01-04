'use client'

import React from 'react'
import { Button } from '@/components/shared/ui/button'
import { Card, CardContent } from '@/components/shared/ui/card'
import { useTask, useDay } from '@/hooks'
import { CheckCircle, XCircle, Ban, Clock, AlertTriangle } from 'lucide-react'
import { Task } from '@/types'

interface TaskActionsProps {
  task: Task
  onActionComplete?: () => void
  className?: string
}

export function TaskActions({ task, onActionComplete, className }: TaskActionsProps) {
  const { completeTask, failTask, abandonTask } = useTask()
  const { state: dayState, canModifySchedule } = useDay()

  const handleComplete = async () => {
    completeTask(task.id)
    onActionComplete?.()
  }

  const handleFail = async () => {
    failTask(task.id)
    onActionComplete?.()
  }

  const handleAbandon = async () => {
    abandonTask(task.id)
    onActionComplete?.()
  }

  // Don't show actions if task is already processed
  if (task.completed || task.failed || task.abandoned) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-gray-500">
            {task.completed && (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm">Task Completed</span>
              </>
            )}
            {task.failed && (
              <>
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-sm">Task Failed</span>
              </>
            )}
            {task.abandoned && (
              <>
                <Ban className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">Task Abandoned</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if current time matches the task schedule
  const isCurrentTime = () => {
    if (!task.scheduledTime) return false
    
    const now = new Date()
    const currentHour = now.getHours()
    const taskEnd = task.scheduledTime + task.duration
    
    return currentHour >= task.scheduledTime && currentHour < taskEnd
  }

  const isScheduledForFuture = () => {
    if (!task.scheduledTime) return false
    return new Date().getHours() < task.scheduledTime
  }

  const canActOnTask = () => {
    // Can act on task if day is active and it's currently scheduled time
    return dayState.currentDay?.status === 'active' && isCurrentTime()
  }

  const getStatusMessage = () => {
    if (dayState.currentDay?.status === 'planning') {
      return {
        icon: Clock,
        message: 'Day is in planning mode',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      }
    }

    if (dayState.currentDay?.status === 'completed') {
      return {
        icon: CheckCircle,
        message: 'Day has been completed',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      }
    }

    if (!task.scheduledTime) {
      return {
        icon: AlertTriangle,
        message: 'Task is not scheduled',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      }
    }

    if (isScheduledForFuture()) {
      return {
        icon: Clock,
        message: `Scheduled for ${task.scheduledTime}:00`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      }
    }

    if (isCurrentTime()) {
      return {
        icon: CheckCircle,
        message: 'Time to work on this task!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      }
    }

    return {
      icon: Clock,
      message: 'Scheduled time has passed',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    }
  }

  const status = getStatusMessage()
  const StatusIcon = status.icon

  return (
    <Card className={`${className} ${status.bgColor} border-2`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Status Message */}
          <div className={`flex items-center gap-2 ${status.color}`}>
            <StatusIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{status.message}</span>
          </div>

          {/* Task Information */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-medium">{task.title}</div>
            <div>Priority: P{task.priority} ({task.type})</div>
            <div>Duration: {task.duration} hour{task.duration !== 1 ? 's' : ''}</div>
            {task.scheduledTime && (
              <div>
                Scheduled: {task.scheduledTime}:00 - {task.scheduledTime + task.duration}:00
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {canActOnTask() ? (
              <>
                <Button
                  onClick={handleComplete}
                  className="w-full"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleFail}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Button>
                  
                  <Button
                    onClick={handleAbandon}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-700 border-gray-200 hover:bg-gray-50"
                  >
                    <Ban className="w-3 h-3 mr-1" />
                    Abandon
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-gray-500 p-2 border rounded bg-gray-50">
                {canModifySchedule() ? 
                  'Start the day to enable task actions' : 
                  'Wait for scheduled time to perform actions'
                }
              </div>
            )}
          </div>

          {/* Priority Warning */}
          {task.priority >= 7 && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              High priority task - This task is locked once scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}