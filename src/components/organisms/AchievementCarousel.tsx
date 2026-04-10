"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import Link from "next/link";
import { ACHIEVEMENTS } from "@/lib/constants";
import type { Locale } from "@/types";

export function AchievementCarousel() {
  const t = useTranslations("achievements");
  const locale = useLocale() as Locale;
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % ACHIEVEMENTS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + ACHIEVEMENTS.length) % ACHIEVEMENTS.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [isPlaying, next]);

  const ach = ACHIEVEMENTS[current];
  const headline =
    locale === "ru" ? ach.headlineRu
    : locale === "uz" || locale === "uz-cyrl" ? ach.headlineUz
    : ach.headline;

  return (
    <section className="section-pad bg-white border-b border-stone">
      <div className="site-container">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <SectionLabel className="mb-4">{t("title")}</SectionLabel>
            <h2
              className="font-sans font-bold text-ink leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.025em" }}
            >
              {t("subtitle")}
            </h2>
            <div className="w-10 h-0.5 bg-blue-deep mt-5" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 border border-stone hover:border-stone-dark rounded-sm flex items-center justify-center text-ink-muted hover:text-ink transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={prev}
              className="w-9 h-9 border border-stone hover:border-stone-dark rounded-sm flex items-center justify-center text-ink-muted hover:text-ink transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 border border-stone hover:border-stone-dark rounded-sm flex items-center justify-center text-ink-muted hover:text-ink transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Featured slide */}
          <div className="lg:col-span-2 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-blue-deep rounded-sm p-10 md:p-14 min-h-[280px] flex flex-col justify-between"
              >
                <div>
                  {/* Tags */}
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-caption text-blue-light/70 tracking-[0.15em] uppercase font-semibold">
                      {ach.sector}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-caption text-blue-light/50">
                      {ach.clientOrigin}
                    </span>
                    {ach.dealValue && (
                      <span className="ml-auto flex items-center gap-1.5 text-body-sm font-bold text-white bg-white/10 px-3 py-1 rounded-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {ach.dealValue}
                      </span>
                    )}
                  </div>

                  {/* Headline */}
                  <h3
                    className="font-sans font-bold text-white leading-snug mb-8"
                    style={{ fontSize: "clamp(22px, 2.5vw, 30px)", letterSpacing: "-0.015em" }}
                  >
                    {headline}
                  </h3>
                </div>

                {/* CTA */}
                {ach.caseStudySlug && (
                  <Link
                    href={`/case-studies/${ach.caseStudySlug}`}
                    className="inline-flex items-center gap-2 text-body-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 group"
                  >
                    {t("viewCase")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side list */}
          <div className="flex flex-col gap-2">
            {ACHIEVEMENTS.map((a, i) => {
              const h =
                locale === "ru" ? a.headlineRu
                : locale === "uz" || locale === "uz-cyrl" ? a.headlineUz
                : a.headline;
              return (
                <button
                  key={a.id}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={cn(
                    "text-left p-4 rounded-sm border transition-all duration-250",
                    i === current
                      ? "border-blue-deep bg-blue-pale"
                      : "border-stone hover:border-stone-dark bg-white"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                      i === current ? "bg-blue-deep" : "bg-stone-dark"
                    )} />
                    <p className={cn(
                      "text-body-sm leading-relaxed line-clamp-2",
                      i === current ? "text-ink font-medium" : "text-ink-muted"
                    )}>
                      {h}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-8">
          {ACHIEVEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === current ? "w-7 bg-blue-deep" : "w-1.5 bg-stone-dark hover:bg-ink-muted"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
