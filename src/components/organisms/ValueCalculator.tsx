"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calculator, ChevronRight, ArrowRight, AlertCircle, CheckCircle, Zap, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateComplexity } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Link } from "@/i18n/navigation";
import type { InvestmentType, Sector, Timeline, ComplexityLevel, CalculatorInput } from "@/types";

const COMPLEXITY: Record<ComplexityLevel, { color: string; bg: string; border: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  low:      { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", text: "Low Complexity", icon: CheckCircle },
  medium:   { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", text: "Medium Complexity", icon: AlertCircle },
  high:     { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", text: "High Complexity", icon: Zap },
  critical: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", text: "Critical Complexity", icon: Flame },
};

type Step = 0 | 1 | 2 | 3;

export function ValueCalculator() {
  const t = useTranslations("calculator");
  const [step, setStep] = useState<Step>(0);
  const [input, setInput] = useState<Partial<CalculatorInput>>({});
  const [result, setResult] = useState<ReturnType<typeof calculateComplexity> | null>(null);

  const INVESTMENT: { key: InvestmentType; emoji: string }[] = [
    { key: "fdi", emoji: "🌐" }, { key: "jv", emoji: "🤝" },
    { key: "ma", emoji: "🏢" }, { key: "contract", emoji: "📄" }, { key: "dispute", emoji: "⚖️" },
  ];
  const SECTORS: { key: Sector; emoji: string }[] = [
    { key: "tech", emoji: "💻" }, { key: "energy", emoji: "⚡" },
    { key: "real-estate", emoji: "🏗️" }, { key: "finance", emoji: "💰" },
    { key: "manufacturing", emoji: "🏭" }, { key: "retail", emoji: "🛒" },
  ];
  const TIMELINES: { key: Timeline; emoji: string }[] = [
    { key: "urgent", emoji: "🔥" }, { key: "standard", emoji: "📅" },
    { key: "planned", emoji: "🗓️" }, { key: "strategic", emoji: "🎯" },
  ];
  const COUNTRIES = ["Germany","USA","UAE","UK","China","South Korea","France","Turkey","Russia","Kazakhstan","Other"];

  const handleCalc = () => {
    if (input.investmentType && input.sector && input.originCountry && input.timeline) {
      setResult(calculateComplexity(input as CalculatorInput));
      setStep(3);
    }
  };

  return (
    <section className="section-pad bg-white border-b border-stone">
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div>
            <SectionLabel className="mb-4">{t("title")}</SectionLabel>
            <h2
              className="font-sans font-bold text-ink mb-5 leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.025em" }}
            >
              {t("title")}
            </h2>
            <div className="w-10 h-0.5 bg-blue-deep mb-6" />
            <p className="text-body-lg text-ink-secondary leading-relaxed mb-10">{t("subtitle")}</p>

            <div className="space-y-4">
              {(["instant", "personalised", "timeline", "privacy"] as const).map((key, i) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xl w-8 flex-shrink-0">
                    {["⚡", "📋", "⏱️", "🔒"][i]}
                  </span>
                  <span className="text-body-md text-ink-secondary">{t(`features.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right calculator */}
          <div className="bg-cream border border-stone rounded-sm overflow-hidden">
            {/* Progress */}
            {step < 3 && (
              <div className="h-1 bg-stone">
                <div
                  className="h-full bg-blue-deep transition-all duration-500 ease-snappy"
                  style={{ width: `${((step + 1) / 3) * 100}%` }}
                />
              </div>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 0 */}
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                    <p className="overline mb-1">Step 1 / 3</p>
                    <h3 className="text-heading-md font-bold text-ink mb-6">{t("step1")}</h3>
                    <div className="flex flex-col gap-2">
                      {INVESTMENT.map(({ key, emoji }) => (
                        <button
                          key={key}
                          onClick={() => { setInput((p) => ({ ...p, investmentType: key })); setStep(1); }}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-sm border text-left transition-all duration-200",
                            input.investmentType === key
                              ? "border-blue-deep bg-blue-pale"
                              : "border-stone bg-white hover:border-blue-light hover:bg-blue-pale/50"
                          )}
                        >
                          <span className="text-lg">{emoji}</span>
                          <span className="text-body-md font-medium text-ink">{t(`investmentType.${key}`)}</span>
                          <ChevronRight className="w-4 h-4 text-ink-muted ml-auto" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                    <p className="overline mb-1">Step 2 / 3</p>
                    <h3 className="text-heading-md font-bold text-ink mb-6">{t("step2")}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {SECTORS.map(({ key, emoji }) => (
                        <button
                          key={key}
                          onClick={() => { setInput((p) => ({ ...p, sector: key })); setStep(2); }}
                          className={cn(
                            "flex items-center gap-2 p-4 rounded-sm border text-left transition-all duration-200",
                            input.sector === key
                              ? "border-blue-deep bg-blue-pale"
                              : "border-stone bg-white hover:border-blue-light"
                          )}
                        >
                          <span className="text-lg">{emoji}</span>
                          <span className="text-body-sm font-medium text-ink">{t(`sector.${key}`)}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setStep(0)} className="text-body-sm text-ink-muted hover:text-ink transition-colors">← Back</button>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                    <p className="overline mb-1">Step 3 / 3</p>
                    <h3 className="text-heading-md font-bold text-ink mb-6">{t("step3")} & {t("step4")}</h3>

                    <div className="mb-5">
                      <label className="block text-body-sm font-semibold text-ink-secondary mb-2">{t("step3")}</label>
                      <select
                        value={input.originCountry || ""}
                        onChange={(e) => setInput((p) => ({ ...p, originCountry: e.target.value }))}
                        className="form-input"
                      >
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="mb-7">
                      <label className="block text-body-sm font-semibold text-ink-secondary mb-2">{t("step4")}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {TIMELINES.map(({ key, emoji }) => (
                          <button
                            key={key}
                            onClick={() => setInput((p) => ({ ...p, timeline: key }))}
                            className={cn(
                              "flex items-center gap-2 p-3 rounded-sm border text-body-sm transition-all duration-200",
                              input.timeline === key
                                ? "border-blue-deep bg-blue-pale font-medium text-ink"
                                : "border-stone bg-white text-ink-secondary hover:border-blue-light"
                            )}
                          >
                            <span>{emoji}</span>
                            {t(`timeline.${key}`)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3 text-body-sm">← Back</button>
                      <button
                        onClick={handleCalc}
                        disabled={!input.originCountry || !input.timeline}
                        className={cn("flex-1 py-3 text-body-sm rounded-sm font-semibold transition-all duration-200",
                          input.originCountry && input.timeline ? "btn-primary" : "bg-stone text-ink-muted cursor-not-allowed"
                        )}
                      >
                        {t("calculate")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Result */}
                {step === 3 && result && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    {(() => {
                      const cfg = COMPLEXITY[result.level];
                      const Icon = cfg.icon;
                      return (
                        <>
                          <div className="flex items-center justify-center mb-6">
                            <div className={cn("w-28 h-28 rounded-sm border-2 flex items-center justify-center", cfg.bg, cfg.border)}>
                              <div className="text-center">
                                <div className={cn("text-3xl font-bold font-sans", cfg.color)}>{result.score}</div>
                                <div className="text-caption text-ink-muted">score</div>
                              </div>
                            </div>
                          </div>

                          <div className="text-center mb-6">
                            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-semibold text-body-sm mb-2", cfg.bg, cfg.border, cfg.color)}>
                              <Icon className="w-4 h-4" />
                              {cfg.text}
                            </div>
                            <p className="text-body-sm text-ink-muted">Est. timeline: {result.estimatedTimeline}</p>
                          </div>

                          <div className="mb-6 bg-cream border border-stone rounded-sm p-4">
                            <p className="text-caption font-bold text-ink uppercase tracking-wider mb-3">Key Considerations</p>
                            <ul className="space-y-1.5">
                              {result.keyConsiderations.map((c) => (
                                <li key={c} className="flex items-start gap-2 text-body-sm text-ink-secondary">
                                  <span className="text-blue-action mt-0.5 flex-shrink-0">›</span>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="text-caption text-ink-muted text-center mb-5">{t("disclaimer")}</p>

                          <div className="flex flex-col gap-2">
                            <Link href="/contact" className="btn-primary justify-center">
                              {t("cta")} <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button onClick={() => { setStep(0); setInput({}); setResult(null); }} className="text-body-sm text-ink-muted hover:text-ink text-center py-2 transition-colors">
                              Start Over
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
