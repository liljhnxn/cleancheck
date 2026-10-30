"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { NetworkAlert } from "@/components/NetworkAlert";
import { StatsOverview } from "@/components/StatsOverview";
import { TaskList } from "@/components/TaskList";
import { RecentActivity } from "@/components/RecentActivity";
import { Footer } from "@/components/Footer";
import { CLEAN_CHECK_ADDRESS } from "@/lib/contract";
import { ExternalLink, Copy, Check, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const mainnetAddress =
    CLEAN_CHECK_ADDRESS || "0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55";

  const handleRefreshAll = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCopyAddress = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(mainnetAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NetworkAlert />

        {/* Prominent Mainnet Verification Banner on Interface */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-accent/30 shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-10 h-10 rounded-xl object-cover border border-accent/40 shadow-sm flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-mainText">
                    Botchain Mainnet Live
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Contract
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-mutedText">Contract:</span>
                  <code className="text-xs font-mono text-accent bg-[#15171C] px-2 py-0.5 rounded border border-border">
                    {mainnetAddress}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    title="Copy contract address"
                    className="inline-flex items-center gap-1 text-xs text-mutedText hover:text-mainText px-1.5 py-0.5 rounded hover:bg-[#282C36] transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-accent" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Explorer and Official Website Links with BOT Chain Logo at the front */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              <a
                href={`https://scan.botchain.ai/address/${mainnetAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15171C] hover:bg-[#282C36] border border-border text-xs font-medium text-mainText hover:text-accent transition-colors"
              >
                <img
                  src="/botchain-logo.png"
                  alt="Explorer"
                  className="w-3.5 h-3.5 rounded-full object-cover"
                />
                <span>View on Explorer</span>
                <ExternalLink className="w-3 h-3 text-mutedText" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15171C] hover:bg-[#282C36] border border-border text-xs font-medium text-mainText hover:text-accent transition-colors"
              >
                <img
                  src="/botchain-logo.png"
                  alt="Explorer"
                  className="w-3.5 h-3.5 rounded-full object-cover"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-mutedText" />
              </a>

              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15171C] hover:bg-[#282C36] border border-border text-xs font-medium text-mainText hover:text-accent transition-colors"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-3.5 h-3.5 rounded-full object-cover"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-mutedText" />
              </a>
            </div>
          </div>
        </div>

        <StatsOverview key={`stats-${refreshKey}`} />

        <TaskList onRefreshAll={handleRefreshAll} />

        <RecentActivity refreshTrigger={refreshKey} />
      </main>

      <Footer />
    </div>
  );
}
