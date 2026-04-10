"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, FileText, BarChart3, Book, Wrench, ArrowRight, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Link } from "@/i18n/navigation";
import { EntityComparison } from "@/components/organisms/EntityComparison";

type ResourceItem = { category: string; title: string; description: string; pages: number; free: boolean; url?: string };

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  guides:      BookOpen,
  templates:   FileText,
  legislation: Book,
  reports:     BarChart3,
  tools:       Wrench,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  guides:      { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  templates:   { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  legislation: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  reports:     { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  tools:       { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200" },
};

export default function ResourcesPage() {
  const t = useTranslations("resources");

  const rawItems = t.raw("items") as ResourceItem[];
  const items: ResourceItem[] = Array.isArray(rawItems) ? rawItems : [];

  const categories = ["all", "guides", "legislation", "reports", "templates", "tools"] as const;
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() =>
    items.filter((item) => activeCategory === "all" || item.category === activeCategory),
    [items, activeCategory]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    items.forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
    return map;
  }, [items]);

  const catLabel = (cat: string): string => {
    if (cat === "all") return t("filterAll");
    try { return t(`filter${cat.charAt(0).toUpperCase() + cat.slice(1)}` as Parameters<typeof t>[0]); }
    catch { return cat; }
  };

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
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

      {/* Category filters */}
      <section className="bg-white border-b border-stone sticky top-[108px] z-30 shadow-sm">
        <div className="site-container py-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full border transition-all duration-200",
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
      </section>

      {/* Grid */}
      <section className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => {
            const Icon = CATEGORY_ICONS[item.category] ?? FileText;
            const colors = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.guides;
            const hasLink = Boolean(item.url);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="card flex flex-col group h-full"
              >
                {/* Top accent line */}
                <div className={cn("h-0.5 w-0 group-hover:w-full transition-all duration-500", colors.bg.replace("bg-", "bg-"))} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      colors.bg, "group-hover:scale-110"
                    )}>
                      <Icon className={cn("w-5 h-5", colors.text)} />
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                      item.free ? "text-green-700 bg-green-50 border-green-200" : "text-ink-muted bg-stone border-stone-dark"
                    )}>
                      {item.free ? t("downloadFree") : "Premium"}
                    </span>
                  </div>

                  {/* Category tag */}
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", colors.text)}>
                    {item.category}
                  </span>

                  <h2 className="text-heading-sm font-bold text-ink mb-3 leading-snug group-hover:text-blue-deep transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-body-sm text-ink-secondary leading-relaxed flex-1 mb-5">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone">
                    {item.pages > 0 && (
                      <span className="text-caption text-ink-muted">{item.pages} {t("pages")}</span>
                    )}
                    {hasLink ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1.5 text-body-sm font-semibold transition-colors ml-auto",
                          item.free ? "text-blue-action hover:text-blue-deep" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t("visitSource")}
                      </a>
                    ) : (
                      <span className="text-caption text-ink-muted ml-auto">{t("readOnline")}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tools CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-blue-deep flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-ink font-bold text-sm">Legal Deadline Calculator</p>
              <p className="text-ink-secondary text-xs">Calculate statutes of limitations, filing deadlines, and notice periods under Uzbekistan law</p>
            </div>
          </div>
          <Link href="/tools" className="flex items-center gap-1.5 px-4 py-2 bg-blue-deep hover:bg-blue-action text-white font-semibold text-sm rounded-lg transition-colors flex-shrink-0">
            Open Tool <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-6 p-8 bg-ink rounded-lg text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #0057FF 0%, transparent 50%)" }} />
          <p className="text-white font-bold text-heading-sm mb-2">{t("cta")}</p>
          <p className="text-white/60 text-body-md mb-6">{t("ctaSubtitle")}</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-ink font-semibold rounded-lg hover:bg-cream transition-colors shadow-sm">
            {t("requestResearch")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Entity Comparison */}
      <EntityComparison />
    </main>
  );
}
