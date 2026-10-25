"use client";

import React, { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/chain";
import { AlertTriangle, ArrowRightLeft, Loader2 } from "lucide-react";

export function NetworkAlert() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isWagmiSwitchPending } = useSwitchChain();
  const [isManualPending, setIsManualPending] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  if (!isConnected || chainId === botchainTestnet.id) {
    return null;
  }

  const isPending = isWagmiSwitchPending || isManualPending;

  const handleSwitchNetwork = async () => {
    setSwitchError(null);
    setIsManualPending(true);

    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${botchainTestnet.id.toString(16)}` }],
          });
        } catch (switchErr: any) {
          // If error 4902, the chain needs to be added
          if (
            switchErr?.code === 4902 ||
            switchErr?.data?.originalError?.code === 4902 ||
            switchErr?.message?.includes("4902") ||
            switchErr?.message?.includes("Unrecognized chain")
          ) {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${botchainTestnet.id.toString(16)}`,
                  chainName: botchainTestnet.name,
                  nativeCurrency: botchainTestnet.nativeCurrency,
                  rpcUrls: [
                    process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life",
                  ],
                  blockExplorerUrls: ["https://scan.bohr.life"],
                },
              ],
            });
          } else {
            throw switchErr;
          }
        }
      } else if (switchChain) {
        switchChain({ chainId: botchainTestnet.id });
      }
    } catch (err: any) {
      console.error("Network switch error:", err);
      setSwitchError(err?.message || "Failed to switch network.");
    } finally {
      setIsManualPending(false);
    }
  };

  return (
    <div className="w-full bg-error-light border border-error/40 text-mainText px-4 py-3 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-fadeIn">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-mainText">
            Wrong Network Detected
          </p>
          <p className="text-xs text-mutedText">
            Please switch to Botchain Testnet (Chain ID: {botchainTestnet.id}) to record cleanliness tasks.
          </p>
          {switchError && (
            <p className="text-xs text-error mt-1">{switchError}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleSwitchNetwork}
        disabled={isPending}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-card hover:bg-[#2c303c] border border-border text-xs font-semibold rounded-lg text-accent transition-all duration-150 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ArrowRightLeft className="w-3.5 h-3.5" />
        )}
        {isPending ? "Switching..." : "Switch to Botchain Testnet"}
      </button>
    </div>
  );
}
