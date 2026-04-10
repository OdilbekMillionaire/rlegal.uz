import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/constants";
import { CheckCircle, ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: `${t(`${slug}.title` as Parameters<typeof t>[0])} | R-Legal Practice`,
    description: t(`${slug}.description` as Parameters<typeof t>[0]),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: "services" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tBreadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const tPage = await getTranslations({ locale, namespace: "servicesPage" });

  const title = t(`${slug}.title` as Parameters<typeof t>[0]);
  const description = t(`${slug}.description` as Parameters<typeof t>[0]);
  const otherServices = SERVICES.filter((s) => s.slug !== slug);
  const whyPoints = tPage.raw("whyPoints") as string[];

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <Breadcrumb
            locale={locale}
            homeLabel={tBreadcrumb("home")}
            items={[
              { label: tNav("services"), href: `/${locale}/services` },
              { label: title },
            ]}
          />
          <div className="mt-6">
            <SectionLabel className="mb-4">{t("title")}</SectionLabel>
            <h1
              className="font-sans font-bold text-ink mb-4 leading-tight"
              style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}
            >
              {title}
            </h1>
            <div className="w-10 h-0.5 bg-blue-deep mb-5" />
            <p className="text-body-lg text-ink-secondary max-w-2xl leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      <div className="site-container py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Features */}
            <div>
              <h2 className="text-heading-lg font-bold text-ink mb-6">{tPage("whatWeCover")}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 p-4 bg-white border border-stone rounded-sm hover:border-blue-light transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-action flex-shrink-0 mt-0.5" />
                    <span className="text-body-md text-ink-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-heading-lg font-bold text-ink mb-5">{tPage("keyAreas")}</h2>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-blue-pale text-blue-deep text-body-sm font-semibold rounded-sm border border-blue-light/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Why R-Legal */}
            <div className="p-8 bg-white border border-stone rounded-sm">
              <h2 className="text-heading-md font-bold text-ink mb-4">
                {tPage("whyRlegal")} {title}?
              </h2>
              <div className="space-y-3">
                {whyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-action mt-2 flex-shrink-0" />
                    <p className="text-body-md text-ink-secondary">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* CTA box */}
            <div className="bg-blue-deep p-7 rounded-sm text-white sticky top-[130px]">
              <h3 className="text-heading-sm font-bold mb-3">{tPage("getExpertAdvice")}</h3>
              <p className="text-body-sm text-white/70 mb-5 leading-relaxed">
                {tPage("scheduleConsult")}
              </p>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-deep font-semibold text-body-sm rounded-sm hover:bg-blue-pale transition-colors mb-3"
              >
                {tNav("consultation")} <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+998908250878"
                className="flex items-center justify-center gap-2 w-full py-3 border border-white/30 text-white text-body-sm font-medium rounded-sm hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" /> +998 90 825 08 78
              </a>
            </div>

            {/* Other services */}
            <div className="bg-white border border-stone rounded-sm p-6">
              <h3 className="text-body-md font-bold text-ink mb-4">{tPage("otherPracticeAreas")}</h3>
              <div className="space-y-2">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}` as `/services/${string}`}
                    className="flex items-center justify-between gap-2 py-2.5 px-3 rounded-sm text-body-sm text-ink-secondary hover:bg-blue-pale hover:text-blue-deep transition-all group"
                  >
                    {t(`${s.slug}.title` as Parameters<typeof t>[0])}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
