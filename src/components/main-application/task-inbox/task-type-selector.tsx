'use client'

import React from 'react'
import { Card, CardContent } from '@/components/shared/ui/card'
import { TaskType } from '@/types'
import { Calendar, Clock, AlertCircle, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskTypeSelectorProps {
  value: TaskType
  onChange: (type: TaskType) => void
  disabled?: boolean
  className?: string
}

const taskTypeOptions = [
  {
    value: TaskType.REGULAR,
    label: 'Regular Task',
    icon: Clock,
    description: 'Normal work tasks',
    color: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
  },
  {
    value: TaskType.MEETING,
    label: 'Meeting',
    icon: Calendar,
    description: 'Can be rescheduled',
    color: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
  },
  {
    value: TaskType.CLASS,
    label: 'Class',
    icon: Calendar,
    description: 'Can be rescheduled',
    color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
  },
  {
    value: TaskType.APPOINTMENT,
    label: 'Appointment',
    icon: Calendar,
    description: 'Can be rescheduled',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
  },
  {
    value: TaskType.DEADLINE,
    label: 'Deadline',
    icon: AlertCircle,
    description: 'Fixed, cannot move',
    color: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
  },
  {
    value: TaskType.COMMITMENT,
    label: 'Commitment',
    icon: Target,
    description: 'Fixed, cannot move',
    color: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
  },
]

export function TaskTypeSelector({ value, onChange, disabled = false, className }: TaskTypeSelectorProps) {
  const isReschedulable = (type: TaskType) => {
    return [TaskType.MEETING, TaskType.CLASS, TaskType.APPOINTMENT].includes(type)
  }

  const isFixed = (type: TaskType) => {
    return [TaskType.DEADLINE, TaskType.COMMITMENT].includes(type)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="text-sm font-medium">Task Type</div>
      
      <div className="grid grid-cols-2 gap-2">
        {taskTypeOptions.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.value
          const canReschedule = isReschedulable(option.value)
          const fixedTask = isFixed(option.value)
          
          return (
            <Card
              key={option.value}
              className={cn(
                'cursor-pointer transition-all duration-200',
                option.color,
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '',
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
              )}
              onClick={() => !disabled && onChange(option.value)}
            >
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  
                  <div className="text-xs opacity-80">
                    {option.description}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {canReschedule && (
                      <span className="inline-block px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-medium">
                        🔄 Reschedulable
                      </span>
                    )}
                    {fixedTask && (
                      <span className="inline-block px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-medium">
                        🔒 Fixed Time
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <div className="text-xs text-gray-600 space-y-1">
        <div>• <strong>Reschedulable:</strong> Can be moved if time conflicts arise</div>
        <div>• <strong>Fixed Time:</strong> Cannot be moved once scheduled</div>
        <div>• <strong>Regular:</strong> Standard tasks with flexible scheduling</div>
      </div>
    </div>
  )
}