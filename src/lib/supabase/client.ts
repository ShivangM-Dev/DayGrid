import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

export const createClient = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  } else {
    // Server-side - return mock client for now
    return null
  }
}