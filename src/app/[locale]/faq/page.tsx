"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, MessageSquare, Scale, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Link } from "@/i18n/navigation";

type FAQItem = { category: string; question: string; answer: string };

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  investment:  { bg: "bg-blue-50",   text: "text-blue-700" },
  corporate:   { bg: "bg-purple-50", text: "text-purple-700" },
  labor:       { bg: "bg-amber-50",  text: "text-amber-700" },
  taxation:    { bg: "bg-green-50",  text: "text-green-700" },
  arbitration: { bg: "bg-red-50",    text: "text-red-700" },
  contract:    { bg: "bg-cyan-50",   text: "text-cyan-700" },
  compliance:  { bg: "bg-orange-50", text: "text-orange-700" },
  realestate:  { bg: "bg-teal-50",   text: "text-teal-700" },
};

export default function FaqPage() {
  const t = useTranslations("faq");

  const rawItems = t.raw("items") as FAQItem[];
  const items: FAQItem[] = Array.isArray(rawItems) ? rawItems : [];

  const categories = ["all", "corporate", "investment", "labor", "taxation", "arbitration", "contract", "compliance", "realestate"] as const;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => items.filter((item) => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [items, activeCategory, search]);

  // Count per category for badges
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    items.forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
    return map;
  }, [items]);

  const catLabel = (cat: string) => {
    try { return t(`categories.${cat}` as Parameters<typeof t>[0]); } catch { return cat; }
  };

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

      {/* Sticky filter bar */}
      <section className="bg-white border-b border-stone sticky top-[108px] z-30 shadow-sm">
        <div className="site-container py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
                placeholder={t("searchPlaceholder")}
                className="form-input pl-9 py-2 text-body-sm w-full"
              />
            </div>

            {/* Category chips — scrollable */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full border transition-all duration-200 whitespace-nowrap",
                    activeCategory === cat
                      ? "bg-blue-deep text-white border-blue-deep shadow-sm"
                      : "bg-white text-ink-secondary border-stone hover:border-blue-action hover:text-blue-deep"
                  )}
                >
                  {catLabel(cat)}
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    activeCategory === cat ? "bg-white/20 text-white" : "bg-stone text-ink-muted"
                  )}>
                    {counts[cat] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="site-container py-12 max-w-4xl mx-auto">
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 text-ink-muted">
            <Scale className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-body-lg font-medium">{t("noResults")}</p>
          </motion.div>
        )}

        <div className="space-y-2">
          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            const colors = CATEGORY_COLORS[item.category] ?? { bg: "bg-stone", text: "text-ink-secondary" };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className={cn(
                  "bg-white border rounded-lg overflow-hidden transition-all duration-200",
                  isOpen ? "border-blue-action shadow-legal-sm" : "border-stone hover:border-blue-light"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className={cn(
                      "flex-shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      colors.bg, colors.text
                    )}>
                      {catLabel(item.category)}
                    </span>
                    <span className="text-body-md font-semibold text-ink group-hover:text-blue-deep transition-colors leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isOpen ? "bg-blue-deep text-white rotate-0" : "bg-cream text-ink-muted group-hover:bg-blue-pale group-hover:text-blue-deep"
                  )}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-stone/50 bg-cream/30">
                        <p className="text-body-md text-ink-secondary leading-relaxed ml-[calc(theme(spacing.2)+theme(spacing.16))]">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-12 p-8 bg-blue-deep rounded-lg text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, #FAFAFA 0%, transparent 60%)"
          }} />
          <MessageSquare className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <p className="text-heading-sm text-white font-bold mb-2">{t("cta")}</p>
          <p className="text-body-sm text-white/60 mb-6">{t("ctaSubtitle")}</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-deep font-semibold rounded-lg hover:bg-blue-pale transition-colors shadow-sm">
            {t("bookConsultation")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
