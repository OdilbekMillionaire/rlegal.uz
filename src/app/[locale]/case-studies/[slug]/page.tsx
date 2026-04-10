import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASE_STUDIES } from "@/lib/constants";
import { ArrowRight, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";
import { SectionLabel } from "@/components/atoms/SectionLabel";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.clientType} — ${cs.sector} | R-Legal Practice`,
    description: cs.challenge.slice(0, 160),
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) notFound();

  const t = await getTranslations({ locale, namespace: "caseStudies" });
  const tBreadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const categoryColor: Record<string, string> = {
    fdi: "text-blue-deep bg-blue-pale border-blue-light/50",
    corporate: "text-purple-700 bg-purple-50 border-purple-200",
    litigation: "text-red-700 bg-red-50 border-red-200",
    labor: "text-amber-700 bg-amber-50 border-amber-200",
  };

  const otherCases = CASE_STUDIES.filter((c) => c.slug !== slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <Breadcrumb
            locale={locale}
            homeLabel={tBreadcrumb("home")}
            items={[
              { label: tNav("caseStudies"), href: `/${locale}/case-studies` },
              { label: cs.clientType },
            ]}
          />
          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 text-caption font-bold uppercase tracking-wider rounded-sm border ${categoryColor[cs.category] ?? "text-ink-secondary bg-stone border-stone"}`}>
                {cs.category}
              </span>
              <span className="px-3 py-1 text-caption font-bold uppercase tracking-wider text-ink-secondary bg-stone rounded-sm">
                {cs.sector}
              </span>
            </div>
            <SectionLabel className="mb-4">{t("title")}</SectionLabel>
            <h1
              className="font-sans font-bold text-ink mb-4 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.025em" }}
            >
              {cs.clientType}
            </h1>
            <div className="w-10 h-0.5 bg-blue-deep mb-5" />
            <div className="flex flex-wrap gap-6 text-body-sm text-ink-secondary">
              {cs.dealValue && <span><span className="font-bold text-ink">{cs.dealValue}</span> deal value</span>}
              <span><span className="font-bold text-ink">{cs.timeline}</span> timeline</span>
            </div>
          </div>
        </div>
      </section>

      <div className="site-container py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cs.metrics.map((m) => (
                <div key={m.label} className="bg-white border border-stone rounded-sm p-4 text-center">
                  <div className="text-heading-md font-bold text-blue-deep mb-1">{m.value}</div>
                  <div className="text-caption text-ink-muted">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Challenge */}
            <div className="bg-white border border-stone rounded-sm p-7">
              <h2 className="flex items-center gap-3 text-heading-md font-bold text-ink mb-4">
                <div className="w-8 h-8 rounded-sm bg-red-50 flex items-center justify-center">
                  <Target className="w-4 h-4 text-red-600" />
                </div>
                {t("challenge")}
              </h2>
              <p className="text-body-md text-ink-secondary leading-relaxed">{cs.challenge}</p>
            </div>

            {/* Solution */}
            <div className="bg-white border border-stone rounded-sm p-7">
              <h2 className="flex items-center gap-3 text-heading-md font-bold text-ink mb-4">
                <div className="w-8 h-8 rounded-sm bg-blue-pale flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-blue-deep" />
                </div>
                {t("solution")}
              </h2>
              <p className="text-body-md text-ink-secondary leading-relaxed">{cs.solution}</p>
            </div>

            {/* Result */}
            <div className="bg-white border-l-4 border-blue-deep border border-stone rounded-sm p-7">
              <h2 className="flex items-center gap-3 text-heading-md font-bold text-ink mb-4">
                <div className="w-8 h-8 rounded-sm bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                {t("result")}
              </h2>
              <p className="text-body-md text-ink-secondary leading-relaxed">{cs.result}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-blue-deep p-7 rounded-sm text-white sticky top-[130px]">
              <h3 className="text-heading-sm font-bold mb-3">Have a Similar Matter?</h3>
              <p className="text-body-sm text-white/70 mb-5">Our team handles complex cross-border transactions and disputes daily.</p>
              <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-deep font-semibold text-body-sm rounded-sm hover:bg-blue-pale transition-colors">
                Book Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* More cases */}
            {otherCases.length > 0 && (
              <div className="bg-white border border-stone rounded-sm p-6">
                <h3 className="text-body-md font-bold text-ink mb-4">More Case Studies</h3>
                <div className="space-y-4">
                  {otherCases.map((c) => (
                    <NextLink key={c.slug} href={`/case-studies/${c.slug}`}
                      className="block group">
                      <p className="text-body-sm font-semibold text-ink group-hover:text-blue-deep transition-colors">{c.clientType}</p>
                      <p className="text-caption text-ink-muted">{c.sector}</p>
                    </NextLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
