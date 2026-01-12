import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import * as z from 'zod'

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  referralSource: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)

    const supabase = supabaseServer

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          referral_source: validatedData.referralSource || null,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error inserting waitlist entry:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined waitlist',
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Waitlist API error:', error)
    
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

export async function GET() {
  try {
    const supabase = supabaseServer

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('waitlist')
      .select('id, name, email, referral_source, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error fetching waitlist:', error)
      return NextResponse.json(
        { error: 'Failed to fetch waitlist' },
        { status: 500 }
      )
    }

    const totalCount = data?.length || 0

    return NextResponse.json({
      success: true,
      data: data || [],
      totalCount,
    })

  } catch (error) {
    console.error('Waitlist GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const supabase = supabaseServer
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('waitlist')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error updating waitlist entry:', error)
      return NextResponse.json(
        { error: 'Failed to update entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Entry ${status} successfully`,
      data,
    })

  } catch (error) {
    console.error('Waitlist PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}