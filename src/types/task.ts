export enum TaskType {
  REGULAR = 'regular',
  MEETING = 'meeting',
  CLASS = 'class',
  APPOINTMENT = 'appointment',
  DEADLINE = 'deadline',
  COMMITMENT = 'commitment'
}

export interface Task {
  id: string;
  title: string;
  priority: number; // 1-10 scale
  duration: number; // in hours
  type: TaskType;
  scheduledTime?: number; // hour of day (0-23)
  completed: boolean;
  failed: boolean;
  abandoned: boolean;
  isLocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskLog {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'completed' | 'failed' | 'abandoned' | 'scheduled' | 'rescheduled';
  timestamp: Date;
  previousState?: Partial<Task>;
  newState?: Partial<Task>;
  hash: string;
}

export enum DayStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export interface DayState {
  date: string; // YYYY-MM-DD
  status: DayStatus;
  startTime?: Date;
  tasks: Task[];
  immutableLog: TaskLog[];
  hasHighPriorityTask: boolean;
  highPriorityTaskId?: string;
}



