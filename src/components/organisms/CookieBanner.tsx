"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Cookie } from "lucide-react";
import { Link as NextLink } from "@/i18n/navigation";

const COOKIE_KEY = "rl_cookie_consent";

export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-stone shadow-legal-lg"
        >
          <div className="site-container py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3 max-w-2xl">
              <Cookie className="w-5 h-5 text-blue-action flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-ink-secondary leading-relaxed">
                {t("message")}{" "}
                <NextLink href="/privacy" className="text-blue-action hover:text-blue-deep underline transition-colors">
                  {t("learnMore")}
                </NextLink>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 text-body-sm font-medium text-ink-muted hover:text-ink border border-stone hover:border-stone-dark rounded-sm transition-all duration-200"
              >
                {t("decline")}
              </button>
              <button
                onClick={accept}
                className="btn-primary text-body-sm px-5 py-2"
              >
                {t("accept")}
              </button>
              <button
                onClick={decline}
                className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-stone transition-colors ml-1"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-ink-muted" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
