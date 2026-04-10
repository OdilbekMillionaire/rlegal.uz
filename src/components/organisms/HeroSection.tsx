"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/atoms/SectionLabel";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export function HeroSection() {
  const t = useTranslations("hero");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section className="relative min-h-screen bg-cream flex flex-col justify-center overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#151414 1px, transparent 1px), linear-gradient(90deg, #151414 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Blue accent block — top right */}
      <div className="absolute top-0 right-0 w-1/3 h-2 bg-blue-deep" />

      {/* Spline 3D animation — right side */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden xl:block z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/60 to-transparent z-10 pointer-events-none" />
        <iframe
          src="https://my.spline.design/cybermannequin-3be7LYzIdWSh5iPgvK7ogact/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full opacity-80"
          title="3D Legal AI Visualization"
        />
      </div>

      {/* Main content */}
      <div className="site-container relative z-10 pt-40 pb-24">
        <div className="max-w-5xl xl:max-w-[52%]">
          {/* Overline */}
          <motion.div {...FADE_UP(0)} className="mb-7">
            <SectionLabel>{t("badge")}</SectionLabel>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...FADE_UP(0.08)}
            className="font-sans font-bold text-ink mb-6 leading-[1.02] tracking-[-0.03em]"
            style={{ fontSize: "clamp(44px, 7vw, 84px)" }}
          >
            {t("headline1")}
            <br />
            <span className="text-blue-deep">{t("headline2")}</span>
          </motion.h1>

          {/* Divider */}
          <motion.div {...FADE_UP(0.14)} className="mb-7">
            <div className="w-14 h-0.5 bg-blue-deep" />
          </motion.div>

          {/* Sub */}
          <motion.p
            {...FADE_UP(0.18)}
            className="text-body-lg text-ink-secondary max-w-2xl leading-relaxed mb-10 text-balance"
          >
            {t("subheadline")}
          </motion.p>

          {/* CTAs */}
          <motion.div {...FADE_UP(0.24)} className="flex flex-wrap gap-4 mb-14">
            <Link href="/contact" className="btn-primary">
              {t("cta1")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/case-studies" className="btn-outline">
              {t("cta2")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            {...FADE_UP(0.3)}
            className="flex items-stretch border-t border-stone/60 pt-8 gap-0"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col group pr-8${i > 0 ? " pl-8 border-l border-stone/60" : ""}`}
              >
                <div
                  className="font-sans font-bold text-blue-deep group-hover:text-blue-mid transition-colors duration-200 whitespace-nowrap"
                  style={{ fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
                >
                  {stat.value}
                </div>
                <div className="text-body-sm text-ink-muted font-medium leading-snug mt-2 whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-caption text-ink-muted tracking-[0.15em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-ink-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
