import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Linkedin, Send, Shield, Globe, Scale } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { Link } from "@/i18n/navigation";
import { CONTACT_INFO } from "@/lib/constants";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      {/* Top gradient accent bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="site-container pt-16 lg:pt-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/8">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Logo size="lg" theme="dark" className="mb-6" />
            <p className="text-body-md text-white/50 leading-relaxed max-w-xs mb-8">
              {t("footer.tagline")}
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-3 mb-7">
              {[
                { Icon: Phone, val: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, "")}` },
                { Icon: Mail, val: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                { Icon: MapPin, val: "Tashkent, Republic of Uzbekistan", href: undefined },
              ].map(({ Icon, val, href }) => (
                <div key={val} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white/6 border border-white/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gold/80" />
                  </div>
                  {href ? (
                    <a href={href} className="text-body-sm text-white/55 hover:text-white transition-colors duration-200">{val}</a>
                  ) : (
                    <span className="text-body-sm text-white/45">{val}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2">
              <a href={CONTACT_INFO.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm bg-white/6 border border-white/8 flex items-center justify-center hover:bg-blue-deep hover:border-blue-mid/60 transition-all duration-200 group">
                <Linkedin className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </a>
              <a href={CONTACT_INFO.socialLinks.telegram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm bg-white/6 border border-white/8 flex items-center justify-center hover:bg-blue-deep hover:border-blue-mid/60 transition-all duration-200 group">
                <Send className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.14em] mb-4">{t("footer.services")}</h4>
            <div className="w-5 h-px bg-gold mb-5" />
            <ul className="space-y-3">
              {[
                { label: t("services.corporate.title"), href: "/services/corporate" },
                { label: t("services.international.title"), href: "/services/international" },
                { label: t("services.contract.title"), href: "/services/contract" },
                { label: t("services.labor.title"), href: "/services/labor" },
                { label: t("services.litigation.title"), href: "/services/litigation" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as "/services/corporate"} className="text-body-sm text-white/45 hover:text-gold transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.14em] mb-4">{t("footer.company")}</h4>
            <div className="w-5 h-px bg-gold mb-5" />
            <ul className="space-y-3">
              {[
                { label: t("nav.faq"), href: "/faq" as const },
                { label: t("nav.resources"), href: "/resources" as const },
                { label: t("nav.contact"), href: "/contact" as const },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-body-sm text-white/45 hover:text-gold transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI + Credentials */}
          <div className="lg:col-span-2">
            {/* AI advisor highlight */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-deep/50 to-blue-deep/20 border border-blue-mid/25 mb-6">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{t("nav.aiAdvisor")}</span>
              </div>
              <p className="text-[11px] text-white/45 leading-relaxed mb-3">
                Instant Uzbekistan legal insights — powered by AI.
              </p>
              <Link href="/ai-advisor" className="inline-flex items-center gap-1 text-[11px] text-blue-light hover:text-white font-semibold transition-colors">
                Try free
                <span className="opacity-60">→</span>
              </Link>
            </div>

            {/* Credentials */}
            <div className="space-y-3">
              {[
                { Icon: Shield, label: "Bar Admitted", sub: "Uzbekistan" },
                { Icon: Globe, label: "50+ BITs", sub: "Treaty expertise" },
                { Icon: Scale, label: "FEZ Specialist", sub: "3 zones covered" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/8 flex-shrink-0 mt-0.5">
                    <Icon className="w-3 h-3 text-gold/70" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white/65 leading-none mb-0.5">{label}</p>
                    <p className="text-[10px] text-white/30">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/22">© {year} R-Legal Practice. {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="text-[11px] text-white/22 hover:text-white/50 transition-colors">{t("footer.privacy")}</Link>
            <span className="text-white/12">·</span>
            <Link href="/terms" className="text-[11px] text-white/22 hover:text-white/50 transition-colors">{t("footer.terms")}</Link>
            <span className="text-white/12">·</span>
            <Link href="/settings" className="text-[11px] text-white/22 hover:text-white/50 transition-colors">{t("nav.settings")}</Link>
            <span className="text-white/12">·</span>
            <span className="text-[11px] text-white/12">{t("footer.builtBy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
