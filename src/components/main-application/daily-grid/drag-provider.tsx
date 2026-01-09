'use client'

import React, { createContext, useContext } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, TouchSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useTasks } from '../../../hooks/use-tasks'
import { useDayState } from '../../../hooks/use-day-state'

interface DragAndDropContextType {
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
}

const DragAndDropContext = createContext<DragAndDropContextType | undefined>(undefined)

export function DragAndDropProvider({ children }: { children: React.ReactNode }) {
  const { tasks } = useTasks()
  const { canModifySchedule, validateTimeSlot } = useDayState()
  
  // Enhanced sensors for better mobile and desktop support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay for touch
        tolerance: 8, // 8px tolerance
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Handle drag start visual feedback
    console.log('Drag started:', event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Handle drag over logic
    // preventDefault is not available on DragOverEvent
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !canModifySchedule()) {
      return
    }

    const taskId = active.id as string
    const targetHour = parseInt((over.id as string).replace('hour-', ''))

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
      // Schedule the task
      // This would be handled by the parent component that uses this context
      console.log(`Task ${taskId} can be scheduled at hour ${targetHour}`)
    } else {
      console.log(`Cannot schedule task ${taskId} at hour ${targetHour}`)
    }
  }

  return (
    <DragAndDropContext.Provider
      value={{
        handleDragStart,
        handleDragOver,
        handleDragEnd,
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </DragAndDropContext.Provider>
  )
}

export function useDragAndDrop() {
  const context = useContext(DragAndDropContext)
  if (context === undefined) {
    throw new Error('useDragAndDrop must be used within a DragAndDropProvider')
  }
  return context
}