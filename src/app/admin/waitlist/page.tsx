'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/shared/ui/button'
import { Card } from '@/components/shared/ui/card'
import { Users, Mail, Calendar, CheckCircle, Clock, Database, Server, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

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

interface WaitlistEntry {
  id: string
  name: string
  email: string
  referral_source: string | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export default function WaitlistAdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'waitlist' | 'dbstatus'>('waitlist')
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [dbLoading, setDbLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchWaitlist()
    fetchDatabaseStatus()
  }, [])

  const fetchDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/dbstatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setDbStatus(data)
      } else {
        setDbStatus({
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
      setDbStatus({
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
      setDbLoading(false)
      setRefreshing(false)
    }
  }

  const handleDbRefresh = () => {
    setRefreshing(true)
    fetchDatabaseStatus()
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

  const fetchWaitlist = async () => {
    try {
      const response = await fetch('/api/waitlist')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch waitlist')
      }

      setEntries(result.data || [])
      setTotalCount(result.totalCount || 0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const approveUser = async (id: string) => {
    try {
      const response = await fetch('/api/waitlist/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waitlistId: id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to approve user')
      }

      const result = await response.json()
      
      // Show the temporary password to the admin
      if (result.data?.tempPassword) {
        alert(`User approved successfully!\n\nEmail: ${result.data.email}\nTemporary Password: ${result.data.tempPassword}\n\nPlease save this password securely and share it with the user.`)
      }

      fetchWaitlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve user')
    }
  }

  const rejectUser = async (id: string) => {
    try {
      const response = await fetch('/api/waitlist/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waitlistId: id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reject user')
      }

      fetchWaitlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject user')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading waitlist...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage waitlist and database status</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`pb-4 px-2 font-light transition-colors ${
              activeTab === 'waitlist'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Waitlist
          </button>
          <button
            onClick={() => setActiveTab('dbstatus')}
            className={`pb-4 px-2 font-light transition-colors ${
              activeTab === 'dbstatus'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Database Status
          </button>
        </div>

        {activeTab === 'dbstatus' ? (
          /* Database Status Tab */
          dbLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-400">Checking database status...</p>
              </div>
            </div>
          ) : dbStatus ? (
            <div className="space-y-8">
              {/* Overall Status Card */}
              <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-2xl border-gray-700/50 shadow-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-light flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        dbStatus.isConnected 
                          ? 'bg-emerald-500/20 border border-emerald-500/30' 
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}>
                        <Database className={`w-7 h-7 ${
                          dbStatus.isConnected ? 'text-emerald-400' : 'text-red-400'
                        }`} />
                      </div>
                      Overall Status
                    </h2>
                    <button
                      onClick={handleDbRefresh}
                      disabled={refreshing}
                      className="flex items-center gap-3 px-6 py-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-blue-500/20"
                    >
                      <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                      <span className="font-light">Refresh</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex items-center gap-6">
                      <div className={`relative ${
                        dbStatus.isConnected ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        <CheckCircle className="w-16 h-16" />
                        {!dbStatus.isConnected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <XCircle className="w-16 h-16" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-3xl font-light mb-2">
                          {dbStatus.isConnected ? 'Connected' : 'Disconnected'}
                        </p>
                        <p className="text-gray-400 mb-1">
                          Last checked: {dbStatus.lastChecked.toLocaleString()}
                        </p>
                        {dbStatus.connectionTime > 0 && (
                          <p className="text-gray-400">
                            Response time: {dbStatus.connectionTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {dbStatus.error && (
                      <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                        <span className="text-red-400 font-light">{dbStatus.error}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Configuration and Tables Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Details */}
                <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-2xl border-gray-700/50 shadow-2xl">
                  <div className="p-6">
                    <h3 className="text-xl font-light flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Server className="w-5 h-5 text-blue-400" />
                      </div>
                      Configuration Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-700/30 hover:border-gray-600/40 transition-colors">
                        <span className="font-light text-gray-300">Supabase URL</span>
                        <span className="text-gray-400 font-mono text-sm bg-black/40 px-3 py-1 rounded-lg">
                          {dbStatus.details.supabaseUrl}
                        </span>
                      </div>
                      
                      {[
                        { label: 'Database Configured', value: dbStatus.details.isConfigured },
                        { label: 'Client Configured', value: dbStatus.details.clientConfigured },
                        { label: 'Server Configured', value: dbStatus.details.serverConfigured },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-700/30 hover:border-gray-600/40 transition-colors">
                          <span className="font-light text-gray-300">{item.label}</span>
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.value)}
                            <span className={`font-light ${getStatusColor(item.value)}`}>
                              {item.value ? 'Configured' : 'Not Configured'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Database Tables */}
                <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-2xl border-gray-700/50 shadow-2xl">
                  <div className="p-6">
                    <h3 className="text-xl font-light flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Database className="w-5 h-5 text-purple-400" />
                      </div>
                      Database Tables
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Tables Exist', value: dbStatus.details.tablesExist, successText: 'Found', failText: 'Missing' },
                        { label: 'Users Table', value: dbStatus.details.userTable, successText: 'Exists', failText: 'Missing' },
                        { label: 'Tasks Table', value: dbStatus.details.tasksTable, successText: 'Exists', failText: 'Missing' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-700/30 hover:border-gray-600/40 transition-colors">
                          <span className="font-light text-gray-300">{item.label}</span>
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.value)}
                            <span className={`font-light ${getStatusColor(item.value)}`}>
                              {item.value ? item.successText : item.failText}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-xl bg-gray-800/50 flex items-center justify-center border border-gray-700/50">
                <Database className="w-12 h-12 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-light">Failed to load database status</p>
            </div>
          )
        ) : (
          <>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-2xl border-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sign-ups</p>
                <p className="text-3xl font-light">{totalCount}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-2xl border-emerald-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm">Pending</p>
                <p className="text-3xl font-light">{entries.filter(e => e.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-emerald-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-2xl border-blue-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm">Accepted</p>
                <p className="text-3xl font-light">{entries.filter(e => e.status === 'accepted').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-2xl border-gray-800/50">
          <div className="p-6">
            <h2 className="text-xl font-light mb-6">Waitlist Entries</h2>
            
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No entries in waitlist</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-black/40 rounded-xl p-4 border border-gray-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-medium text-white">{entry.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Mail className="w-4 h-4" />
                              {entry.email}
                            </div>
                          </div>
                          {entry.referral_source && (
                            <div className="text-sm text-gray-500">
                              Source: {entry.referral_source}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : entry.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {entry.status}
                        </span>
                        
                        {entry.status === 'pending' && (
                          <div className="flex gap-2">
                             <Button
                               size="sm"
                               onClick={() => approveUser(entry.id)}
                               className="bg-emerald-500 hover:bg-emerald-600 text-white"
                             >
                               Approve
                             </Button>
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => rejectUser(entry.id)}
                               className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                             >
                               Reject
                             </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
          </>
        )}
      </div>
    </div>
  )
}