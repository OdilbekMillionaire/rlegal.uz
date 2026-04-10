import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { CookieBanner } from "@/components/organisms/CookieBanner";
import { BackToTop } from "@/components/atoms/BackToTop";
import { Toaster } from "sonner";
import type { Locale } from "@/types";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const hreflangAlternates = Object.fromEntries(
    routing.locales.map((l) => [
      l === "uz-cyrl" ? "uz-Cyrl" : l,
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://rlegalpractice.uz"}/${l}`,
    ])
  );

  return {
    alternates: {
      languages: {
        ...hreflangAlternates,
        "x-default": `${process.env.NEXT_PUBLIC_SITE_URL || "https://rlegalpractice.uz"}/en`,
      },
    },
    other: {
      "google-site-verification": "",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Required for next-intl static rendering — sets locale context for all server components
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CookieBanner />
      <BackToTop />
      <Toaster
        theme="light"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid #e0dfdf",
            color: "#151414",
          },
        }}
      />
    </NextIntlClientProvider>
  );
}
