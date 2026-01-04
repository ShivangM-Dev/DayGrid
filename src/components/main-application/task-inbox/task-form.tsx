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
  const { addTask } = useTask()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    priority: 5,
    duration: 1,
    type: TaskType.REGULAR,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

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
  }

  const handlePriorityChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, priority: value[0] }))
  }

  const handleDurationChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, duration: value[0] }))
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 7) return 'text-red-600 border-red-200'
    if (priority >= 4) return 'text-yellow-600 border-yellow-200'
    return 'text-gray-600 border-gray-200'
  }

  const getPriorityLabel = (priority: number) => {
    if (priority >= 7) return 'High Priority (Exclusive)'
    if (priority >= 4) return 'Medium Priority'
    return 'Low Priority'
  }

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
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Task Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {taskTypeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = formData.type === option.value
                
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: option.value }))}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Priority: {formData.priority} - {getPriorityLabel(formData.priority)}
            </label>
            <div className={`p-4 border rounded-lg ${getPriorityColor(formData.priority)}`}>
              <Slider
                value={[formData.priority]}
                onValueChange={handlePriorityChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2">
                <span>1 (Low)</span>
                <span>5 (Medium)</span>
                <span>10 (High)</span>
              </div>
              {formData.priority >= 7 && (
                <div className="mt-2 text-xs">
                  ⚠️ Only one task can have high priority (7-10)
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Duration: {formData.duration} hour{formData.duration !== 1 ? 's' : ''}
            </label>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Slider
                value={[formData.duration]}
                onValueChange={handleDurationChange}
                max={8}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2 text-gray-500">
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
              disabled={!formData.title.trim()}
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