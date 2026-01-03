import { DayStatus } from './task'

export interface Day {
  date: string; // YYYY-MM-DD
  status: DayStatus;
  startTime?: Date;
  endTime?: Date;
  totalTasks: number;
  completedTasks: number;
  productivity: number; // 0-100
}

export * from './task';