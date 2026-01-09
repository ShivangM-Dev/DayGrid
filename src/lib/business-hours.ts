export interface BusinessHoursConfig {
  startTime: number; // 0-23 (24-hour format)
  endTime: number;   // 0-23 (24-hour format)
  weekdaysEnabled: boolean;
  weekendEnabled: boolean;
}

export const DEFAULT_BUSINESS_HOURS: BusinessHoursConfig = {
  startTime: 6,  // 6:00 AM
  endTime: 22,    // 10:00 PM
  weekdaysEnabled: true,
  weekendEnabled: false
};

export class BusinessHoursService {
  private static STORAGE_KEY = 'daygrid-business-hours';
  
  static getBusinessHours(): BusinessHoursConfig {
    if (typeof window === 'undefined') return DEFAULT_BUSINESS_HOURS;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_BUSINESS_HOURS, ...parsed };
      }
    } catch (error) {
      console.error('Error loading business hours:', error);
    }
    
    return DEFAULT_BUSINESS_HOURS;
  }
  
  static saveBusinessHours(config: BusinessHoursConfig): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving business hours:', error);
    }
  }
  
  static isBusinessHour(timeSlot: number, date: Date): boolean {
    const config = this.getBusinessHours();
    const hour = Math.floor(timeSlot);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    
    // Check if business hours are enabled for this day type
    const enabledForDay = isWeekend ? config.weekendEnabled : config.weekdaysEnabled;
    if (!enabledForDay) return false;
    
    // Check if time is within business hours
    return hour >= config.startTime && hour < config.endTime;
  }
  
  static resetToDefault(): void {
    this.saveBusinessHours(DEFAULT_BUSINESS_HOURS);
  }
}