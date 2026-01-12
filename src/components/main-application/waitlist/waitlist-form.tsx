'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/shared/ui/button'
import { Input } from '@/components/shared/ui/input'
import { Label } from '@/components/shared/ui/label'
import { ChevronRight } from 'lucide-react'

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
})

type WaitlistFormData = z.infer<typeof waitlistSchema>

interface WaitlistFormProps {
  onSubmit: (data: WaitlistFormData) => Promise<void>
  isLoading?: boolean
}

export function WaitlistForm({ onSubmit, isLoading = false }: WaitlistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  return (
    <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-2xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-10">
          <div className="space-y-10">
            <Label htmlFor="name" className="text-gray-300 text-xl  space-y-10  font-light tracking-wide">
              Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              className={`bg-black/40 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-0 backdrop-blur-sm h-11 px-4 rounded-xl font-light transition-all duration-300 ${
                errors.name ? 'border-red-500/50 focus:border-red-500/50' : ''
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-400 text-xs font-light mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-xl font-light tracking-wide">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`bg-black/40 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-0 backdrop-blur-sm h-11 px-4 rounded-xl font-light transition-all duration-300 ${
                errors.email ? 'border-red-500/50 focus:border-red-500/50' : ''
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs font-light mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200 text-black font-light tracking-wide rounded-2xl py-3 transition-all duration-300 group"
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? 'Processing...' : 'Request Early Access'}
            {!isLoading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
          </span>
        </Button>
      </form>
    </div>
  )
}