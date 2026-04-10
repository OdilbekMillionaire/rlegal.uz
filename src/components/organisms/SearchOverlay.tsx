"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, FileText, Users, Briefcase, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import NextLink from "next/link";

interface SearchResult {
  type: "service" | "page" | "team" | "insight";
  title: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
}

const STATIC_RESULTS: SearchResult[] = [
  { type: "service", title: "Corporate & M&A", subtitle: "Company formation, mergers, acquisitions", href: "/services/corporate", icon: Briefcase },
  { type: "service", title: "International Trade & Investment", subtitle: "FDI, BIT protection, free economic zones", href: "/services/international", icon: Briefcase },
  { type: "service", title: "Contract Law", subtitle: "Draft, review, and negotiate agreements", href: "/services/contract", icon: Briefcase },
  { type: "service", title: "Labor & Employment", subtitle: "Work permits, HR compliance, disputes", href: "/services/labor", icon: Briefcase },
  { type: "service", title: "Litigation & Arbitration", subtitle: "ICC, LCIA, UNCITRAL representation", href: "/services/litigation", icon: Briefcase },
  { type: "page", title: "AI Legal Advisor", subtitle: "Instant AI answers on Uzbekistan law", href: "/ai-advisor", icon: FileText },
  { type: "page", title: "Legal News", subtitle: "Latest Uzbekistan legal & business news", href: "/news", icon: Newspaper },
  { type: "page", title: "FAQ", subtitle: "Common questions answered", href: "/faq", icon: FileText },
  { type: "page", title: "Resources", subtitle: "Guides, templates, legislation", href: "/resources", icon: FileText },
  { type: "page", title: "Book Consultation", subtitle: "Contact our attorneys", href: "/contact", icon: Users },
  { type: "team", title: "Meet Our Team", subtitle: "Senior attorneys and legal experts", href: "/team", icon: Users },
  { type: "insight", title: "Case Studies", subtitle: "Real results for international clients", href: "/case-studies", icon: FileText },
];

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = STATIC_RESULTS.filter(
    (r) =>
      !query.trim() ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [open]);

  const typeColors: Record<SearchResult["type"], string> = {
    service: "text-blue-action bg-blue-pale",
    page: "text-ink-secondary bg-stone",
    team: "text-amber-700 bg-amber-50",
    insight: "text-green-700 bg-green-50",
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-stone hover:bg-cream-dark rounded-sm border border-stone-dark/50 text-body-sm text-ink-muted hover:text-ink transition-all duration-200"
        title="Search (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone rounded text-ink-muted">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[70]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[71] w-full max-w-2xl bg-white rounded-sm shadow-legal-lg border border-stone overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-stone">
                <Search className="w-5 h-5 text-ink-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services, pages, resources..."
                  className="flex-1 text-body-md text-ink bg-transparent outline-none placeholder:text-ink-muted"
                />
                <button onClick={() => setOpen(false)}>
                  <X className="w-4 h-4 text-ink-muted hover:text-ink transition-colors" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto divide-y divide-stone/50">
                {filtered.length === 0 && (
                  <p className="text-body-sm text-ink-muted text-center py-8">No results for &quot;{query}&quot;</p>
                )}
                {filtered.map((result) => {
                  const Icon = result.icon;
                  return (
                    <NextLink
                      key={result.href}
                      href={result.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream transition-colors group"
                    >
                      <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0", typeColors[result.type])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md font-semibold text-ink group-hover:text-blue-deep transition-colors truncate">
                          {result.title}
                        </p>
                        <p className="text-caption text-ink-muted truncate">{result.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NextLink>
                  );
                })}
              </div>

              <div className="px-5 py-2.5 border-t border-stone bg-cream/50 flex items-center gap-4 text-caption text-ink-muted">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">Esc</kbd> close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
