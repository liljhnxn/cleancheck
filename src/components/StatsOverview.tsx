"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { CLEAN_CHECK_ADDRESS, CLEAN_CHECK_ABI } from "@/lib/contract";
import { CheckCircle2, ListTodo, Activity } from "lucide-react";

export function StatsOverview() {
  const { data: totalCompletions, isLoading } = useReadContract({
    address: CLEAN_CHECK_ADDRESS,
    abi: CLEAN_CHECK_ABI,
    functionName: "getTotalCompletions",
    query: {
      refetchInterval: 5000,
    },
  });

  const formattedTotal =
    totalCompletions !== undefined ? totalCompletions.toString() : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {/* Card 1: Total Completions */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition-all hover:border-accent/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mutedText uppercase tracking-wider">
            Total Completions
          </span>
          <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent/20 flex items-center justify-center text-accent">
            <Activity className="w-4 h-4 text-accent" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-8 w-16 bg-[#282C36] animate-pulse rounded" />
          ) : (
            <span className="text-3xl font-extrabold text-mainText tracking-tight font-mono">
              {formattedTotal}
            </span>
          )}
          <span className="text-xs text-mutedText">recorded on-chain</span>
        </div>
      </div>

      {/* Card 2: Tasks Available */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition-all hover:border-accent/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mutedText uppercase tracking-wider">
            Tasks Available
          </span>
          <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent/20 flex items-center justify-center text-accent">
            <ListTodo className="w-4 h-4 text-accent" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-mainText tracking-tight font-mono">
            3
          </span>
          <span className="text-xs text-mutedText">daily checklists</span>
        </div>
      </div>
    </div>
  );
}
