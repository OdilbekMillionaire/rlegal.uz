"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/Logo";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { SearchOverlay } from "@/components/organisms/SearchOverlay";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_LINKS = [
  { key: "services", href: "/services" as const },
  { key: "caseStudies", href: "/case-studies" as const },
  { key: "team", href: "/team" as const },
  { key: "insights", href: "/insights" as const },
  { key: "news", href: "/news" as const },
  { key: "aiAdvisor", href: "/ai-advisor" as const },
  { key: "contact", href: "/contact" as const },
] as const;

const MORE_LINKS = [
  { key: "caseLaw", href: "/case-law" as const },
  { key: "faq", href: "/faq" as const },
  { key: "resources", href: "/resources" as const },
  { key: "tools", href: "/tools" as const },
  { key: "settings", href: "/settings" as const },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white border-b border-stone shadow-legal-sm"
            : "bg-cream/95 backdrop-blur-sm border-b border-stone/60"
        )}
      >
        {/* Top utility bar */}
        <div className="hidden lg:block border-b border-stone/50 bg-cream-dark/40">
          <div className="site-container flex items-center justify-between h-9">
            <a
              href="tel:+998908250878"
              className="flex items-center gap-1.5 text-body-sm text-ink-secondary hover:text-blue-action transition-colors duration-200"
            >
              <Phone className="w-3 h-3" />
              +998 90 825 08 78
            </a>
            <div className="flex items-center gap-4">
              <a
                href="mailto:rlegalpractice@gmail.com"
                className="text-body-sm text-ink-muted hover:text-blue-action transition-colors duration-200"
              >
                rlegalpractice@gmail.com
              </a>
              <div className="h-3.5 w-px bg-stone-dark" />
              <LanguageSwitcher variant="pills" />
            </div>
          </div>
        </div>

        {/* Main nav row */}
        <div className="site-container">
          <div className="flex items-center justify-between h-[60px] gap-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="md" theme="light" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(({ key, href }) => {
                const active = isActive(href);
                if (key === "aiAdvisor") {
                  return (
                    <Link key={key} href={href}
                      className={cn(
                        "relative flex items-center gap-1.5 mx-1.5 px-3.5 py-2 rounded-full text-body-sm font-bold tracking-wide transition-all duration-300 overflow-hidden",
                        "bg-gradient-to-r from-[#0A1628] via-[#1a3a6b] to-[#0057FF] text-white",
                        "shadow-[0_0_18px_rgba(0,87,255,0.45)] hover:shadow-[0_0_28px_rgba(0,87,255,0.7)]",
                        "hover:scale-105 hover:brightness-110",
                        active && "ring-2 ring-blue-action ring-offset-1"
                      )}>
                      {/* shimmer sweep */}
                      <motion.span
                        animate={{ x: ["-120%", "220%"] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 1.5 }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none"
                      />
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 shadow-[0_0_6px_#4ade80]"
                      />
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="relative z-10">{t(key)}</span>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={key}
                    href={href}
                    className={cn(
                      "relative px-3 py-2 text-body-sm font-medium transition-colors duration-200 rounded-sm",
                      active ? "text-blue-deep" : "text-ink-secondary hover:text-ink"
                    )}
                  >
                    {t(key)}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-deep rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-body-sm font-medium text-ink-secondary hover:text-ink rounded-sm transition-colors",
                    moreOpen && "text-ink"
                  )}
                >
                  More <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", moreOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 w-44 bg-white border border-stone rounded-sm shadow-legal-md overflow-hidden z-50"
                    >
                      {MORE_LINKS.map(({ key, href }) => (
                        <Link
                          key={key}
                          href={href}
                          className="block px-4 py-3 text-body-sm text-ink-secondary hover:bg-blue-pale hover:text-blue-deep transition-colors"
                        >
                          {t(key)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right: search + CTA + mobile */}
            <div className="flex items-center gap-2">
              <SearchOverlay />
              <LanguageSwitcher variant="pills" className="lg:hidden" />
              <Link
                href="/contact"
                className="hidden sm:inline-flex btn-primary text-body-sm px-4 py-2.5"
              >
                {t("consultation")}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-sm border border-stone hover:border-stone-dark transition-colors"
                aria-label={t("menu")}
              >
                {mobileOpen ? <X className="w-4 h-4 text-ink" /> : <Menu className="w-4 h-4 text-ink" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-white pt-[108px] lg:hidden overflow-y-auto"
          >
            <div className="site-container py-6 flex flex-col gap-1">
              {[...NAV_LINKS, ...MORE_LINKS].map(({ key, href }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "block px-4 py-3.5 text-heading-sm font-medium rounded-sm transition-all duration-200",
                      isActive(href)
                        ? "text-blue-deep bg-blue-pale"
                        : "text-ink-secondary hover:text-ink hover:bg-cream-dark",
                      key === "aiAdvisor" && "text-blue-action"
                    )}
                  >
                    {t(key)}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-4 pt-5 border-t border-stone flex flex-col gap-3">
                <Link href="/contact" className="btn-primary text-center">
                  {t("consultation")}
                </Link>
                <div className="flex justify-center">
                  <LanguageSwitcher variant="pills" />
                </div>
                <a href="tel:+998908250878"
                  className="flex items-center justify-center gap-2 text-body-sm text-ink-secondary py-2">
                  <Phone className="w-4 h-4" /> +998 90 825 08 78
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
