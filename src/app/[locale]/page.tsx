import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/organisms/HeroSection";
import { TrustBar } from "@/components/organisms/TrustBar";
import { AchievementCarousel } from "@/components/organisms/AchievementCarousel";
import { ServicesGrid } from "@/components/organisms/ServicesGrid";
import { ValueCalculator } from "@/components/organisms/ValueCalculator";
import { RegulatoryPulse } from "@/components/organisms/RegulatoryPulse";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { NewsletterSection } from "@/components/organisms/NewsletterSection";
import { CTASection } from "@/components/organisms/CTASection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDesc"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDesc"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            name: "R-Legal Practice",
            description:
              "Premier law firm in Uzbekistan specializing in corporate law, FDI, litigation, and international trade.",
            url: "https://rlegalpractice.uz",
            telephone: "+998908250878",
            email: "rlegalpractice@gmail.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tashkent",
              addressCountry: "UZ",
            },
            areaServed: ["UZ", "Worldwide"],
            serviceType: [
              "Corporate Law",
              "Foreign Direct Investment",
              "Contract Law",
              "Labor Law",
              "Litigation and Arbitration",
            ],
            priceRange: "$$$$",
          }),
        }}
      />

      <HeroSection />
      <TrustBar />
      <AchievementCarousel />
      <ServicesGrid />
      <ValueCalculator />
      <RegulatoryPulse />
      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
