import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/molecules/ServiceCard";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/lib/constants";

export function ServicesGrid() {
  const t = useTranslations("services");

  return (
    <section className="section-pad bg-cream border-b border-stone">
      <div className="site-container">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <SectionLabel className="mb-4">{t("title")}</SectionLabel>
          <h2
            className="font-sans font-bold text-ink mb-5 leading-tight"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.025em" }}
          >
            {t("title")}
          </h2>
          <div className="w-10 h-0.5 bg-blue-deep mb-5" />
          <p className="text-body-lg text-ink-secondary leading-relaxed">{t("subtitle")}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.slug}
              service={service}
              title={t(`${service.slug}.title`)}
              description={t(`${service.slug}.description`)}
              learnMore={t("learnMore")}
              index={i}
            />
          ))}
        </div>

        {/* View all */}
        <div className="mt-12 flex justify-start">
          <Link href="/services" className="btn-outline">
            {t("viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
