"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { CaseStudy } from "@/types";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  challengeLabel: string;
  resultLabel: string;
  index: number;
  featured?: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  fdi: { label: "FDI", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  corporate: { label: "Corporate", bg: "bg-blue-pale", text: "text-blue-deep", border: "border-blue-light/40" },
  litigation: { label: "Litigation", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  labor: { label: "Labor", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  contract: { label: "Contract", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

export function CaseStudyCard({ caseStudy, challengeLabel, resultLabel, index, featured }: CaseStudyCardProps) {
  const cat = CATEGORY_STYLES[caseStudy.category] || CATEGORY_STYLES.corporate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className={cn("card h-full flex flex-col overflow-hidden", featured && "border-blue-light/60")}>
        {/* Blue top bar for featured */}
        {featured && <div className="h-1 bg-blue-deep" />}

        <div className="p-8 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("tag", cat.bg, cat.text, cat.border)}>{cat.label}</span>
              <span className="text-caption text-ink-muted">{caseStudy.sector}</span>
            </div>
            {caseStudy.dealValue && (
              <div className="flex-shrink-0 flex items-center gap-1.5 text-body-sm font-bold text-blue-deep bg-blue-pale border border-blue-light/40 px-3 py-1.5 rounded-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                {caseStudy.dealValue}
              </div>
            )}
          </div>

          {/* Client */}
          <p className="text-caption text-ink-muted uppercase tracking-wider font-semibold mb-4">
            {caseStudy.clientType}
          </p>

          {/* Challenge */}
          <div className="mb-4">
            <h4 className="text-caption font-bold text-blue-action uppercase tracking-wider mb-2">{challengeLabel}</h4>
            <p className="text-body-md text-ink-secondary leading-relaxed line-clamp-3">{caseStudy.challenge}</p>
          </div>

          {/* Result */}
          <div className="mb-6 pl-4 border-l-2 border-blue-deep">
            <h4 className="text-caption font-bold text-blue-action uppercase tracking-wider mb-2">{resultLabel}</h4>
            <p className="text-body-md text-ink leading-relaxed line-clamp-2 font-medium">{caseStudy.result}</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {caseStudy.metrics.slice(0, 4).map((m) => (
              <div key={m.label} className="bg-cream border border-stone rounded-sm p-3 text-center">
                <div className="text-heading-sm font-bold text-blue-deep">{m.value}</div>
                <div className="text-caption text-ink-muted mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-auto">
            <Link href={`/case-studies/${caseStudy.slug}`} className="btn-ghost text-body-sm">
              Read Full Case
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
