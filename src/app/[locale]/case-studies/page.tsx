"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CaseStudyCard } from "@/components/molecules/CaseStudyCard";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CTASection } from "@/components/organisms/CTASection";
import { CASE_STUDIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CaseCategory } from "@/types";

type FilterKey = "all" | CaseCategory;

export default function CaseStudiesPage() {
  const t = useTranslations("caseStudies");
  const [filter, setFilter] = useState<FilterKey>("all");

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "corporate", label: t("filterCorporate") },
    { key: "fdi", label: t("filterFDI") },
    { key: "labor", label: t("filterLabor") },
    { key: "litigation", label: t("filterLitigation") },
  ];

  const filtered =
    filter === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((c) => c.category === filter);

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

      {/* Filter + Grid */}
      <section className="site-container py-12">
        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200",
                filter === key
                  ? "bg-blue-deep text-white border-blue-deep"
                  : "bg-white text-ink-secondary border-stone hover:border-blue-deep hover:text-blue-deep"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((cs, i) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              challengeLabel={t("challenge")}
              resultLabel={t("result")}
              index={i}
              featured={cs.featured}
            />
          ))}
        </motion.div>
      </section>

      <CTASection />
    </main>
  );
}
