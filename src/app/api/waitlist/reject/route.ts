import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import * as z from 'zod'

const rejectSchema = z.object({
  waitlistId: z.string().uuid('Invalid waitlist ID'),
  reason: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = rejectSchema.parse(body)

    const supabase = supabaseServer

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Get waitlist entry
    const { data: waitlistEntry, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('id', validatedData.waitlistId)
      .single()

    if (waitlistError || !waitlistEntry) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      )
    }

    if (waitlistEntry.status !== 'pending') {
      return NextResponse.json(
        { error: 'Entry has already been processed' },
        { status: 400 }
      )
    }

    // Update waitlist entry status to rejected
    const { data: updatedEntry, error: updateError } = await supabase
      .from('waitlist')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.waitlistId)
      .select()
      .single()

    if (updateError) {
      console.error('Error rejecting waitlist entry:', updateError)
      return NextResponse.json(
        { error: 'Failed to reject waitlist entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Waitlist entry rejected successfully',
      data: {
        id: updatedEntry.id,
        email: updatedEntry.email,
        name: updatedEntry.name,
        status: updatedEntry.status,
        reason: validatedData.reason,
      },
    })

  } catch (error) {
    console.error('Waitlist rejection API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}