"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Search, ExternalLink, BookOpen, Calendar, Scale, ChevronLeft, ChevronRight, Filter, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";

interface CaseLawResult {
  id: string | number;
  caseName: string;
  court: string;
  courtName: string;
  dateFiled: string | null;
  citations: string[];
  judges: string;
  status: string;
  snippet: string;
  absoluteUrl: string | null;
  docketNumber: string;
}

interface SearchResponse {
  count: number;
  results: CaseLawResult[];
}

const COURT_FILTERS = [
  { value: "", label: "All Courts" },
  { value: "scotus", label: "US Supreme Court" },
  { value: "ca2", label: "2nd Circuit" },
  { value: "ca9", label: "9th Circuit" },
  { value: "ca11", label: "11th Circuit" },
  { value: "cadc", label: "D.C. Circuit" },
  { value: "dcd", label: "D.D.C." },
];

const SORT_OPTIONS = [
  { value: "score desc", label: "Relevance" },
  { value: "dateFiled desc", label: "Newest First" },
  { value: "dateFiled asc", label: "Oldest First" },
];

const SUGGESTED_QUERIES = [
  "Uzbekistan investment treaty arbitration",
  "FCPA Central Asia enforcement",
  "BIT bilateral investment treaty",
  "foreign judgment enforcement",
  "international arbitration award",
  "state-owned enterprise immunity",
  "expropriation compensation",
  "New York Convention enforcement",
];

