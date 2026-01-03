'use client'

import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { useTasks } from './use-tasks'
import { useDayState } from './use-day-state'

export function useDragAndDrop() {
  const { tasks } = useTasks()
  const { canModifySchedule, validateTimeSlot } = useDayState()

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Handle drag start visual feedback
    console.log('Drag started:', event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Handle drag over logic
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !canModifySchedule()) {
      return
    }

    const taskId = active.id as string
    const targetHour = parseInt((over.id as string).toString().replace('hour-', ''))

    if (isNaN(targetHour) || targetHour < 0 || targetHour > 23) {
      return
    }

    // Find the task being dragged
    const draggedTask = tasks.find(task => task.id === taskId)
    if (!draggedTask) {
      return
    }

    // Validate the time slot
    const canSchedule = validateTimeSlot(targetHour, draggedTask.duration, taskId)
    
    if (canSchedule) {
      // This would typically update the task schedule
      console.log(`Task ${taskId} can be scheduled at hour ${targetHour}`)
    } else {
      console.log(`Cannot schedule task ${taskId} at hour ${targetHour}`)
    }
  }

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    canDrag: canModifySchedule(),
  }
}