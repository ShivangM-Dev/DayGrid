import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://mock.supabase.co' && 
  supabaseAnonKey !== 'mock-anon-key'

export const supabase = isSupabaseConfigured 
  ? createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

export const createClient = () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using mock mode. Check your .env.local file.')
    return null
  }

  if (typeof window !== 'undefined') {
    // Client-side with auth persistence
    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } else {
    // Server-side - minimal config
    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  }
}