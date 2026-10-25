"use client";

import React, { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { botchainTestnet } from "@/lib/chain";
import { CLEAN_CHECK_ADDRESS, CLEANING_TASKS } from "@/lib/contract";
import { History, Clock, CheckCircle2, RefreshCw } from "lucide-react";

interface ActivityItem {
  id: string;
  user: string;
  taskTitle: string;
  day: string;
  timestamp?: number;
  txHash?: string;
}

export function RecentActivity({ refreshTrigger }: { refreshTrigger?: number }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [rpcLimited, setRpcLimited] = useState(false);

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getTaskNameById = (taskId: number) => {
    const found = CLEANING_TASKS.find((t) => t.id === taskId);
    return found ? found.title : `Task #${taskId}`;
  };

  const fetchEvents = async () => {
    if (!CLEAN_CHECK_ADDRESS) return;
    setLoading(true);
    setRpcLimited(false);

    try {
      const client = createPublicClient({
        chain: botchainTestnet,
        transport: http(
          process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life"
        ),
      });

      const currentBlock = await client.getBlockNumber();
      const fromBlock = currentBlock > 5000n ? currentBlock - 5000n : 0n;

      const logs = await client.getLogs({
        address: CLEAN_CHECK_ADDRESS,
        event: parseAbiItem(
          "event TaskCompleted(address indexed user, uint256 indexed taskId, uint256 day, uint256 timestamp)"
        ),
        fromBlock,
        toBlock: currentBlock,
      });

      const parsed: ActivityItem[] = logs
        .map((log) => {
          const user = (log.args as any)?.user || "";
          const taskId = Number((log.args as any)?.taskId || 0);
          const day = (log.args as any)?.day?.toString() || "";
          const timestamp = Number((log.args as any)?.timestamp || 0);

          return {
            id: `${log.transactionHash}-${log.logIndex}`,
            user,
            taskTitle: getTaskNameById(taskId),
            day: `Day #${day}`,
            timestamp: timestamp > 0 ? timestamp * 1000 : undefined,
            txHash: log.transactionHash,
          };
        })
        .reverse();

      setActivities(parsed.slice(0, 5));
    } catch (err: any) {
      console.warn("RPC event retrieval note:", err?.message);
      setRpcLimited(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-mainText">Recent Activity</h2>
        </div>
        <button
          onClick={fetchEvents}
          disabled={loading}
          className="text-xs text-mutedText hover:text-mainText flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {!CLEAN_CHECK_ADDRESS ? (
        <div className="text-center py-6 text-xs text-mutedText border border-dashed border-border/60 rounded-xl">
          Connect your deployed contract address to view live on-chain activity logs.
        </div>
      ) : loading && activities.length === 0 ? (
        <div className="text-center py-6 text-xs text-mutedText">
          Scanning recent blocks on Botchain Testnet...
        </div>
      ) : activities.length > 0 ? (
        <div className="divide-y divide-border/60">
          {activities.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <div>
                  <span className="font-semibold text-mainText">
                    {item.taskTitle}
                  </span>
                  <span className="text-mutedText mx-1.5">•</span>
                  <span className="font-mono text-mutedText">
                    {shortenAddress(item.user)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-mutedText">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : item.day}
                </span>

                {item.txHash && (
                  <a
                    href={`https://scan.bohr.life/tx/${item.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline font-mono"
                  >
                    View Tx
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-mutedText border border-dashed border-border/60 rounded-xl">
          {rpcLimited
            ? "RPC event indexing is limited on this public testnet endpoint. Completed tasks will reflect live in your counters and task cards."
            : "No task completions found in recent blocks. Mark a task above to record the first entry!"}
        </div>
      )}
    </div>
  );
}
