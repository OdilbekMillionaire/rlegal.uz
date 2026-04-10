"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Phone, Bot } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CTASection() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-blue-deep relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Right accent */}
      <div className="absolute top-0 right-0 w-64 h-full bg-blue-mid/20 pointer-events-none" />

      <div className="site-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="overline text-blue-light mb-5">{t("contact.title")}</p>

          <h2
            className="font-sans font-bold text-white mb-6 leading-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}
          >
            {t("contact.title")}
          </h2>

          <div className="w-10 h-0.5 bg-blue-light mb-7" />

          <p className="text-body-lg text-white/70 leading-relaxed mb-10">
            {t("contact.subtitle")}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-deep font-semibold text-body-md rounded-sm hover:bg-blue-pale transition-colors duration-200"
            >
              {t("nav.consultation")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+998908250878"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold text-body-md rounded-sm hover:bg-white/10 transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              +998 90 825 08 78
            </a>
          </div>

          {/* AI nudge */}
          <div className="border-t border-white/15 pt-8">
            <p className="text-body-sm text-white/40 mb-3">
              Not ready to call? Get instant answers from our AI Legal Advisor.
            </p>
            <Link
              href="/ai-advisor"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
            >
              <Bot className="w-4 h-4" />
              {t("nav.aiAdvisor")} — Free & Instant →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
