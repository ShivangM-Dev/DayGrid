'use client'

import { Card, CardContent, CardHeader } from '@/components/shared/ui/card'
import { cn } from '@/lib/utils'
import { Task, TaskType } from '@/types'
import { Clock, Calendar, AlertCircle, CheckCircle2, Circle, GripVertical } from 'lucide-react'
import { format } from 'date-fns'
import { useDayState } from '@/hooks/use-day-state'

interface TaskWidgetProps {
  tasks: Task[]
  title?: string
  maxItems?: number
  className?: string
  variant?: 'list' | 'grid' | 'compact'
  draggable?: boolean
}

export function TaskWidget({
  tasks,
  title = "Tasks",
  maxItems = 5,
  className,
  variant = 'list',
  draggable = false
}: TaskWidgetProps) {
  const { canModifySchedule } = useDayState()
  const displayTasks = tasks.slice(0, maxItems)

  const formatTime = (time: number) => {
    const period = time >= 12 ? 'PM' : 'AM'
    const displayHour = Math.floor(time) > 12 ? Math.floor(time) - 12 : Math.floor(time) === 0 ? 12 : Math.floor(time)
    const minutes = (time % 1) * 60
    const minuteStr = minutes === 0 ? '00' : minutes.toString()
    return `${displayHour}:${minuteStr} ${period}`
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('taskDuration', task.duration.toString())
    e.dataTransfer.effectAllowed = 'move'
    
    // Add dragging class for visual feedback
    const target = e.currentTarget as HTMLElement
    target.classList.add('dragging')
    
    // Remove dragging class when drag ends
    setTimeout(() => {
      target.classList.remove('dragging')
    }, 100)
  }

  const handleTouchStart = (e: React.TouchEvent, task: Task) => {
    const touch = e.touches[0]
    const target = e.currentTarget as HTMLElement
    
    // Store task data for touch drag
    target.dataset.taskId = task.id
    target.dataset.taskDuration = task.duration.toString()
    target.classList.add('dragging')
    
    // Add touch move listener to the document for better tracking
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const elementBelow = document.elementFromPoint(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY)
      
      if (elementBelow) {
        const timeSlot = elementBelow.closest('[data-time-slot]')
        if (timeSlot) {
          // Visual feedback for mobile drag
          const allSlots = document.querySelectorAll('[data-time-slot]')
          allSlots.forEach(slot => slot.classList.remove('drag-over'))
          timeSlot.classList.add('drag-over')
        }
      }
    }

    const handleTouchEnd = (endEvent: TouchEvent) => {
      target.classList.remove('dragging')
      
      const touch = endEvent.changedTouches[0]
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      
      const taskId = target.dataset.taskId
      const taskDuration = target.dataset.taskDuration
      
      if (elementBelow && taskId && taskDuration) {
        const timeSlot = elementBelow.closest('[data-time-slot]')
        if (timeSlot) {
          const hour = parseInt(timeSlot.getAttribute('data-hour') || '0')
          // Trigger drop via custom event
          const dropEvent = new CustomEvent('taskDrop', { 
            detail: { taskId, hour, duration: parseFloat(taskDuration) } 
          })
          document.dispatchEvent(dropEvent)
        }
      }
      
      // Clean up visual feedback
      const allSlots = document.querySelectorAll('[data-time-slot]')
      allSlots.forEach(slot => slot.classList.remove('drag-over'))
      
      // Clean up stored data
      delete target.dataset.taskId
      delete target.dataset.taskDuration
      
      // Remove global listeners
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    // Add global listeners
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }
  
  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.MEETING:
      case TaskType.CLASS:
      case TaskType.APPOINTMENT:
        return <Calendar className="w-4 h-4" />
      case TaskType.DEADLINE:
      case TaskType.COMMITMENT:
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
      case TaskType.MEETING:
        return 'text-purple-500 bg-purple-500/10'
      case TaskType.CLASS:
        return 'text-green-500 bg-green-500/10'
      case TaskType.APPOINTMENT:
        return 'text-yellow-500 bg-yellow-500/10'
      case TaskType.DEADLINE:
        return 'text-red-500 bg-red-500/10'
      case TaskType.COMMITMENT:
        return 'text-orange-500 bg-orange-500/10'
      default:
        return 'text-blue-500 bg-blue-500/10'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 7) return 'text-red-500 bg-red-500/10'
    if (priority >= 4) return 'text-yellow-500 bg-yellow-500/10'
    return 'text-gray-500 bg-gray-500/10'
  }

  const getStatusIcon = (task: Task) => {
    if (task.completed) return <CheckCircle2 className="w-4 h-4 text-green-500" />
    return <Circle className="w-4 h-4 text-muted-foreground" />
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <span className="text-sm text-muted-foreground">{tasks.length}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {displayTasks.map((task) => (
            <div 
              key={task.id} 
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-all duration-200 touch-manipulation',
                draggable && canModifySchedule() && !task.completed && !task.scheduledTime 
                  ? 'hover:bg-accent/50 cursor-move hover:shadow-sm hover:-translate-y-0.5 active:scale-95' 
                  : 'hover:bg-accent/50'
              )}
              draggable={draggable && canModifySchedule() && !task.completed && !task.scheduledTime}
              onDragStart={(e) => draggable && handleDragStart(e, task)}
            >
              {draggable && canModifySchedule() && !task.completed && !task.scheduledTime && (
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              )}
              {getStatusIcon(task)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', getTaskTypeColor(task.type))}>
                    {task.type}
                  </span>
                  {task.scheduledTime && (
                    <span className="text-xs text-muted-foreground">
                      {formatTime(task.scheduledTime)}
                    </span>
                  )}
                  {draggable && !task.scheduledTime && (
                    <span className="text-xs text-primary font-medium">
                      Drag to schedule
                    </span>
                  )}
                </div>
              </div>
              <span className={cn('text-xs px-2 py-1 rounded', getPriorityColor(task.priority))}>
                P{task.priority}
              </span>
            </div>
          ))}
          
          {tasks.length > maxItems && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{tasks.length - maxItems} more tasks
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'p-4 rounded-lg border transition-all duration-200 touch-manipulation',
              task.completed && 'opacity-60',
              draggable && canModifySchedule() && !task.completed && !task.scheduledTime 
                ? 'hover:shadow-sm hover:-translate-y-0.5 cursor-move active:scale-95' 
                : 'hover:shadow-sm'
            )}
            draggable={draggable && canModifySchedule() && !task.completed && !task.scheduledTime}
            onDragStart={(e) => draggable && handleDragStart(e, task)}
          >
            <div className="flex items-start gap-3">
              {draggable && canModifySchedule() && !task.completed && !task.scheduledTime && (
                <div className="flex items-center justify-center">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                </div>
              )}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background">
                {getTaskIcon(task.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', getTaskTypeColor(task.type))}>
                    {task.type}
                  </span>
                  <span className={cn('text-xs px-2 py-0.5 rounded', getPriorityColor(task.priority))}>
                    Priority {task.priority}
                  </span>
                  {draggable && !task.scheduledTime && (
                    <span className="text-xs text-primary font-medium animate-pulse">
                      Drag to schedule
                    </span>
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-foreground truncate">{task.title}</h4>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Duration: {task.duration}h</span>
                  {task.scheduledTime && (
                    <span>Scheduled: {formatTime(task.scheduledTime)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                {getStatusIcon(task)}
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length > maxItems && (
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              View all {tasks.length} tasks →
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}