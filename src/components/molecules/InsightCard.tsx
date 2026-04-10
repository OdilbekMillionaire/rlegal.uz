"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import type { Insight, Locale } from "@/types";
import { useLocale } from "next-intl";

interface InsightCardProps {
  insight: Insight;
  readMoreLabel: string;
  impactLabel: string;
  actionLabel: string;
  index: number;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  regulatory: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  investment: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  labor: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  corporate: { bg: "bg-blue-pale", text: "text-blue-deep", border: "border-blue-light/40" },
  arbitration: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  tax: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

export function InsightCard({ insight, readMoreLabel, impactLabel, actionLabel, index }: InsightCardProps) {
  const locale = useLocale() as Locale;

  const title =
    locale === "ru" ? insight.titleRu
    : locale === "uz" || locale === "uz-cyrl" ? insight.titleUz
    : insight.title;

  const summary =
    locale === "ru" ? insight.summaryRu
    : locale === "uz" || locale === "uz-cyrl" ? insight.summaryUz
    : insight.summary;

  const businessImpact =
    locale === "ru" ? (insight.businessImpactRu ?? insight.businessImpact)
    : locale === "uz" || locale === "uz-cyrl" ? (insight.businessImpactUz ?? insight.businessImpact)
    : insight.businessImpact;

  const recommendedAction =
    locale === "ru" ? (insight.recommendedActionRu ?? insight.recommendedAction)
    : locale === "uz" || locale === "uz-cyrl" ? (insight.recommendedActionUz ?? insight.recommendedAction)
    : insight.recommendedAction;

  const cat = CATEGORY_STYLES[insight.category] || CATEGORY_STYLES.regulatory;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="card h-full flex flex-col overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-blue-deep w-0 group-hover:w-full transition-all duration-500" />

        <div className="p-7 flex flex-col flex-1">
          {/* Category + date */}
          <div className="flex items-center justify-between mb-5">
            <span className={cn("tag", cat.bg, cat.text, cat.border)}>
              {insight.category}
            </span>
            <div className="flex items-center gap-1.5 text-ink-muted text-caption" suppressHydrationWarning>
              <Clock className="w-3 h-3" />
              {insight.readingTime} min · <span suppressHydrationWarning>{formatDate(insight.publishedAt, locale)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-heading-sm font-bold text-ink mb-3 line-clamp-2 group-hover:text-blue-deep transition-colors duration-300 leading-snug">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-body-md text-ink-secondary leading-relaxed mb-5 line-clamp-3">
            {summary}
          </p>

          {/* Impact */}
          <div className="flex items-start gap-2.5 mb-3 bg-amber-50 border border-amber-100 rounded-sm p-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-caption font-bold text-amber-700 uppercase tracking-wider mb-1">{impactLabel}</p>
              <p className="text-body-sm text-ink-secondary leading-relaxed">{businessImpact}</p>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-start gap-2.5 mb-5 bg-green-50 border border-green-100 rounded-sm p-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-caption font-bold text-green-700 uppercase tracking-wider mb-1">{actionLabel}</p>
              <p className="text-body-sm text-ink-secondary leading-relaxed">{recommendedAction}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {insight.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-caption text-ink-muted bg-cream px-2 py-0.5 rounded-sm border border-stone">
                #{tag}
              </span>
            ))}
          </div>

          {/* Read more */}
          <div className="mt-auto">
            <Link href={`/insights/${insight.slug}`} className="btn-ghost text-body-sm">
              {readMoreLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
