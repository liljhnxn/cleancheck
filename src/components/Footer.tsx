"use client";

import React from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#15171C] py-8 text-xs text-mutedText">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-start sm:items-center gap-2 max-w-xl">
          <ShieldAlert className="w-4 h-4 text-accent/80 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p>
            CleanCheck is a portfolio demo. Records are submitted by users and do
            not independently verify that cleaning took place.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://scan.bohr.life"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-mainText hover:text-accent transition-colors"
          >
            <span>Botchain Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
