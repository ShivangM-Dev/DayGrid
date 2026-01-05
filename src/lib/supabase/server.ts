import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseServiceKey && 
  supabaseUrl !== 'https://mock.supabase.co' && 
  supabaseServiceKey !== 'mock-service-role-key'

export const supabaseServer = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

// Alternative: For cookie-based server auth (if needed in the future)
export async function createSupabaseServer() {
  if (!isSupabaseConfigured) return null
  
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  })
}