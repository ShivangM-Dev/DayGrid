'use client'

import { useState, useEffect } from 'react'
import { BusinessHoursConfig, BusinessHoursService } from '@/lib/business-hours'

export function useBusinessHours() {
  const [businessHours, setBusinessHours] = useState<BusinessHoursConfig>(
    BusinessHoursService.getBusinessHours()
  )

  const updateBusinessHours = (newConfig: BusinessHoursConfig) => {
    BusinessHoursService.saveBusinessHours(newConfig)
    setBusinessHours(newConfig)
  }

  const resetBusinessHours = () => {
    BusinessHoursService.resetToDefault()
    setBusinessHours(BusinessHoursService.getBusinessHours())
  }

  // Refresh on window focus to catch changes from other tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setBusinessHours(BusinessHoursService.getBusinessHours())
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'daygrid-business-hours') {
        setBusinessHours(BusinessHoursService.getBusinessHours())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return {
    businessHours,
    updateBusinessHours,
    resetBusinessHours,
    isBusinessHour: (timeSlot: number, date: Date) => 
      BusinessHoursService.isBusinessHour(timeSlot, date)
  }
}