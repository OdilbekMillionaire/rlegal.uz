"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Globe, Sun, Moon, Monitor, Bell, Mail, Shield, Check, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "O'zbek (Latin)", flag: "🇺🇿" },
  { code: "uz-cyrl", label: "Ўзбек (Кирил)", flag: "🇺🇿" },
  { code: "kaa", label: "Qaraqalpaq", flag: "🏳️" },
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTheme(localStorage.getItem("rl_theme") ?? "light");
    setNotifications(localStorage.getItem("rl_notifications") === "true");
    setNewsletter(localStorage.getItem("rl_newsletter") === "true");
  }, []);

  const handleSave = () => {
    localStorage.setItem("rl_theme", theme);
    localStorage.setItem("rl_notifications", String(notifications));
    localStorage.setItem("rl_newsletter", String(newsletter));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLangChange = (code: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace("/" as any, { locale: code });
  };

  const clearCookies = () => {
    localStorage.removeItem("rl_cookie_consent");
    window.location.reload();
  };

  const themes = [
    { key: "light", label: t("themeLight"), icon: Sun },
    { key: "dark", label: t("themeDark"), icon: Moon },
    { key: "system", label: t("themeSystem"), icon: Monitor },
  ] as const;

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">{t("title")}</SectionLabel>
          <h1 className="font-sans font-bold text-ink mb-3" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.025em" }}>
            {t("title")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-4" />
          <p className="text-body-lg text-ink-secondary">{t("subtitle")}</p>
        </div>
      </section>

      <div className="site-container py-12 max-w-2xl">
        <div className="space-y-6">

          {/* Language */}
          <div className="bg-white border border-stone rounded-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-sm bg-blue-pale flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-deep" />
              </div>
              <div>
                <h2 className="text-body-md font-bold text-ink">{t("language")}</h2>
                <p className="text-caption text-ink-muted">{t("languageDesc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm border text-left transition-all duration-200",
                    locale === lang.code
                      ? "border-blue-action bg-blue-pale text-blue-deep font-semibold"
                      : "border-stone bg-white text-ink-secondary hover:border-stone-dark"
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-body-md">{lang.label}</span>
                  {locale === lang.code && <Check className="w-4 h-4 ml-auto text-blue-action" />}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white border border-stone rounded-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-sm bg-blue-pale flex items-center justify-center">
                <Sun className="w-4 h-4 text-blue-deep" />
              </div>
              <div>
                <h2 className="text-body-md font-bold text-ink">{t("theme")}</h2>
                <p className="text-caption text-ink-muted">Visual appearance preference</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-sm border transition-all duration-200",
                    theme === key
                      ? "border-blue-action bg-blue-pale text-blue-deep"
                      : "border-stone bg-white text-ink-secondary hover:border-stone-dark"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-body-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-stone rounded-sm p-7 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-sm bg-blue-pale flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-deep" />
              </div>
              <h2 className="text-body-md font-bold text-ink">Notifications</h2>
            </div>

            {[
              { key: "notifications", label: t("notifications"), desc: t("notificationsDesc"), icon: Bell, value: notifications, setter: setNotifications },
              { key: "newsletter", label: t("newsletter"), desc: t("newsletterDesc"), icon: Mail, value: newsletter, setter: setNewsletter },
            ].map(({ key, label, desc, icon: Icon, value, setter }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-body-md font-semibold text-ink">{label}</p>
                    <p className="text-body-sm text-ink-muted">{desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setter(!value)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
                    value ? "bg-blue-deep" : "bg-stone-dark"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300",
                    value ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>

          {/* Privacy / Cookies */}
          <div className="bg-white border border-stone rounded-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-sm bg-blue-pale flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-deep" />
              </div>
              <div>
                <h2 className="text-body-md font-bold text-ink">{t("privacy")}</h2>
                <p className="text-caption text-ink-muted">{t("privacyDesc")}</p>
              </div>
            </div>
            <button
              onClick={clearCookies}
              className="flex items-center gap-2 px-4 py-2.5 border border-stone rounded-sm text-body-sm text-ink-secondary hover:border-stone-dark hover:text-ink transition-all"
            >
              <Cookie className="w-4 h-4" /> {t("manageCookies")}
            </button>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="btn-primary px-8 py-3">
              {t("save")}
            </button>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-body-sm text-green-700 font-semibold"
              >
                <Check className="w-4 h-4" /> {t("saved")}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
