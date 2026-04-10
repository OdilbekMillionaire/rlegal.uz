"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { cn } from "@/lib/utils";
import { TESTIMONIALS } from "@/lib/constants";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const items = TESTIMONIALS;

  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActive((i) => (i === items.length - 1 ? 0 : i + 1));

  const current = items[active];

  return (
    <section className="section-pad bg-white border-b border-stone">
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <SectionLabel className="mb-4">{t("title")}</SectionLabel>
            <h2
              className="font-sans font-bold text-ink mb-5 leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.025em" }}
            >
              {t("title")}
            </h2>
            <div className="w-10 h-0.5 bg-blue-deep mb-6" />
            <p className="text-body-lg text-ink-secondary leading-relaxed mb-8">{t("subtitle")}</p>

            {/* Dots */}
            <div className="flex items-center gap-2 mb-6">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    i === active ? "w-8 h-2 bg-blue-deep" : "w-2 h-2 bg-stone-dark hover:bg-blue-light"
                  )}
                />
              ))}
            </div>

            {/* Nav */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-sm border border-stone hover:border-blue-action flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-sm border border-stone hover:border-blue-action flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right — testimonial card */}
          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-cream border border-stone rounded-sm p-8 relative"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className="w-8 h-8 text-blue-pale mb-4 fill-blue-pale" />

                <blockquote className="text-body-lg text-ink leading-relaxed mb-6 font-medium">
                  &ldquo;{current.text}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4 pt-4 border-t border-stone">
                  <div className="w-12 h-12 rounded-sm bg-blue-deep flex items-center justify-center text-white font-bold text-heading-sm flex-shrink-0">
                    {current.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-body-md font-bold text-ink">{current.name}</p>
                    <p className="text-body-sm text-ink-secondary">{current.role}</p>
                    <p className="text-caption text-blue-action font-semibold">{current.country}</p>
                  </div>
                </div>

                {/* Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-deep rounded-l-sm" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
