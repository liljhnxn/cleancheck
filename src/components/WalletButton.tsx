"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { botchainTestnet } from "@/lib/chain";
import {
  Wallet,
  LogOut,
  ChevronDown,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasInjected, setHasInjected] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasInjected(Boolean((window as any).ethereum));
    }
  }, []);

  const isCorrectChain = chainId === botchainTestnet.id;

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = async (connectorToUse?: any) => {
    setErrorMessage(null);

    // If window.ethereum is missing and no connectors are listed
    if (typeof window !== "undefined" && !(window as any).ethereum && connectors.length === 0) {
      setErrorMessage(
        "No Web3 wallet extension detected. Please install MetaMask or another browser wallet."
      );
      setShowModal(true);
      return;
    }

    const connector = connectorToUse || connectors[0];

    if (!connector) {
      // Fallback: try direct window.ethereum request
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          await (window as any).ethereum.request({ method: "eth_requestAccounts" });
          window.location.reload();
        } catch (err: any) {
          setErrorMessage(err?.message || "Connection request was rejected.");
        }
      } else {
        setErrorMessage("Please install MetaMask to connect.");
        setShowModal(true);
      }
      return;
    }

    connect(
      { connector },
      {
        onError(err) {
          console.error("Wallet connection error:", err);
          const msg = err.message || "";
          if (msg.toLowerCase().includes("user rejected") || msg.toLowerCase().includes("denied")) {
            setErrorMessage("Connection was cancelled in your wallet.");
          } else {
            setErrorMessage(err.message.slice(0, 100) || "Failed to connect wallet.");
          }
        },
      }
    );
  };

  if (!isConnected || !address) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            if (connectors.length > 1) {
              setShowModal(true);
            } else {
              handleConnect();
            }
          }}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-[#15171C] font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer"
        >
          {isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>

        {/* Inline error notice */}
        {errorMessage && (
          <div className="absolute right-0 mt-2 w-72 p-3 bg-card border border-error/40 rounded-xl shadow-xl z-50 text-xs text-mainText animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-error font-medium">{errorMessage}</p>
                {!hasInjected && (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-accent underline mt-1.5 hover:text-white"
                  >
                    Install MetaMask
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setErrorMessage(null)}
                  className="block text-[11px] text-mutedText underline mt-1 hover:text-mainText"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Selection / Installation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className="fixed inset-0"
              onClick={() => setShowModal(false)}
            />
            <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl z-10">
              <h3 className="text-base font-bold text-mainText mb-1">
                Connect a Wallet
              </h3>
              <p className="text-xs text-mutedText mb-4">
                Choose a wallet to connect to CleanCheck on Botchain Testnet
              </p>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-error-light border border-error/30 text-xs text-error flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="flex-1">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-2">
                {connectors.length > 0 ? (
                  connectors.map((c) => (
                    <button
                      key={c.uid || c.id}
                      onClick={() => {
                        setShowModal(false);
                        handleConnect(c);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1A1C23] hover:bg-[#282C36] border border-border text-sm font-medium text-mainText transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-accent" />
                        {c.name || "Browser Wallet"}
                      </span>
                      <span className="text-xs text-accent font-semibold">
                        Connect
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-mutedText mb-3">
                      No Web3 wallet extension found in this browser.
                    </p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-[#15171C] font-semibold text-xs rounded-lg hover:bg-accent-hover transition-all"
                    >
                      Install MetaMask Extension
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-4 py-2 text-xs text-mutedText hover:text-mainText text-center"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 bg-card hover:bg-[#282C36] border border-border rounded-lg text-sm transition-all"
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isCorrectChain ? "bg-accent shadow-[0_0_8px_#45C4B0]" : "bg-error"
          }`}
        />
        <span className="font-mono text-mainText">{shortenAddress(address)}</span>
        <ChevronDown className="w-3.5 h-3.5 text-mutedText" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 p-2 text-sm animate-fadeIn">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-xs text-mutedText">Connected Network</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCorrectChain ? "bg-accent" : "bg-error"
                  }`}
                />
                <p className="text-xs font-medium text-mainText">
                  {isCorrectChain ? "Botchain Testnet" : "Unsupported Network"}
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5">
              <p className="text-xs text-mutedText">Wallet Address</p>
              <p className="text-xs font-mono text-mainText truncate">{address}</p>
            </div>

            <button
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-xs text-error hover:bg-error-light rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect Wallet
            </button>
          </div>
        </>
      )}
    </div>
  );
}
