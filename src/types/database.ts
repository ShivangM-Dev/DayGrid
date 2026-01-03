export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          timezone: string
          preferences: {
            working_hours: {
              start: number
              end: number
            }
            default_task_duration: number
            notifications: {
              task_reminders: boolean
              day_start: boolean
              deadline_alerts: boolean
            }
            theme: 'light' | 'dark' | 'system'
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          timezone?: string
          preferences?: {
            working_hours?: {
              start?: number
              end?: number
            }
            default_task_duration?: number
            notifications?: {
              task_reminders?: boolean
              day_start?: boolean
              deadline_alerts?: boolean
            }
            theme?: 'light' | 'dark' | 'system'
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          timezone?: string
          preferences?: {
            working_hours?: {
              start?: number
              end?: number
            }
            default_task_duration?: number
            notifications?: {
              task_reminders?: boolean
              day_start?: boolean
              deadline_alerts?: boolean
            }
            theme?: 'light' | 'dark' | 'system'
          }
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          priority: number
          duration: number
          type: 'regular' | 'meeting' | 'class' | 'appointment' | 'deadline' | 'commitment'
          scheduled_time: number | null
          completed: boolean
          failed: boolean
          abandoned: boolean
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          priority: number
          duration: number
          type: 'regular' | 'meeting' | 'class' | 'appointment' | 'deadline' | 'commitment'
          scheduled_time?: number | null
          completed?: boolean
          failed?: boolean
          abandoned?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          priority?: number
          duration?: number
          type?: 'regular' | 'meeting' | 'class' | 'appointment' | 'deadline' | 'commitment'
          scheduled_time?: number | null
          completed?: boolean
          failed?: boolean
          abandoned?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      days: {
        Row: {
          id: string
          user_id: string
          date: string
          status: 'planning' | 'active' | 'completed'
          start_time: string | null
          end_time: string | null
          has_high_priority_task: boolean
          high_priority_task_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          status: 'planning' | 'active' | 'completed'
          start_time?: string | null
          end_time?: string | null
          has_high_priority_task?: boolean
          high_priority_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          status?: 'planning' | 'active' | 'completed'
          start_time?: string | null
          end_time?: string | null
          has_high_priority_task?: boolean
          high_priority_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_logs: {
        Row: {
          id: string
          day_id: string
          task_id: string
          action: 'created' | 'updated' | 'completed' | 'failed' | 'abandoned' | 'scheduled' | 'rescheduled'
          timestamp: string
          previous_state: {
            [key: string]: any
          } | null
          new_state: {
            [key: string]: any
          } | null
          hash: string
          created_at: string
        }
        Insert: {
          id?: string
          day_id: string
          task_id: string
          action: 'created' | 'updated' | 'completed' | 'failed' | 'abandoned' | 'scheduled' | 'rescheduled'
          timestamp: string
          previous_state?: {
            [key: string]: any
          } | null
          new_state?: {
            [key: string]: any
          } | null
          hash: string
          created_at?: string
        }
        Update: {
          id?: string
          day_id?: string
          task_id?: string
          action?: 'created' | 'updated' | 'completed' | 'failed' | 'abandoned' | 'scheduled' | 'rescheduled'
          timestamp?: string
          previous_state?: {
            [key: string]: any
          } | null
          new_state?: {
            [key: string]: any
          } | null
          hash?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}