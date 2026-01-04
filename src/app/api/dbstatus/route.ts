import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/backend/server/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

interface DatabaseStatusResponse {
  isConnected: boolean
  lastChecked: string
  connectionTime: number
  error?: string
  details: {
    supabaseUrl: string
    isConfigured: boolean
    clientConfigured: boolean
    serverConfigured: boolean
    tablesExist: boolean
    userTable: boolean
    tasksTable: boolean
  }
}

async function checkDatabaseConnection(): Promise<DatabaseStatusResponse> {
  const startTime = Date.now()
  
  // Check if environment variables are configured
  const isConfigured = !!(supabaseUrl && supabaseServiceKey && 
    supabaseUrl !== 'https://mock.supabase.co' && 
    supabaseServiceKey !== 'mock-service-role-key')
  
  const clientConfigured = !!(supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'https://mock.supabase.co' &&
    supabaseAnonKey !== 'mock-anon-key')
  
  const serverConfigured = isConfigured

  const details = {
    supabaseUrl: isConfigured ? supabaseUrl : 'Not configured',
    isConfigured,
    clientConfigured,
    serverConfigured,
    tablesExist: false,
    userTable: false,
    tasksTable: false,
  }

  if (!isConfigured) {
    return {
      isConnected: false,
      lastChecked: new Date().toISOString(),
      connectionTime: Date.now() - startTime,
      error: 'Database not configured - missing or invalid environment variables',
      details
    }
  }

  try {
    // Test server connection
    let isConnected = false
    let tablesExist = false
    let userTable = false
    let tasksTable = false

    if (supabaseServer) {
      // Test basic connectivity by trying to access the database
      try {
        // First try a simple health check using the health endpoint
        const { error: healthError } = await supabaseServer
          .from('users')
          .select('count')
          .limit(0)
        
        // If we get any response (even a permission error), the connection works
        isConnected = !healthError || ['PGRST116', '42501'].includes(healthError.code || '')
      } catch (e) {
        // If the query fails completely, try an alternative approach
        try {
          const { error: rpcError } = await supabaseServer.rpc('version')
          isConnected = !rpcError
        } catch (e2) {
          isConnected = false
        }
      }

      if (isConnected) {
        try {
          // Check if tables exist
          const { data: tableInfo } = await supabaseServer.rpc('get_table_info') || {}
          
          // Try alternative approach to check tables
          try {
            const { data: usersData, error: usersError } = await supabaseServer
              .from('users')
              .select('id')
              .limit(1)
            
            userTable = !usersError
          } catch (e) {
            userTable = false
          }

          try {
            const { data: tasksData, error: tasksError } = await supabaseServer
              .from('tasks')
              .select('id')
              .limit(1)
            
            tasksTable = !tasksError
          } catch (e) {
            tasksTable = false
          }

          tablesExist = userTable || tasksTable
        } catch (e) {
          // If we can't check tables, assume they don't exist
          tablesExist = false
        }
      }
    }

    // If server connection fails, try client connection as fallback
    if (!isConnected && clientConfigured) {
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey)
        const { data, error } = await client
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(1)
        
        if (!error || error.code === 'PGRST116') {
          isConnected = true
        }
      } catch (e) {
        isConnected = false
      }
    }

    return {
      isConnected,
      lastChecked: new Date().toISOString(),
      connectionTime: Date.now() - startTime,
      details: {
        ...details,
        tablesExist,
        userTable,
        tasksTable,
      }
    }

  } catch (error) {
    return {
      isConnected: false,
      lastChecked: new Date().toISOString(),
      connectionTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Add some security - this is a hidden endpoint but let's add basic protection
    const userAgent = request.headers.get('user-agent') || ''
    
    // Allow access but log it for monitoring
    console.log(`Database status accessed from: ${request.headers.get('x-forwarded-for') || 'unknown'} at ${new Date().toISOString()}`)
    
    const status = await checkDatabaseConnection()
    
    return NextResponse.json(status, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    console.error('Error in dbstatus API:', error)
    
    return NextResponse.json({
      isConnected: false,
      lastChecked: new Date().toISOString(),
      connectionTime: 0,
      error: 'API error occurred',
      details: {
        supabaseUrl: 'Unknown',
        isConfigured: false,
        clientConfigured: false,
        serverConfigured: false,
        tablesExist: false,
        userTable: false,
        tasksTable: false,
      }
    }, { status: 500 })
  }
}

// Optional: Only allow GET requests
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}