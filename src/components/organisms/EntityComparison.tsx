"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X, Info, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type EntityType = "llc" | "jsc" | "branch" | "rep";

const ENTITY_COLORS: Record<EntityType, { bg: string; border: string; badge: string; text: string }> = {
  llc:    { bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-deep text-white",    text: "text-blue-deep" },
  jsc:    { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-700 text-white",   text: "text-purple-700" },
  branch: { bg: "bg-amber-50",  border: "border-amber-200",  badge: "bg-amber-700 text-white",    text: "text-amber-700" },
  rep:    { bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-700 text-white",    text: "text-green-700" },
};

const ENTITY_IDS: EntityType[] = ["llc", "jsc", "branch", "rep"];

type CellValue = string | boolean | "partial";

interface CompareRow {
  key: string;
  values: Record<EntityType, CellValue>;
}

// Boolean/partial values are universal — only string values need translation (handled via cellStrings in JSON)
const COMPARE_ROWS: CompareRow[] = [
  { key: "minCapital",       values: { llc: "minCapital.llc",       jsc: "minCapital.jsc",       branch: "minCapital.branch",       rep: "minCapital.rep" } },
  { key: "foreignOwnership", values: { llc: true,                   jsc: true,                   branch: true,                      rep: true } },
  { key: "legalPersonality", values: { llc: true,                   jsc: true,                   branch: false,                     rep: false } },
  { key: "liability",        values: { llc: true,                   jsc: true,                   branch: false,                     rep: false } },
  { key: "canTrade",         values: { llc: true,                   jsc: true,                   branch: true,                      rep: false } },
  { key: "formationTime",    values: { llc: "formationTime.llc",    jsc: "formationTime.jsc",    branch: "formationTime.branch",    rep: "formationTime.rep" } },
  { key: "taxRate",          values: { llc: "taxRate.llc",          jsc: "taxRate.jsc",          branch: "taxRate.branch",          rep: "taxRate.rep" } },
  { key: "canHireForeign",   values: { llc: true,                   jsc: true,                   branch: true,                      rep: "partial" } },
  { key: "bankAccount",      values: { llc: true,                   jsc: true,                   branch: true,                      rep: "partial" } },
  { key: "fezEligible",      values: { llc: true,                   jsc: true,                   branch: false,                     rep: false } },
  { key: "registrationBody", values: { llc: "registrationBody.llc", jsc: "registrationBody.jsc", branch: "registrationBody.branch", rep: "registrationBody.rep" } },
  { key: "complexity",       values: { llc: "complexity.llc",       jsc: "complexity.jsc",       branch: "complexity.branch",       rep: "complexity.rep" } },
];

export function EntityComparison() {
  const t = useTranslations("entityComparison");
  const rowLabels = t.raw("rowLabels") as Record<string, { label: string; info?: string }>;
  const entities = t.raw("entities") as Record<EntityType, { name: string; local: string; short: string }>;
  const cellStrings = t.raw("cellStrings") as Record<string, Record<EntityType, string>>;
  const partialLabel = t("partialLabel");

  const [selected, setSelected] = useState<EntityType[]>(["llc", "branch"]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleEntity = (id: EntityType) => {
    setSelected((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((e) => e !== id) : prev) : [...prev, id]
    );
  };

  const visibleEntities = ENTITY_IDS.filter((e) => selected.includes(e));

  function CellDisplay({ value, rowKey, entityId }: { value: CellValue; rowKey: string; entityId: EntityType }) {
    if (value === true) return <Check className="w-4 h-4 text-green-600 mx-auto" />;
    if (value === false) return <X className="w-4 h-4 text-red-400 mx-auto" />;
    if (value === "partial") return <span className="text-amber-600 text-[11px] font-semibold">{partialLabel}</span>;
    // String key — look up in cellStrings
    const strVal = cellStrings[rowKey]?.[entityId] ?? String(value).split(".").pop() ?? "";
    return <span className="text-xs text-ink-secondary leading-snug">{strVal}</span>;
  }

  return (
    <section className="bg-white border-t border-b border-stone py-16">
      <div className="site-container">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-deep text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3 h-3" /> {t("badge")}
          </span>
          <h2 className="font-sans font-bold text-ink mb-3" style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}>
            {t("title")}
          </h2>
          <p className="text-ink-secondary text-body-md max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Entity toggles */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {ENTITY_IDS.map((id) => {
            const colors = ENTITY_COLORS[id];
            const entity = entities[id];
            const isSelected = selected.includes(id);
            return (
              <button key={id} onClick={() => toggleEntity(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                  isSelected ? `${colors.badge} border-transparent shadow-sm` : "bg-white border-stone text-ink-secondary hover:border-stone-dark"
                )}>
                {entity.short}
                {entity.local && <span className="opacity-70 text-xs">({entity.local})</span>}
              </button>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-xl border border-stone shadow-legal-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cream border-b border-stone">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-muted uppercase tracking-wider w-48">{t("feature")}</th>
                {visibleEntities.map((id) => {
                  const colors = ENTITY_COLORS[id];
                  const entity = entities[id];
                  return (
                    <th key={id} className={cn("px-4 py-3 text-center", colors.bg)}>
                      <span className={cn("inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded", colors.badge)}>
                        {entity.short}
                      </span>
                      <p className="text-[10px] text-ink-muted mt-1 font-normal normal-case tracking-normal">{entity.name}</p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => {
                const rl = rowLabels[row.key] ?? { label: row.key };
                return (
                  <motion.tr key={row.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn("border-b border-stone/50 last:border-0 transition-colors", i % 2 === 0 ? "bg-white" : "bg-cream/30")}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-ink">{rl.label}</span>
                        {rl.info && (
                          <button onClick={() => setExpandedRow(expandedRow === row.key ? null : row.key)}
                            className="text-ink-muted hover:text-blue-deep transition-colors">
                            <Info className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {expandedRow === row.key && rl.info && (
                          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-[10px] text-blue-deep mt-1 overflow-hidden">
                            {rl.info}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </td>
                    {visibleEntities.map((entityId) => {
                      const colors = ENTITY_COLORS[entityId];
                      return (
                        <td key={entityId} className={cn("px-4 py-3 text-center", colors.bg, "bg-opacity-30")}>
                          <CellDisplay value={row.values[entityId]} rowKey={row.key} entityId={entityId} />
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-ink-secondary mb-4">{t("ctaText")}</p>
          <Link href="/contact" className="btn-primary inline-flex">
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
