import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceCard } from "@/components/molecules/ServiceCard";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CTASection } from "@/components/organisms/CTASection";
import { SERVICES } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("servicesTitle") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">{t("title")}</SectionLabel>
          <h1
            className="font-sans font-bold text-ink mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}
          >
            {t("title")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-5" />
          <p className="text-body-lg text-ink-secondary max-w-2xl">{t("subtitle")}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.slug}
              service={service}
              title={t(`${service.slug}.title` as Parameters<typeof t>[0])}
              description={t(`${service.slug}.description` as Parameters<typeof t>[0])}
              learnMore={t("learnMore")}
              index={i}
            />
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
}
