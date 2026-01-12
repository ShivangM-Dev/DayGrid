'use client'

import React, { useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/ui/card'
import { Task } from '@/types'
import { useTask, useDay, useAnimation } from '@/hooks'
import { BusinessHoursService } from '@/lib/business-hours'
import { cn } from '@/lib/utils'

interface TimeSlotProps {
  hour: number
  tasks: Task[]
  onTaskDrop?: (taskId: string, hour: number) => void
  onTaskRemove?: (taskId: string) => void
  className?: string
  date?: string
}

export const TimeSlot = React.memo(function TimeSlot({ hour, tasks, onTaskDrop, onTaskRemove, className, date }: TimeSlotProps) {
  const { validateTimeSlot, canModifySchedule } = useDay()
  const slotRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = Math.floor(hour) > 12 ? Math.floor(hour) - 12 : Math.floor(hour) === 0 ? 12 : Math.floor(hour)
    const minutes = (hour % 1) * 60
    const minuteStr = minutes === 0 ? '00' : minutes.toString()
    return `${displayHour}:${minuteStr} ${period}`
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
    const canSchedule = validateTimeSlot(hour, taskDuration, taskId, date)
    
    if (canSchedule) {
      onTaskDrop(taskId, hour)
    }
  }

  const taskDate = date ? new Date(date) : new Date()
  const isBusinessHour = BusinessHoursService.isBusinessHour(hour, taskDate)
  const slotTasks = tasks.filter(task => task.scheduledTime === hour)
  const isAvailable = isBusinessHour && slotTasks.length === 0

return (
    <div 
      ref={slotRef}
      className={cn(
        'border-b border-l border-r border-border min-h-[60px] relative transition-colors duration-200',
        !isBusinessHour && 'bg-muted opacity-50',
        isDragOver && isAvailable && 'bg-primary/10 border-primary',
        className
      )}
      data-time-slot="true"
      data-hour={hour.toString()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute left-2 top-1 text-xs text-muted-foreground font-medium">
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
                'p-2 rounded text-xs font-medium border cursor-move transition-all duration-200 hover:shadow-sm group',
                task.completed && 'opacity-60 line-through bg-muted border-muted-foreground/50 text-muted-foreground',
                task.failed && 'bg-destructive/10 border-destructive/30 text-destructive',
                task.abandoned && 'bg-muted border-muted-foreground/50 text-muted-foreground',
                !task.completed && !task.failed && !task.abandoned && 'bg-card border-border hover:border-primary',
                task.priority >= 7 && 'border-destructive/60 bg-destructive/10',
                task.priority >= 4 && task.priority < 7 && 'border-warning/60 bg-warning/10'
              )}
              draggable={canModifySchedule() && !task.completed && !task.failed && !task.abandoned}
              onDragStart={(e) => {
                e.dataTransfer.setData('taskId', task.id)
                e.dataTransfer.setData('taskDuration', task.duration.toString())
              }}
            >
              <div className="flex items-center justify-between">
                <span className="truncate flex-1">{task.title}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs opacity-70">P{task.priority}</span>
                  {canModifySchedule() && !task.completed && !task.failed && !task.abandoned && onTaskRemove && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskRemove(task.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-0.5 hover:bg-destructive/20 rounded text-destructive hover:text-destructive-foreground"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
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
          <div className="text-xs text-muted-foreground py-2 text-center">
            Drop task here
          </div>
        )}
        
        {!isBusinessHour && (
          <div className="text-xs text-muted-foreground/60 py-2 text-center">
            Outside business hours
          </div>
        )}
      </div>
      
      {/* Drag over overlay */}
      {isDragOver && isAvailable && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none flex items-center justify-center">
<div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium animate-pulse">
            Drop task
          </div>
        </div>
      )}
    </div>
  )
})