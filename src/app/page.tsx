"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { NetworkAlert } from "@/components/NetworkAlert";
import { StatsOverview } from "@/components/StatsOverview";
import { TaskList } from "@/components/TaskList";
import { RecentActivity } from "@/components/RecentActivity";
import { Footer } from "@/components/Footer";
import { CLEAN_CHECK_ADDRESS } from "@/lib/contract";
import { Info, Terminal } from "lucide-react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshAll = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NetworkAlert />

        {/* Informational banner if contract is not yet configured in env */}
        {!CLEAN_CHECK_ADDRESS && (
          <div className="mb-6 p-4 rounded-xl bg-card border border-accent/30 text-xs text-mainText flex items-start gap-3 shadow-md">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-accent">
                Contract Deployment Setup Notice
              </p>
              <p className="text-mutedText">
                To connect the dashboard with your smart contract on Botchain Testnet, deploy the contract using{" "}
                <code className="text-accent bg-[#15171C] px-1.5 py-0.5 rounded font-mono">
                  npm run deploy:testnet
                </code>{" "}
                and add the contract address to{" "}
                <code className="text-accent bg-[#15171C] px-1.5 py-0.5 rounded font-mono">
                  .env.local
                </code>{" "}
                as <code className="text-mainText font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS=&lt;address&gt;</code>.
              </p>
            </div>
          </div>
        )}

        <StatsOverview key={`stats-${refreshKey}`} />

        <TaskList onRefreshAll={handleRefreshAll} />

        <RecentActivity refreshTrigger={refreshKey} />
      </main>

      <Footer />
    </div>
  );
}
