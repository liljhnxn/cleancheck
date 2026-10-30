"use client";

import React from "react";
import { CLEANING_TASKS } from "@/lib/contract";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  onRefreshAll?: () => void;
}

export function TaskList({ onRefreshAll }: TaskListProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-mainText">Daily Cleaning Tasks</h2>
          <p className="text-xs text-mutedText">
            Select a task to record cleaning progress directly on Botchain Mainnet
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CLEANING_TASKS.map((task) => (
          <TaskCard key={task.id} task={task} onRefreshAll={onRefreshAll} />
        ))}
      </div>
    </div>
  );
}
