export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  timezone: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  workingHours: {
    start: number; // 0-23
    end: number; // 0-23
  };
  defaultTaskDuration: number; // in hours
  notifications: {
    taskReminders: boolean;
    dayStart: boolean;
    deadlineAlerts: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}