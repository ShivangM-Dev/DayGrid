'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/shared/ui/card'
import { Button } from '@/components/shared/ui/button'
import { Task, TaskType } from '@/types'
import { useTask, useDay } from '@/hooks'
import { Clock, Calendar, AlertCircle, CheckCircle, XCircle, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  className?: string
}

const taskTypeIcons = {
  [TaskType.REGULAR]: Clock,
  [TaskType.MEETING]: Calendar,
  [TaskType.CLASS]: Calendar,
  [TaskType.APPOINTMENT]: Calendar,
  [TaskType.DEADLINE]: AlertCircle,
  [TaskType.COMMITMENT]: AlertCircle,
}

const taskTypeColors = {
  [TaskType.REGULAR]: 'bg-blue-50 border-blue-200 text-blue-800',
  [TaskType.MEETING]: 'bg-purple-50 border-purple-200 text-purple-800',
  [TaskType.CLASS]: 'bg-green-50 border-green-200 text-green-800',
  [TaskType.APPOINTMENT]: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  [TaskType.DEADLINE]: 'bg-red-50 border-red-200 text-red-800',
  [TaskType.COMMITMENT]: 'bg-orange-50 border-orange-200 text-orange-800',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export function TaskCard({ task, onEdit, onDelete, className }: TaskCardProps) {
  const { completeTask, failTask, abandonTask } = useTask()
  const { canModifySchedule } = useDay()

  const getPriorityColor = (priority: number) => {
    if (priority >= 7) return priorityColors.high
    if (priority >= 4) return priorityColors.medium
    return priorityColors.low
  }

  const getPriorityLabel = (priority: number) => {
    if (priority >= 7) return 'High Priority'
    if (priority >= 4) return 'Medium Priority'
    return 'Low Priority'
  }

  const handleComplete = () => {
    completeTask(task.id)
  }

  const handleFail = () => {
    failTask(task.id)
  }

  const handleAbandon = () => {
    abandonTask(task.id)
  }

  const isLocked = task.isLocked || !canModifySchedule()

  return (
    <Card 
      className={cn(
        'w-full transition-all duration-300 cursor-move hover:shadow-lg hover:-translate-y-1 hover-lift',
        task.completed && 'opacity-60 cursor-not-allowed',
        task.failed && 'border-red-200 bg-red-50 cursor-not-allowed',
        task.abandoned && 'border-gray-200 bg-gray-50 cursor-not-allowed',
        isLocked && 'opacity-80 cursor-not-allowed',
        !task.completed && !task.failed && !task.abandoned && !isLocked && 'hover:border-primary/50 hover:shadow-primary/20',
        className
      )}
    >
      <CardHeader className="pb-2">
        {!task.completed && !task.failed && !task.abandoned && !isLocked && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-primary/10 border border-primary/30 rounded-full p-1">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {React.createElement(taskTypeIcons[task.type], {
                className: 'w-4 h-4',
              })}
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full border',
                taskTypeColors[task.type]
              )}>
                {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
              </span>
            </div>
            <h3 className="font-semibold text-sm leading-tight">
              {task.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded',
              getPriorityColor(task.priority)
            )}>
              P{task.priority}
            </span>
            {isLocked && (
              <div className="text-xs text-gray-500">
                🔒 Locked
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Duration: {task.duration}h</span>
            {task.scheduledTime !== undefined && (
              <span>Scheduled: {task.scheduledTime}:00</span>
            )}
          </div>
          
          {task.scheduledTime !== undefined && (
            <div className="text-xs text-gray-500">
              {task.scheduledTime}:00 - {task.scheduledTime + task.duration}:00
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs font-medium',
              getPriorityColor(task.priority)
            )}>
              {getPriorityLabel(task.priority)}
            </span>
            
            <div className="flex items-center gap-1">
              {task.completed && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              {task.failed && (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              {task.abandoned && (
                <Ban className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
          
          {canModifySchedule() && !task.completed && !task.failed && !task.abandoned && (
            <div className="flex gap-1 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={handleComplete}
                className="h-7 px-2 text-xs border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-500"
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleFail}
                className="h-7 px-2 text-xs border-gray-600 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 hover:border-gray-500"
              >
                Fail
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAbandon}
                className="h-7 px-2 text-xs border-gray-600 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 hover:border-gray-500"
              >
                Abandon
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}