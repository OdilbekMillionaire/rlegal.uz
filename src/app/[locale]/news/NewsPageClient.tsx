"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ExternalLink, Calendar, Globe, Filter,
  ChevronLeft, ChevronRight, RefreshCw, Newspaper, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string; id: string | null };
  author: string | null;
  content: string | null;
}

interface NewsResponse {
  articles: Article[];
  totalResults: number;
  page: number;
  pageSize: number;
}

const TOPIC_FILTERS = [
  { key: "all", queryEn: "Uzbekistan law investment business", queryRu: "Узбекистан инвестиции бизнес" },
  { key: "filterBusiness", queryEn: "Uzbekistan business economy", queryRu: "Узбекистан бизнес экономика" },
  { key: "filterLegal", queryEn: "Uzbekistan legal legislation law", queryRu: "Узбекистан законодательство право" },
  { key: "filterEconomy", queryEn: "Uzbekistan economy GDP reform", queryRu: "Узбекистан экономика реформы ВВП" },
  { key: "filterPolitics", queryEn: "Uzbekistan policy regulation government", queryRu: "Узбекистан политика регулирование" },
  { key: "filterTechnology", queryEn: "Uzbekistan technology digital innovation", queryRu: "Узбекистан технологии цифровой" },
  { key: "filterInvestment", queryEn: "Uzbekistan investment FDI foreign", queryRu: "Узбекистан инвестиции ПИИ" },
];

function formatDate(dateStr: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "ru" || locale === "uz-cyrl" ? "ru-RU" : "en-US", {
      day: "numeric", month: "short", year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr.slice(0, 10);
  }
}

interface Props { locale: string; }

export function NewsPageClient({ locale }: Props) {
  const t = useTranslations("news");

  const [articles, setArticles] = useState<Article[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [topicKey, setTopicKey] = useState("all");
  const [newsLang, setNewsLang] = useState<"en" | "ru">("en");
  const [sortBy, setSortBy] = useState<"publishedAt" | "relevancy">("publishedAt");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    const topic = TOPIC_FILTERS.find((f) => f.key === topicKey) ?? TOPIC_FILTERS[0];
    const baseQuery = newsLang === "ru" ? topic.queryRu : topic.queryEn;
    const q = debouncedSearch.trim() || baseQuery;

    const params = new URLSearchParams({
      q,
      language: newsLang,
      sortBy,
      page: String(page),
      pageSize: "12",
    });

    try {
      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("fetch_failed");
      const data: NewsResponse = await res.json();
      setArticles(data.articles ?? []);
      setTotalResults(data.totalResults ?? 0);
    } catch {
      setError(t("errorLoad"));
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, topicKey, newsLang, sortBy, page, t]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const totalPages = Math.min(Math.ceil(totalResults / 12), 5);

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Hero header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">{t("title")}</SectionLabel>
          <h1
            className="font-sans font-bold text-ink mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}
          >
            {t("title")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-5" />
          <p className="text-body-lg text-ink-secondary max-w-2xl">{t("subtitle")}</p>
        </div>
      </section>

      {/* Filters bar */}
      <section className="bg-white border-b border-stone sticky top-[108px] z-30">
        <div className="site-container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("search")}
                className="form-input pl-10 pr-4 py-2.5 text-body-sm"
              />
            </div>

            {/* Language toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <Globe className="w-4 h-4 text-ink-muted" />
              <span className="text-body-sm text-ink-muted">{t("langFilter")}:</span>
              {(["en", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setNewsLang(lang); setPage(1); }}
                  className={cn(
                    "px-3 py-1.5 text-body-sm font-semibold rounded-sm border transition-all duration-200",
                    newsLang === lang
                      ? "bg-blue-deep text-white border-blue-deep"
                      : "bg-white text-ink-secondary border-stone hover:border-stone-dark"
                  )}
                >
                  {lang === "en" ? t("langEn") : t("langRu")}
                </button>
              ))}

              {/* Sort */}
              <div className="h-4 w-px bg-stone mx-1" />
              <Filter className="w-4 h-4 text-ink-muted" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setPage(1); }}
                className="form-input py-1.5 px-2 text-body-sm w-auto"
              >
                <option value="publishedAt">{t("sortNewest")}</option>
                <option value="relevancy">{t("sortRelevant")}</option>
              </select>
            </div>
          </div>

          {/* Topic chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {TOPIC_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setTopicKey(f.key); setPage(1); }}
                className={cn(
                  "px-3 py-1.5 text-body-sm font-medium rounded-sm border transition-all duration-200",
                  topicKey === f.key
                    ? "bg-blue-deep text-white border-blue-deep"
                    : "bg-white text-ink-secondary border-stone hover:border-blue-light hover:text-ink"
                )}
              >
                {t(f.key === "all" ? "filterAll" : (f.key as Parameters<typeof t>[0]))}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="site-container py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RefreshCw className="w-8 h-8 text-blue-action animate-spin" />
            <p className="text-body-md text-ink-muted">{t("loading")}</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-body-md text-ink-secondary">{error}</p>
            <button
              onClick={fetchNews}
              className="btn-primary text-body-sm px-5 py-2.5"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Newspaper className="w-10 h-10 text-stone-dark" />
            <p className="text-body-md text-ink-secondary">{t("noResults")}</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${topicKey}-${newsLang}-${page}-${debouncedSearch}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {articles.map((article, i) => (
                <motion.article
                  key={`${article.url}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="card flex flex-col group"
                >
                  {/* Image */}
                  {article.urlToImage && (
                    <div className="relative h-44 overflow-hidden rounded-t-sm bg-stone">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm",
                          newsLang === "ru"
                            ? "bg-red-600 text-white"
                            : "bg-blue-deep text-white"
                        )}>
                          {newsLang === "ru" ? "RU" : "EN"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5">
                    {/* Source + date */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-caption font-semibold text-blue-action uppercase tracking-wider">
                        {article.source.name}
                      </span>
                      <span className="text-stone-dark">·</span>
                      <span className="text-caption text-ink-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.publishedAt, locale)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-heading-sm font-bold text-ink mb-2 leading-snug group-hover:text-blue-deep transition-colors line-clamp-3">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-body-sm text-ink-secondary leading-relaxed flex-1 line-clamp-3 mb-4">
                      {article.description}
                    </p>

                    {/* CTA */}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-blue-action hover:text-blue-deep transition-colors mt-auto"
                    >
                      {t("readFull")} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-stone hover:border-blue-action disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-sm border text-body-sm font-semibold transition-all",
                  page === p
                    ? "bg-blue-deep text-white border-blue-deep"
                    : "border-stone text-ink-secondary hover:border-blue-action"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-stone hover:border-blue-action disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
