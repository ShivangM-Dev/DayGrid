import { createClient } from '@supabase/supabase-js'

export interface DatabaseStatus {
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

export class DatabaseStatusChecker {
  private supabaseUrl: string
  private supabaseServiceKey: string
  private supabaseAnonKey: string

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    this.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }

  async checkDatabaseConnection(): Promise<DatabaseStatus> {
    const startTime = Date.now()
    
    // Check if environment variables are configured
    const isConfigured = !!(this.supabaseUrl && this.supabaseServiceKey && 
      this.supabaseUrl !== 'https://mock.supabase.co' && 
      this.supabaseServiceKey !== 'mock-service-role-key')
    
    const clientConfigured = !!(this.supabaseUrl && this.supabaseAnonKey &&
      this.supabaseUrl !== 'https://mock.supabase.co' &&
      this.supabaseAnonKey !== 'mock-anon-key')
    
    const serverConfigured = isConfigured

    const details = {
      supabaseUrl: isConfigured ? this.supabaseUrl : 'Not configured',
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

      const supabaseClient = createClient(this.supabaseUrl, this.supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })

      // Test basic connectivity
      try {
        const { error: healthError } = await supabaseClient
          .from('users')
          .select('count')
          .limit(0)
        
        isConnected = !healthError || ['PGRST116', '42501'].includes(healthError.code || '')
      } catch (e) {
        try {
          const { error: rpcError } = await supabaseClient.rpc('version')
          isConnected = !rpcError
        } catch (e2) {
          isConnected = false
        }
      }

      if (isConnected) {
        try {
          // Check if tables exist
          try {
            const { error: usersError } = await supabaseClient
              .from('users')
              .select('id')
              .limit(1)
            
            userTable = !usersError
          } catch (e) {
            userTable = false
          }

          try {
            const { error: tasksError } = await supabaseClient
              .from('tasks')
              .select('id')
              .limit(1)
            
            tasksTable = !tasksError
          } catch (e) {
            tasksTable = false
          }

          tablesExist = userTable || tasksTable
        } catch (e) {
          tablesExist = false
        }
      }

      // If server connection fails, try client connection as fallback
      if (!isConnected && clientConfigured) {
        try {
          const client = createClient(this.supabaseUrl, this.supabaseAnonKey)
          const { error } = await client
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
}