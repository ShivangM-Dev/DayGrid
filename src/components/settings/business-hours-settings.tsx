'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/shared/ui/button'
import { BusinessHoursService, BusinessHoursConfig, DEFAULT_BUSINESS_HOURS } from '@/lib/business-hours'
import { Clock, Calendar } from 'lucide-react'

interface BusinessHoursSettingsProps {
  className?: string
  onSave?: (config: BusinessHoursConfig) => void
}

export function BusinessHoursSettings({ className, onSave }: BusinessHoursSettingsProps) {
  const [config, setConfig] = useState<BusinessHoursConfig>(DEFAULT_BUSINESS_HOURS)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setConfig(BusinessHoursService.getBusinessHours())
  }, [])

  const handleSave = () => {
    BusinessHoursService.saveBusinessHours(config)
    onSave?.(config)
    setIsOpen(false)
  }

  const handleReset = () => {
    BusinessHoursService.resetToDefault()
    setConfig(DEFAULT_BUSINESS_HOURS)
    onSave?.(DEFAULT_BUSINESS_HOURS)
  }

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  if (!isOpen) {
    return (
      <div className={className}>
        <Button 
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          Business Hours
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Business Hours Settings
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Time Range */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 block">
              Business Hours
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Start Time</label>
                <select
                  value={config.startTime}
                  onChange={(e) => setConfig({ ...config, startTime: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:border-blue-300 dark:focus:border-blue-600 focus:outline-none"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{formatTime(i)}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">End Time</label>
                <select
                  value={config.endTime}
                  onChange={(e) => setConfig({ ...config, endTime: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:border-blue-300 dark:focus:border-blue-600 focus:outline-none"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{formatTime(i)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Day Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100 block">
              Enable Business Hours For
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={config.weekdaysEnabled}
                  onChange={(e) => setConfig({ ...config, weekdaysEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekdays</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Monday - Friday</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={config.weekendEnabled}
                  onChange={(e) => setConfig({ ...config, weekendEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekends</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Saturday - Sunday</div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="w-4 h-4" />
              Current Settings
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              <div className="font-medium">
                {formatTime(config.startTime)} - {formatTime(config.endTime)}
              </div>
              <div className="text-xs mt-1 space-y-1">
                {config.weekdaysEnabled && <div className="text-green-600 dark:text-green-400">✓ Weekdays enabled</div>}
                {config.weekendEnabled && <div className="text-green-600 dark:text-green-400">✓ Weekends enabled</div>}
                {!config.weekdaysEnabled && <div className="text-red-600 dark:text-red-400">✗ Weekdays disabled</div>}
                {!config.weekendEnabled && <div className="text-red-600 dark:text-red-400">✗ Weekends disabled</div>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-5 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset to Default
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}