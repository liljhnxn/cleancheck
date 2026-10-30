"use client";

import React from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { CLEAN_CHECK_ADDRESS } from "@/lib/contract";

export function Footer() {
  const mainnetAddress =
    CLEAN_CHECK_ADDRESS || "0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55";

  return (
    <footer className="mt-auto border-t border-border bg-[#15171C] py-10 text-xs text-mutedText">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Ecosystem & Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-6 border-b border-border/60">
          {/* Brand & Network Identity */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-mainText font-semibold text-sm">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="w-6 h-6 rounded-lg object-cover shadow-sm border border-border"
              />
              <span>Powered by BOT Chain</span>
            </div>
            <p className="text-mutedText leading-relaxed">
              Decentralized infrastructure designed for AI and verified smart contracts.
            </p>
          </div>

          {/* Official BOT Chain Ecosystem Links */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mainText">
              BOT Chain Ecosystem
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-mutedText hover:text-accent transition-colors font-medium"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain Logo"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>BOT Chain Website: https://botchain.ai</span>
                  <ExternalLink className="w-3 h-3 text-mutedText" />
                </a>
              </li>
              <li>
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-mutedText hover:text-accent transition-colors font-medium"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain Explorer Logo"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>BOT Chain Explorer: https://scan.botchain.ai</span>
                  <ExternalLink className="w-3 h-3 text-mutedText" />
                </a>
              </li>
            </ul>
          </div>

          {/* Mainnet Smart Contract Info */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mainText">
              Mainnet Smart Contract
            </span>
            <div>
              <a
                href={`https://scan.botchain.ai/address/${mainnetAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-accent font-mono hover:underline break-all bg-card px-2.5 py-1.5 rounded-lg border border-border/80"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0"
                />
                <span>{mainnetAddress}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-mutedText">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Chain ID: 677 (Mainnet Verified)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-start sm:items-center gap-2 max-w-xl">
            <ShieldAlert className="w-4 h-4 text-accent/80 flex-shrink-0 mt-0.5 sm:mt-0" />
            <p>
              CleanCheck is a portfolio demo. Records are submitted by users on-chain and do
              not independently verify that cleaning took place.
            </p>
          </div>
          <div className="text-[11px] text-mutedText font-mono">
            CleanCheck © {new Date().getFullYear()} • Botchain Mainnet
          </div>
        </div>
      </div>
    </footer>
  );
}
