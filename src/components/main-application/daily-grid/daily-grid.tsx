"use client";

import React from "react";
import { Task } from "@/types";
import { useTasks } from "@/hooks/use-tasks";
import { useDayState } from "@/hooks/use-day-state";
import { TimeSlot } from "./time-slot";

import { BusinessHoursSettings } from "@/components/settings/business-hours-settings";
import { BusinessHoursService } from "@/lib/business-hours";
import { cn } from "@/lib/utils";

interface DailyGridProps {
  date: string;
  tasks?: Task[];
  className?: string;
}

export function DailyGrid({ date, tasks = [], className }: DailyGridProps) {
  const { scheduleTask, clearGrid } = useTasks();
  const { canModifySchedule, addTaskLog } = useDayState();
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const [businessHoursUpdated, setBusinessHoursUpdated] = React.useState(0);

  const handleBusinessHoursUpdate = () => {
    setBusinessHoursUpdated(prev => prev + 1);
  };
  const gridRef = React.useRef<HTMLDivElement>(null);

  const handleTaskDrop = (taskId: string, timeSlot: number) => {
    scheduleTask(taskId, timeSlot);
  };

  const handleClearGrid = () => {
    const scheduledTasks = tasks.filter(
      (task) => task.scheduledTime !== undefined
    );
    scheduledTasks.forEach((task) => {
      addTaskLog({
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        taskId: task.id,
        action: "grid_cleared",
        timestamp: new Date(),
        previousState: { scheduledTime: task.scheduledTime },
        newState: { scheduledTime: undefined },
        hash: `${Date.now()}_${task.id}_grid_cleared`,
      });
    });

    clearGrid();
    setShowClearConfirm(false);
  };

  const timeSlots = Array.from({ length: 96 }, (_, i) => i * 0.25);

  const getScheduledTasksForTimeSlot = (timeSlot: number) => {
    return tasks.filter((task) => {
      if (task.scheduledTime === undefined) return false;
      const taskEnd = task.scheduledTime + task.duration;
      return task.scheduledTime <= timeSlot && taskEnd > timeSlot;
    });
  };

  const isOverlappingTask = (timeSlot: number, task: Task) => {
    if (task.scheduledTime === undefined) return false;
    const taskEnd = task.scheduledTime + task.duration;
    return timeSlot >= task.scheduledTime && timeSlot < taskEnd;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getFullDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const scheduledTasksCount = tasks.filter((t) => t.scheduledTime !== undefined).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-background/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {formatDate(date)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {getFullDate(date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 px-4 py-2 bg-card rounded-lg border border-border shadow-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{tasks.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{scheduledTasksCount}</div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">{completedTasksCount}</div>
                <div className="text-xs text-muted-foreground">Done</div>
              </div>
            </div>
            
            <div className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
              canModifySchedule()
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-muted border-border text-muted-foreground"
            )}>
              {canModifySchedule() ? "📋 Planning" : "🔒 Active"}
            </div>

            <BusinessHoursSettings 
              onSave={handleBusinessHoursUpdate}
              className="ml-2"
            />
            {canModifySchedule() && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              >
                Clear Schedule
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Priority Legend */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Priority Levels
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/20 hover:scrollbar-thumb-border/40" ref={gridRef}>
        <div className="divide-y divide-border/5">
          {timeSlots.map((timeSlot) => {
            const timeSlotTasks = getScheduledTasksForTimeSlot(timeSlot);
            const hasMultiSlotTask = tasks.some(
              (task) =>
                isOverlappingTask(timeSlot, task) &&
                task.duration > 0.25 &&
                task.scheduledTime !== timeSlot
            );

            return (
              <div 
                key={timeSlot} 
                className={cn(
                  "relative group transition-colors"
                )}
              >
                {hasMultiSlotTask && (
                  <div className="absolute inset-0 bg-muted/10"></div>
                )}

                <TimeSlot
                  hour={timeSlot}
                  tasks={timeSlotTasks}
                  onTaskDrop={
                    canModifySchedule() ? handleTaskDrop : undefined
                  }
                  className={cn(
                    hasMultiSlotTask ? "relative z-10" : "",
                    "group-hover:bg-accent/5"
                  )}
                />
              </div>
            );
          })}
        </div>


      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border/20 rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Clear Schedule?</h3>
            <p className="text-muted-foreground mb-4">
              This will remove all scheduled tasks from today's grid. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm border border-border/30 rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearGrid}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}