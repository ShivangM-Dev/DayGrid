'use client'

import React from 'react'
import { Slider } from '@/components/shared/ui/slider'
import { cn } from '@/lib/utils'

interface PrioritySliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
}

export function PrioritySlider({ value, onChange, disabled = false, className }: PrioritySliderProps) {
  const getPriorityColor = (priority: number) => {
    if (priority >= 7) return 'bg-red-500'
    if (priority >= 4) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getPriorityLabel = (priority: number) => {
    if (priority >= 7) return `Priority ${priority} (Exclusive)`
    if (priority >= 4) return 'Medium Priority'
    return 'Low Priority'
  }

  const handleChange = (newValue: number[]) => {
    onChange(newValue[0])
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Priority Level</span>
        <span className="text-sm font-bold">P{value}</span>
      </div>
      
      <div className={cn(
        'p-4 rounded-lg border',
        value >= 7 ? 'border-red-200 bg-red-50' :
        value >= 4 ? 'border-yellow-200 bg-yellow-50' :
        'border-gray-200 bg-gray-50'
      )}>
        <Slider
          value={[value]}
          onValueChange={handleChange}
          max={10}
          min={1}
          step={1}
          disabled={disabled}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs mt-3 mb-2 text-gray-600">
          <span>1 (Low)</span>
          <span>5 (Medium)</span>
          <span>10 (High)</span>
        </div>
        
        <div className="text-sm font-medium text-center">
          {getPriorityLabel(value)}
        </div>
        
        {value >= 7 && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
            ⚠️ <strong>Exclusive Priority {value}:</strong> Only one task can have priority {value}. 
            This task will be locked once scheduled.
          </div>
        )}
        
        {value >= 1 && value <= 3 && (
          <div className="mt-2 p-2 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600">
            ℹ️ <strong>Low Priority:</strong> Unlimited low priority tasks can be created.
          </div>
        )}
      </div>
    </div>
  )
}