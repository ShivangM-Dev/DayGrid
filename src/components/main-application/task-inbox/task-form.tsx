'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/ui/dialog'
import { Button } from '@/components/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Slider } from '@/components/shared/ui/slider'
import { Task, TaskType } from '@/types'
import { useTask } from '@/hooks'
import { Plus, Calendar, Clock, AlertCircle, Target } from 'lucide-react'

const taskTypeOptions = [
  { value: TaskType.REGULAR, label: 'Regular Task', icon: Clock, description: 'Normal work tasks' },
  { value: TaskType.MEETING, label: 'Meeting', icon: Calendar, description: 'Can be rescheduled' },
  { value: TaskType.CLASS, label: 'Class', icon: Calendar, description: 'Can be rescheduled' },
  { value: TaskType.APPOINTMENT, label: 'Appointment', icon: Calendar, description: 'Can be rescheduled' },
  { value: TaskType.DEADLINE, label: 'Deadline', icon: AlertCircle, description: 'Fixed, cannot move' },
  { value: TaskType.COMMITMENT, label: 'Commitment', icon: Target, description: 'Fixed, cannot move' },
]

interface TaskFormProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function TaskForm({ trigger, onSuccess }: TaskFormProps) {
  const { addTask, tasks } = useTask()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    priority: 5,
    duration: 1,
    type: TaskType.REGULAR,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    setError(null)

    const taskData = {
      title: formData.title.trim(),
      priority: formData.priority,
      duration: formData.duration,
      type: formData.type,
      completed: false,
      failed: false,
      abandoned: false,
      isLocked: formData.type === TaskType.DEADLINE || formData.type === TaskType.COMMITMENT,
    }

    try {
      addTask(taskData)
      
      // Reset form
      setFormData({
        title: '',
        priority: 5,
        duration: 1,
        type: TaskType.REGULAR,
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    }
  }

  const handlePriorityChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, priority: value[0] }))
  }

  const handleDurationChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, duration: value[0] }))
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 7) return 'text-red-500 border-red-200 dark:border-red-800'
    if (priority >= 4) return 'text-yellow-500 border-yellow-200 dark:border-yellow-800'
    return 'text-muted-foreground border-input'
  }

  const getPriorityLabel = (priority: number) => {
    if (priority >= 7) return `Priority ${priority} (Exclusive)`
    if (priority >= 4) return 'Medium Priority'
    return 'Low Priority'
  }

  const hasExistingTaskWithSamePriority = tasks.some(task => task.priority === formData.priority)

  const defaultTrigger = (
    <Button className="w-full">
      <Plus className="w-4 h-4 mr-2" />
      Add Task
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Task Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {taskTypeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = formData.type === option.value
               
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all hover-lift ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: option.value }))}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base text-foreground truncate">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Priority: {formData.priority} - {getPriorityLabel(formData.priority)}
            </label>
            <div className={`p-4 border rounded-lg bg-card ${getPriorityColor(formData.priority)}`}>
              <Slider
                value={[formData.priority]}
                onValueChange={handlePriorityChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                <span>1 (Low)</span>
                <span>5 (Medium)</span>
                <span>10 (High)</span>
              </div>
              {formData.priority >= 7 && hasExistingTaskWithSamePriority && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-700 dark:text-red-300">
                  ⚠️ A task with priority {formData.priority} already exists. You cannot create another one.
                </div>
              )}
              {formData.priority >= 7 && !hasExistingTaskWithSamePriority && (
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
                  ⚠️ Only one task can have priority {formData.priority}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Duration: {formData.duration} hour{formData.duration !== 1 ? 's' : ''}
            </label>
            <div className="p-4 border border-input rounded-lg bg-card">
              <Slider
                value={[formData.duration]}
                onValueChange={handleDurationChange}
                max={8}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                <span>0.5h</span>
                <span>4h</span>
                <span>8h</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || (formData.priority >= 7 && hasExistingTaskWithSamePriority)}
              className="flex-1"
            >
              {'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}