export default function CaseLawPage() {
  const t = useTranslations("caseLaw");

  const [query, setQuery] = useState("");
  const [court, setCourt] = useState("");
  const [sortBy, setSortBy] = useState("score desc");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<CaseLawResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const doSearch = useCallback(async (q: string, c: string, sort: string, p: number) => {
    if (!q.trim()) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setHasSearched(true);

    const params = new URLSearchParams({ q, order_by: sort, page: String(p) });
    if (c) params.set("court", c);

    try {
      const res = await fetch(`/api/case-law?${params.toString()}`, {
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: SearchResponse = await res.json();
      setResults(data.results ?? []);
      setTotal(data.count ?? 0);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to fetch results. Please try again.");
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    setPage(1);
    doSearch(query, court, sortBy, 1);
  };

  const handleSuggest = (q: string) => {
    setQuery(q);
    setPage(1);
    doSearch(q, court, sortBy, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doSearch(query, court, sortBy, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(Math.min(total, 120) / 12);

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">{t("label")}</SectionLabel>
          <h1
            className="font-sans font-bold text-ink mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}
          >
            {t("title")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-5" />
          <p className="text-body-lg text-ink-secondary max-w-2xl leading-relaxed">{t("subtitle")}</p>

          {/* Disclaimer */}
          <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-sm max-w-2xl">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-body-sm text-amber-800">{t("disclaimer")}</p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border-b border-stone sticky top-[108px] z-30 shadow-legal-sm">
        <div className="site-container py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("searchPlaceholder")}
                className="form-input pl-10 pr-4 py-3 text-body-md w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters((f) => !f)}
              className={cn(
                "px-4 py-3 border rounded-sm flex items-center gap-2 text-body-sm font-medium transition-all",
                showFilters
                  ? "bg-blue-deep text-white border-blue-deep"
                  : "bg-white text-ink-secondary border-stone hover:border-blue-light"
              )}
            >
              <Filter className="w-4 h-4" />
              {t("filters")}
            </button>
            <button
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              className="px-6 py-3 bg-blue-deep text-white font-semibold text-body-sm rounded-sm hover:bg-blue-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {t("search")}
            </button>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 flex flex-wrap gap-4 items-end border-t border-stone mt-4">
                  {/* Court filter */}
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-caption font-semibold text-ink-secondary uppercase tracking-wider mb-2 block">{t("courtFilter")}</label>
                    <select
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      className="form-input py-2.5 text-body-sm w-full"
                    >
                      {COURT_FILTERS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-caption font-semibold text-ink-secondary uppercase tracking-wider mb-2 block">{t("sortBy")}</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-input py-2.5 text-body-sm w-full"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="site-container py-10">
        {/* Suggested queries — shown before first search */}
        {!hasSearched && (
          <div>
            <h2 className="text-body-md font-bold text-ink mb-4">{t("suggestedSearches")}</h2>
            <div className="flex flex-wrap gap-2 mb-10">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggest(q)}
                  className="px-4 py-2 bg-white border border-stone rounded-sm text-body-sm text-ink-secondary hover:border-blue-action hover:text-blue-deep transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Info cards */}
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Scale,
                  title: t("info1Title"),
                  desc: t("info1Desc"),
                },
                {
                  icon: BookOpen,
                  title: t("info2Title"),
                  desc: t("info2Desc"),
                },
                {
                  icon: ExternalLink,
                  title: t("info3Title"),
                  desc: t("info3Desc"),
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-stone rounded-sm p-6">
                  <div className="w-10 h-10 rounded-sm bg-blue-pale flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-deep" />
                  </div>
                  <h3 className="text-body-md font-bold text-ink mb-2">{title}</h3>
                  <p className="text-body-sm text-ink-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-body-sm mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Results header */}
        {hasSearched && !loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-body-sm text-ink-secondary">
              {total > 0 ? (
                <>{t("resultsCount", { count: total.toLocaleString(), query })}</>
              ) : (
                t("noResults")
              )}
            </p>
            {total > 0 && (
              <p className="text-caption text-ink-muted">
                {t("page")} {page} / {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-stone rounded-sm p-6 animate-pulse">
                <div className="h-5 bg-stone rounded w-3/4 mb-3" />
                <div className="h-4 bg-stone rounded w-1/3 mb-4" />
                <div className="h-4 bg-stone rounded w-full mb-2" />
                <div className="h-4 bg-stone rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {results.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="bg-white border border-stone rounded-sm p-6 hover:border-blue-light hover:shadow-legal-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Case name */}
                      <h3 className="text-body-md font-bold text-ink mb-2 group-hover:text-blue-deep transition-colors leading-snug">
                        {item.absoluteUrl ? (
                          <a
                            href={item.absoluteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {item.caseName}
                          </a>
                        ) : (
                          item.caseName
                        )}
                      </h3>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {item.courtName && (
                          <span className="flex items-center gap-1.5 text-caption text-blue-deep font-semibold">
                            <Scale className="w-3 h-3" />
                            {item.courtName}
                          </span>
                        )}
                        {item.dateFiled && (
                          <span className="flex items-center gap-1.5 text-caption text-ink-muted">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.dateFiled).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                        {item.docketNumber && (
                          <span className="text-caption text-ink-muted">#{item.docketNumber}</span>
                        )}
                        {item.status && (
                          <span className="px-2 py-0.5 text-caption font-semibold bg-stone text-ink-secondary rounded-sm uppercase tracking-wide">
                            {item.status}
                          </span>
                        )}
                      </div>

                      {/* Citations */}
                      {item.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.citations.slice(0, 3).map((cite) => (
                            <span key={cite} className="px-2 py-0.5 text-caption bg-blue-pale text-blue-deep rounded-sm border border-blue-light/50 font-mono">
                              {cite}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Snippet */}
                      {item.snippet && (
                        <p
                          className="text-body-sm text-ink-secondary leading-relaxed line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: item.snippet
                              .replace(/<em>/g, '<mark class="bg-yellow-100 text-yellow-900 px-0.5 rounded not-italic">')
                              .replace(/<\/em>/g, "</mark>"),
                          }}
                        />
                      )}

                      {/* Judge */}
                      {item.judges && (
                        <p className="text-caption text-ink-muted mt-2">
                          Judge: {item.judges}
                        </p>
                      )}
                    </div>

                    {/* External link */}
                    {item.absoluteUrl && (
                      <a
                        href={item.absoluteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-9 h-9 rounded-sm border border-stone flex items-center justify-center text-ink-muted hover:border-blue-action hover:text-blue-deep transition-all"
                        title="View on CourtListener"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="w-10 h-10 rounded-sm border border-stone flex items-center justify-center text-ink-secondary hover:border-blue-action hover:text-blue-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = page <= 3 ? i + 1 : page - 2 + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "w-10 h-10 rounded-sm border text-body-sm font-medium transition-all",
                    pageNum === page
                      ? "bg-blue-deep text-white border-blue-deep"
                      : "bg-white text-ink-secondary border-stone hover:border-blue-action"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-sm border border-stone flex items-center justify-center text-ink-secondary hover:border-blue-action hover:text-blue-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Attribution */}
        {hasSearched && (
          <p className="text-center text-caption text-ink-muted mt-8">
            {t("poweredBy")}{" "}
            <a href="https://www.courtlistener.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-deep transition-colors">
              CourtListener
            </a>{" "}
            — Free Law Project
          </p>
        )}
      </div>
    </main>
  );
}
