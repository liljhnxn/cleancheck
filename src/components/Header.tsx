"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { WalletButton } from "./WalletButton";

export function Header() {
  return (
    <header className="border-b border-border bg-[#15171C]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/30 flex items-center justify-center text-accent shadow-sm">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-mainText">
                CleanCheck
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#20232B] border border-border text-accent">
                Botchain Testnet
              </span>
            </div>
            <p className="text-xs text-mutedText">
              Simple cleaning records on the blockchain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
