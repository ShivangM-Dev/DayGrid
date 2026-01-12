import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import * as z from 'zod'

const approvalSchema = z.object({
  waitlistId: z.string().uuid('Invalid waitlist ID'),
})

// Create Supabase Admin client with service role key
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables:', {
      supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
      supabaseServiceKey: supabaseServiceKey ? 'Set' : 'Missing'
    })
    throw new Error('Missing Supabase environment variables')
  }

  if (supabaseServiceKey === 'mock-service-role-key' || supabaseUrl === 'https://mock.supabase.co') {
    throw new Error('Using mock Supabase credentials - please configure real credentials in .env.local')
  }

  // Create admin client with service role key for elevated privileges
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function createSupabaseUser(email: string, name: string) {
  try {
    const adminClient = createAdminClient()

    // Generate a random password for the user
    const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

    console.log('Creating user with email:', email)

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        source: 'waitlist_approval',
      },
    })

    if (authError) {
      console.error('Error creating Supabase user:', {
        error: authError,
        message: authError.message,
        status: authError.status,
        code: authError.code
      })
      
      // More specific error handling
      if (authError.message?.includes('Bearer token') || authError.code === 'no_authorization') {
        throw new Error('Invalid service role key. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.')
      }
      
      throw new Error(`Failed to create Supabase user: ${authError.message}`)
    }

    console.log('User created successfully:', authData.user?.id)
    return { user: authData.user, password }
  } catch (error) {
    console.error('createSupabaseUser error:', error)
    throw error
  }
}

async function createUserRecord(userId: string, email: string, name: string) {
  const supabase = supabaseServer

  if (!supabase) {
    throw new Error('Database connection not configured')
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email,
        name,
        timezone: 'UTC',
        preferences: {
          working_hours: { start: 9, end: 17 },
          default_task_duration: 60,
          notifications: {
            task_reminders: true,
            day_start: true,
            deadline_alerts: true,
          },
          theme: 'system',
        },
      },
    ])
    .select()
    .single()

  if (userError) {
    console.error('Error creating user record:', userError)
    throw new Error(`Failed to create user record: ${userError.message}`)
  }

  return userData
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = approvalSchema.parse(body)

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

    // Create Supabase Auth user and user record
    const { user: authUser, password } = await createSupabaseUser(
      waitlistEntry.email,
      waitlistEntry.name
    )

    await createUserRecord(authUser.id, waitlistEntry.email, waitlistEntry.name)

    // Update waitlist entry status
    const { data: updatedEntry, error: updateError } = await supabase
      .from('waitlist')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.waitlistId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating waitlist entry:', updateError)
      return NextResponse.json(
        { error: 'Failed to update waitlist entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User approved and created successfully',
      data: {
        userId: authUser.id,
        email: waitlistEntry.email,
        name: waitlistEntry.name,
        tempPassword: password,
      },
    })

  } catch (error) {
    console.error('User approval API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}