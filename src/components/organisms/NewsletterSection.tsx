"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, CheckCircle, Mail } from "lucide-react";
import { SectionLabel } from "@/components/atoms/SectionLabel";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate submission (no backend endpoint yet)
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="section-pad bg-blue-deep relative overflow-hidden">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="site-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <Mail className="w-5 h-5 text-blue-light" />
              <SectionLabel className="!text-blue-light">{t("title")}</SectionLabel>
            </div>

            <h2
              className="font-sans font-bold text-white mb-5 leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.025em" }}
            >
              {t("title")}
            </h2>

            <div className="w-10 h-0.5 bg-blue-light mx-auto mb-6" />

            <p className="text-body-lg text-white/70 leading-relaxed mb-8">
              {t("subtitle")}
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  required
                  className="flex-1 px-4 py-3.5 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all text-body-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-white text-blue-deep font-semibold text-body-md rounded-sm hover:bg-blue-pale transition-all flex items-center gap-2 justify-center disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-blue-deep/30 border-t-blue-deep rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {t("button")}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
                <p className="text-body-lg text-white font-semibold">{t("success")}</p>
              </motion.div>
            )}

            <p className="text-body-sm text-white/40 mt-4">{t("disclaimer")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
