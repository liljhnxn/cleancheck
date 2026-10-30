"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ExternalLink } from "lucide-react";
import { WalletButton } from "./WalletButton";
import { CLEAN_CHECK_ADDRESS } from "@/lib/contract";

export function Header() {
  const explorerContractUrl = CLEAN_CHECK_ADDRESS
    ? `https://scan.botchain.ai/address/${CLEAN_CHECK_ADDRESS}`
    : "https://scan.botchain.ai";

  return (
    <header className="border-b border-border bg-[#15171C]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/30 flex items-center justify-center text-accent shadow-sm">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-mainText">
                CleanCheck
              </h1>
              <a
                href={explorerContractUrl}
                target="_blank"
                rel="noreferrer"
                title="View Verified Contract on Botchain Scan"
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#20232B] hover:bg-[#282C36] border border-border text-accent transition-colors shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-3 h-3 rounded-full object-cover"
                />
                <span>Botchain Mainnet</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </div>
            <p className="text-xs text-mutedText">
              Simple cleaning records on the blockchain
            </p>
          </div>
        </div>

        {/* Quick Ecosystem Links & Wallet */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-[#282C36] border border-border text-xs font-medium text-mainText hover:text-accent transition-all duration-150 shadow-sm"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-4 h-4 rounded-full object-cover"
            />
            <span>BOT Chain</span>
            <ExternalLink className="w-3 h-3 text-mutedText" />
          </a>

          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-[#282C36] border border-border text-xs font-medium text-mainText hover:text-accent transition-all duration-150 shadow-sm"
          >
            <img
              src="/botchain-logo.png"
              alt="Explorer"
              className="w-4 h-4 rounded-full object-cover"
            />
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-mutedText" />
          </a>

          <WalletButton />
        </div>
      </div>
    </header>
  );
}
