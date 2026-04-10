"use client";

import { CheckCircle2 } from "lucide-react";

const TRUST_ITEMS = [
  "Legal 500 Recognized",
  "IBA Member Firm",
  "Uzbek Bar Association",
  "UNCITRAL Arbitration",
  "WTO Framework Advisory",
  "Foreign Investors' Council",
  "ICC Registered",
  "LCIA Practitioners",
  "ABA International Member",
  "Chambers Ranked",
];

export function TrustBar() {
  const doubled = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <div className="relative bg-blue-deep border-y border-blue-mid/20 overflow-hidden py-3.5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-deep to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-deep to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2.5 mx-7 flex-shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-light/70 flex-shrink-0" />
            <span className="text-body-sm font-medium text-white/80 tracking-wide">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
