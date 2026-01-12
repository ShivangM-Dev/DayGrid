'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { Input } from '@/components/shared/ui/input'
import { Label } from '@/components/shared/ui/label'
import { Target, ArrowRight, ArrowLeft, Check, User, Clock, Bell, Palette } from 'lucide-react'


interface OnboardingData {
  name: string;
  timezone: string;
  preferences: {
    workingHours: { start: number; end: number };
    defaultTaskDuration: number;
    notifications: {
      taskReminders: boolean;
      dayStart: boolean;
      deadlineAlerts: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

const themes = [
  { value: 'light', label: 'Light', description: 'Clean and bright interface' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes in low light' },
  { value: 'system', label: 'System', description: 'Follows your device preference' },
] as const

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    timezone: 'UTC',
    preferences: {
      workingHours: { start: 9, end: 17 },
      defaultTaskDuration: 60,
      notifications: {
        taskReminders: true,
        dayStart: true,
        deadlineAlerts: true,
      },
      theme: 'system',
    },
  })

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to DayGrid',
      description: "Let's set up your personalized experience",
      icon: Target,
    },
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: User,
    },
    {
      id: 'schedule',
      title: 'Working Hours',
      description: 'When do you usually work?',
      icon: Clock,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'How should we remind you?',
      icon: Bell,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Choose your preferred theme',
      icon: Palette,
    },
  ]

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      ...updates,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Save to local storage since no auth
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData))
      router.push('/dashboard')
    } catch {
      setError('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-10 h-10 text-black" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Welcome to DayGrid!
              </h3>
              <p className="text-gray-400 mb-6">
                We&apos;ll help you set up your personalized productivity experience in just a few steps.
              </p>
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Efficient Task Management</p>
                    <p className="text-gray-400 text-sm">Organize and track your daily tasks efficiently</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Daily Planning</p>
                    <p className="text-gray-400 text-sm">Structure your day with time-blocking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Progress Tracking</p>
                    <p className="text-gray-400 text-sm">Monitor your productivity over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-300 text-sm">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={onboardingData.name}
                onChange={(e) => updateOnboardingData({ name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500 mt-1"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="timezone" className="text-gray-300 text-sm">Timezone</Label>
              <select
                id="timezone"
                value={onboardingData.timezone}
                onChange={(e) => updateOnboardingData({ timezone: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-3 py-2 mt-1 focus:border-gray-500 focus:outline-none"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )

      case 'schedule':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-gray-300 text-sm">Working Hours</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="startHour" className="text-gray-400 text-xs">Start Time</Label>
                  <select
                    id="startHour"
                    value={onboardingData.preferences.workingHours.start}
                    onChange={(e) => updateOnboardingData({
                      preferences: {
                        ...onboardingData.preferences,
                        workingHours: {
                          ...onboardingData.preferences.workingHours,
                          start: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-3 py-2 mt-1 focus:border-gray-500 focus:outline-none"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="endHour" className="text-gray-400 text-xs">End Time</Label>
                  <select
                    id="endHour"
                    value={onboardingData.preferences.workingHours.end}
                    onChange={(e) => updateOnboardingData({
                      preferences: {
                        ...onboardingData.preferences,
                        workingHours: {
                          ...onboardingData.preferences.workingHours,
                          end: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-3 py-2 mt-1 focus:border-gray-500 focus:outline-none"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="defaultDuration" className="text-gray-300 text-sm">Default Task Duration (minutes)</Label>
              <Input
                id="defaultDuration"
                type="number"
                min="15"
                max="480"
                step="15"
                value={onboardingData.preferences.defaultTaskDuration}
                onChange={(e) => updateOnboardingData({
                  preferences: {
                    ...onboardingData.preferences,
                    defaultTaskDuration: parseInt(e.target.value) || 60
                  }
                })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500 mt-1"
              />
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                <div>
                  <p className="text-white font-medium">Task Reminders</p>
                  <p className="text-gray-400 text-sm">Get notified before tasks start</p>
                </div>
                <input
                  type="checkbox"
                  checked={onboardingData.preferences.notifications.taskReminders}
                  onChange={(e) => updateOnboardingData({
                    preferences: {
                      ...onboardingData.preferences,
                      notifications: {
                        ...onboardingData.preferences.notifications,
                        taskReminders: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-gray-400 focus:ring-gray-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                <div>
                  <p className="text-white font-medium">Day Start Reminder</p>
                  <p className="text-gray-400 text-sm">Daily reminder to start your day</p>
                </div>
                <input
                  type="checkbox"
                  checked={onboardingData.preferences.notifications.dayStart}
                  onChange={(e) => updateOnboardingData({
                    preferences: {
                      ...onboardingData.preferences,
                      notifications: {
                        ...onboardingData.preferences.notifications,
                        dayStart: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-gray-400 focus:ring-gray-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                <div>
                  <p className="text-white font-medium">Deadline Alerts</p>
                  <p className="text-gray-400 text-sm">Important deadline notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={onboardingData.preferences.notifications.deadlineAlerts}
                  onChange={(e) => updateOnboardingData({
                    preferences: {
                      ...onboardingData.preferences,
                      notifications: {
                        ...onboardingData.preferences.notifications,
                        deadlineAlerts: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-gray-400 focus:ring-gray-500"
                />
              </label>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-4">
            {themes.map((theme) => (
              <label
                key={theme.value}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                  onboardingData.preferences.theme === theme.value
                    ? 'border-gray-500 bg-gray-800'
                    : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <div>
                  <p className="text-white font-medium">{theme.label}</p>
                  <p className="text-gray-400 text-sm">{theme.description}</p>
                </div>
                <input
                  type="radio"
                  name="theme"
                  value={theme.value}
                  checked={onboardingData.preferences.theme === theme.value}
                  onChange={() => updateOnboardingData({
                    preferences: {
                      ...onboardingData.preferences,
                      theme: theme.value
                    }
                  })}
                  className="w-5 h-5 text-gray-400 focus:ring-gray-500"
                />
              </label>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-gray-300 to-transparent rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-gray-200 to-transparent rounded-full opacity-25 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  index <= currentStep ? 'bg-gradient-to-r from-gray-300 to-gray-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg flex items-center justify-center">
                {React.createElement(steps[currentStep].icon, { className: 'w-6 h-6 text-black' })}
              </div>
              <div>
                <CardTitle className="text-white">{steps[currentStep].title}</CardTitle>
                <p className="text-gray-400 text-sm">{steps[currentStep].description}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="min-h-[300px]">
              {renderStepContent()}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mt-4">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={isLastStep ? handleSubmit : handleNext}
                disabled={isLoading || (currentStep === 1 && !onboardingData.name.trim())}
                className="bg-gradient-to-r from-gray-300 to-gray-500 text-black hover:from-gray-400 hover:to-gray-600"
              >
                {isLoading ? 'Saving...' : isLastStep ? 'Complete Setup' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}