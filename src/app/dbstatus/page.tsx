'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Server, Clock } from 'lucide-react'

interface DatabaseStatus {
  isConnected: boolean
  lastChecked: Date
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

export default function DbStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/dbstatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      } else {
        setStatus({
          isConnected: false,
          lastChecked: new Date(),
          connectionTime: 0,
          error: 'Failed to fetch database status',
          details: {
            supabaseUrl: 'Unknown',
            isConfigured: false,
            clientConfigured: false,
            serverConfigured: false,
            tablesExist: false,
            userTable: false,
            tasksTable: false,
          }
        })
      }
    } catch (error) {
      setStatus({
        isConnected: false,
        lastChecked: new Date(),
        connectionTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: {
          supabaseUrl: 'Unknown',
          isConfigured: false,
          clientConfigured: false,
          serverConfigured: false,
          tablesExist: false,
          userTable: false,
          tasksTable: false,
        }
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    checkDatabaseStatus()
  }

  const getStatusIcon = (isGood: boolean) => {
    return isGood ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  const getStatusColor = (isGood: boolean) => {
    return isGood ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking database status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Status</h1>
            <p className="text-gray-600 mt-2">Connection status and diagnostics for DayGrid database</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {status && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-6 h-6" />
                  Overall Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {status.isConnected ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                    <div>
                      <p className="text-xl font-semibold">
                        {status.isConnected ? 'Connected' : 'Disconnected'}
                      </p>
                      <p className="text-gray-600">
                        Last checked: {status.lastChecked.toLocaleString()}
                      </p>
                      {status.connectionTime > 0 && (
                        <p className="text-gray-600">
                          Connection time: {status.connectionTime}ms
                        </p>
                      )}
                    </div>
                  </div>
                  {status.error && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{status.error}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Configuration Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Server className="w-6 h-6" />
                  Configuration Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Supabase URL</span>
                    <span className="text-gray-600 font-mono text-sm">
                      {status.details.supabaseUrl}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Database Configured</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.isConfigured)}
                      <span className={getStatusColor(status.details.isConfigured)}>
                        {status.details.isConfigured ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Client Configured</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.clientConfigured)}
                      <span className={getStatusColor(status.details.clientConfigured)}>
                        {status.details.clientConfigured ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Server Configured</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.serverConfigured)}
                      <span className={getStatusColor(status.details.serverConfigured)}>
                        {status.details.serverConfigured ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Tables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-6 h-6" />
                  Database Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tables Exist</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.tablesExist)}
                      <span className={getStatusColor(status.details.tablesExist)}>
                        {status.details.tablesExist ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Users Table</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.userTable)}
                      <span className={getStatusColor(status.details.userTable)}>
                        {status.details.userTable ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tasks Table</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.tasksTable)}
                      <span className={getStatusColor(status.details.tasksTable)}>
                        {status.details.tasksTable ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  Environment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className="font-medium">{process.env.NODE_ENV || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="font-medium">{new Date().toISOString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Page:</span>
                    <span className="font-medium">Operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}