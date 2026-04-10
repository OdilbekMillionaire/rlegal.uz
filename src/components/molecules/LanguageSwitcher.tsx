"use client";

import { useLocale } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

const LOCALES: { code: Locale; label: string; shortLabel: string }[] = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "ru", label: "Русский", shortLabel: "RU" },
  { code: "uz", label: "O'zbek", shortLabel: "UZ" },
  { code: "uz-cyrl", label: "Ўзбек", shortLabel: "ЎЗ" },
  { code: "kaa", label: "Qaraqalpaq", shortLabel: "QQ" },
];

const LOCALE_CODES = ["en", "ru", "uz", "uz-cyrl", "kaa"];

interface LanguageSwitcherProps {
  variant?: "pills" | "dropdown";
  className?: string;
}

export function LanguageSwitcher({
  variant = "pills",
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const nextPathname = useNextPathname(); // e.g. "/ru/services" — includes locale

  const handleLocaleChange = (newLocale: Locale) => {
    // Strip the current locale segment from the front of the path
    const segments = nextPathname.split("/").filter(Boolean);
    const withoutLocale = LOCALE_CODES.includes(segments[0])
      ? "/" + segments.slice(1).join("/")
      : nextPathname;
    const cleanPath = withoutLocale || "/";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(cleanPath as any, { locale: newLocale });
  };

  if (variant === "pills") {
    return (
      <div className={cn("flex items-center gap-0.5 flex-wrap", className)}>
        {LOCALES.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLocaleChange(l.code)}
            className={cn(
              "px-2 py-1 rounded-sm text-[11px] font-semibold tracking-wide transition-all duration-200",
              locale === l.code
                ? "bg-blue-deep text-white"
                : "text-ink-muted hover:text-ink hover:bg-stone"
            )}
            title={l.label}
          >
            {l.shortLabel}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value as Locale)}
      className={cn(
        "bg-white border border-stone text-ink-secondary text-xs rounded-sm px-2 py-1",
        "focus:outline-none focus:border-blue-action cursor-pointer",
        className
      )}
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
