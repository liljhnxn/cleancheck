"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  CLEAN_CHECK_ADDRESS,
  CLEAN_CHECK_ABI,
  TaskDefinition,
} from "@/lib/contract";
import { botchain } from "@/lib/chain";
import {
  Armchair,
  Briefcase,
  Trash2,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

interface TaskCardProps {
  task: TaskDefinition;
  onRefreshAll?: () => void;
}

export function TaskCard({ task, onRefreshAll }: TaskCardProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectChain = chainId === botchain.id;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  // 1. Read task completion count
  const {
    data: completionCount,
    refetch: refetchCount,
    isLoading: isLoadingCount,
  } = useReadContract({
    address: CLEAN_CHECK_ADDRESS,
    abi: CLEAN_CHECK_ABI,
    functionName: "getTaskCompletionCount",
    args: [BigInt(task.id)],
    query: {
      refetchInterval: 6000,
    },
  });

  // 2. Read whether user has completed this task today
  const {
    data: hasCompletedToday,
    refetch: refetchCompleted,
    isLoading: isLoadingCompleted,
  } = useReadContract({
    address: CLEAN_CHECK_ADDRESS,
    abi: CLEAN_CHECK_ABI,
    functionName: "hasCompletedToday",
    args: address ? [address, BigInt(task.id)] : undefined,
    query: {
      enabled: Boolean(isConnected && address && CLEAN_CHECK_ADDRESS),
      refetchInterval: 6000,
    },
  });

  // 3. Write contract hook
  const {
    data: txHash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // 4. Wait for transaction receipt confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle post-confirmation state updates
  useEffect(() => {
    if (isConfirmed && txHash) {
      setSuccessTxHash(txHash);
      setErrorMessage(null);
      refetchCount();
      refetchCompleted();
      if (onRefreshAll) onRefreshAll();
      resetWrite();
    }
  }, [isConfirmed, txHash, refetchCount, refetchCompleted, onRefreshAll, resetWrite]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      const msg = writeError.message.toLowerCase();
      if (msg.includes("user rejected") || msg.includes("denied")) {
        setErrorMessage("Transaction was cancelled by the user.");
      } else if (msg.includes("taskalreadycompletedtoday")) {
        setErrorMessage("This task has already been completed today.");
      } else if (msg.includes("insufficient funds")) {
        setErrorMessage("Insufficient BOT tokens for gas fees.");
      } else {
        setErrorMessage(
          writeError.message.slice(0, 140) || "Failed to submit transaction."
        );
      }
    }
  }, [writeError]);

  // Handle confirm errors
  useEffect(() => {
    if (confirmError) {
      setErrorMessage(
        confirmError.message.slice(0, 140) || "Transaction failed on-chain."
      );
    }
  }, [confirmError]);

  const handleMarkAsCleaned = async () => {
    setErrorMessage(null);
    setSuccessTxHash(null);

    if (!CLEAN_CHECK_ADDRESS) {
      setErrorMessage(
        "Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local"
      );
      return;
    }

    if (!isCorrectChain) {
      setErrorMessage(
        `Please switch your wallet to Botchain Mainnet (Chain ID ${botchain.id}).`
      );
      return;
    }

    try {
      writeContract({
        address: CLEAN_CHECK_ADDRESS,
        abi: CLEAN_CHECK_ABI,
        functionName: "completeTask",
        args: [BigInt(task.id)],
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to initiate transaction.");
    }
  };

  const isPending = isWritePending || isConfirming;
  const isCompleted = Boolean(hasCompletedToday);

  // Render appropriate task icon
  const renderIcon = () => {
    switch (task.iconName) {
      case "armchair":
        return <Armchair className="w-5 h-5 text-accent" />;
      case "desk":
        return <Briefcase className="w-5 h-5 text-accent" />;
      case "trash":
        return <Trash2 className="w-5 h-5 text-accent" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-accent/40">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center">
              {renderIcon()}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-mutedText">
                Task #{task.id}
              </span>
              <h3 className="text-base font-bold text-mainText">{task.title}</h3>
            </div>
          </div>

          {/* Status pill if completed today */}
          {isConnected && isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-light text-success border border-success/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed Today
            </span>
          )}
        </div>

        <p className="text-sm text-mutedText leading-relaxed mb-5">
          {task.description}
        </p>

        {/* Total times cleaned */}
        <div className="bg-[#15171C] border border-border/80 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
          <span className="text-xs text-mutedText">Total Times Cleaned</span>
          {isLoadingCount ? (
            <div className="h-5 w-8 bg-[#282C36] animate-pulse rounded" />
          ) : (
            <span className="font-mono text-sm font-bold text-mainText">
              {completionCount !== undefined ? completionCount.toString() : "0"}
            </span>
          )}
        </div>
      </div>

      <div>
        {/* Messages */}
        {errorMessage && (
          <div className="mb-3 p-3 rounded-lg bg-error-light border border-error/30 text-xs text-error flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="underline mt-1 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {successTxHash && (
          <div className="mb-3 p-3 rounded-lg bg-success-light border border-success/30 text-xs text-success flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Recorded on-chain successfully!</p>
              <a
                href={`https://scan.botchain.ai/tx/${successTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline mt-0.5 text-mainText hover:text-accent"
              >
                View on Botchain Scan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Button state */}
        {!isConnected ? (
          <div className="text-center py-2 px-3 bg-[#1A1C23] border border-border/60 rounded-xl">
            <p className="text-xs text-mutedText">
              Connect wallet to record completion
            </p>
          </div>
        ) : isCompleted ? (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-[#282C36] border border-border text-xs font-semibold text-mutedText flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4 text-success" />
            Completed Today
          </button>
        ) : (
          <button
            onClick={handleMarkAsCleaned}
            disabled={isPending || !isCorrectChain}
            className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-[#15171C] text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#15171C]" />
                <span>
                  {isWritePending ? "Confirm in Wallet..." : "Recording on-chain..."}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Cleaned</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
