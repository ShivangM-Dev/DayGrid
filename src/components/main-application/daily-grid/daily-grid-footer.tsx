import React from "react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

interface DailyGridFooterProps {
  tasks: Task[];
  className?: string;
}

export function DailyGridFooter({ tasks, className }: DailyGridFooterProps) {
  return (
    <div className={cn(
      "border-t border-border/40 p-3 sm:p-4 bg-background",
      className
    )}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-card/50 to-card/30 border border-border/30 hover-lift">
          <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Total Tasks
          </div>
          <div className="text-lg sm:text-xl font-bold text-foreground">
            {tasks.length}
          </div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 hover-lift">
          <div className="font-semibold text-primary text-xs uppercase tracking-wide">
            Scheduled
          </div>
          <div className="text-lg sm:text-xl font-bold text-primary">
            {tasks.filter((t) => t.scheduledTime !== undefined).length}
          </div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 hover-lift">
          <div className="font-semibold text-green-400 text-xs uppercase tracking-wide">
            Completed
          </div>
          <div className="text-lg sm:text-xl font-bold text-green-400">
            {tasks.filter((t) => t.completed).length}
          </div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 hover-lift">
          <div className="font-semibold text-red-400 text-xs uppercase tracking-wide">
            Failed
          </div>
          <div className="text-lg sm:text-xl font-bold text-red-400">
            {tasks.filter((t) => t.failed).length}
          </div>
        </div>
      </div>
    </div>
  );
}