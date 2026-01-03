'use client'

import React, { useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Task } from '@/types'
import { useTask, useDay, useAnimation } from '@/hooks'
import { cn } from '@/lib/utils'

interface TimeSlotProps {
  hour: number
  tasks: Task[]
  onTaskDrop?: (taskId: string, hour: number) => void
  className?: string
}

export function TimeSlot({ hour, tasks, onTaskDrop, className }: TimeSlotProps) {
  const { validateTimeSlot, canModifySchedule } = useDay()
  const slotRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!canModifySchedule()) return
    
    setIsDragOver(true)
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (!canModifySchedule() || !onTaskDrop) return

    const taskId = e.dataTransfer.getData('taskId')
    const taskDuration = parseFloat(e.dataTransfer.getData('taskDuration') || '1')
    
    if (!taskId) return

    // Validate if task can be scheduled at this time
    const canSchedule = validateTimeSlot(hour, taskDuration, taskId)
    
    if (canSchedule) {
      onTaskDrop(taskId, hour)
    }
  }

  const isBusinessHour = hour >= 6 && hour < 22
  const slotTasks = tasks.filter(task => task.scheduledTime === hour)
  const isAvailable = isBusinessHour && slotTasks.length === 0

  return (
    <div 
      ref={slotRef}
      className={cn(
        'border-b border-l border-r border-gray-200 min-h-[60px] relative transition-colors duration-200',
        !isBusinessHour && 'bg-gray-50 opacity-50',
        isDragOver && isAvailable && 'bg-blue-50 border-blue-300',
        !isBusinessHour && 'bg-gray-100',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute left-2 top-1 text-xs text-gray-500 font-medium">
        {formatHour(hour)}
      </div>
      
      <div className="pl-16 pr-2 py-1">
        {slotTasks.map((task) => (
          <div
            key={task.id}
            className="mb-1 last:mb-0"
          >
            <div 
              className={cn(
                'p-2 rounded text-xs font-medium border cursor-move transition-all duration-200 hover:shadow-sm',
                task.completed && 'opacity-60 line-through bg-gray-100 border-gray-300',
                task.failed && 'bg-red-50 border-red-200 text-red-800',
                task.abandoned && 'bg-gray-50 border-gray-300 text-gray-600',
                !task.completed && !task.failed && !task.abandoned && 'bg-white border-gray-300 hover:border-blue-300',
                task.priority >= 7 && 'border-red-400 bg-red-50',
                task.priority >= 4 && task.priority < 7 && 'border-yellow-400 bg-yellow-50'
              )}
              draggable={canModifySchedule() && !task.completed && !task.failed && !task.abandoned}
              onDragStart={(e) => {
                e.dataTransfer.setData('taskId', task.id)
                e.dataTransfer.setData('taskDuration', task.duration.toString())
              }}
            >
              <div className="flex items-center justify-between">
                <span className="truncate flex-1">{task.title}</span>
                <span className="text-xs opacity-70 ml-2">P{task.priority}</span>
              </div>
              {task.duration > 1 && (
                <div className="text-xs opacity-60 mt-1">
                  {task.duration}h duration
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isAvailable && canModifySchedule() && (
          <div className="text-xs text-gray-400 py-2 text-center">
            Drop task here
          </div>
        )}
        
        {!isBusinessHour && (
          <div className="text-xs text-gray-400 py-2 text-center">
            Outside business hours
          </div>
        )}
      </div>
    </div>
  )
}