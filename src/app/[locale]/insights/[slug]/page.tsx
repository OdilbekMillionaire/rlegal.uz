import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Clock, Tag, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { INSIGHTS } from "@/lib/constants";
import type { Locale } from "@/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return INSIGHTS.flatMap((insight) =>
    (["en", "ru", "uz", "uz-cyrl", "kaa"] as Locale[]).map((locale) => ({
      locale,
      slug: insight.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const insight = INSIGHTS.find((i) => i.slug === slug);
  if (!insight) return {};
  const title =
    locale === "ru" ? insight.titleRu :
    locale.startsWith("uz") || locale === "kaa" ? insight.titleUz :
    insight.title;
  return { title, description: insight.summary };
}

const CATEGORY_COLORS: Record<string, string> = {
  regulatory: "bg-blue-50 text-blue-deep border-blue-200",
  investment: "bg-gold/10 text-amber-700 border-gold/30",
  labor: "bg-green-50 text-green-700 border-green-200",
  corporate: "bg-purple-50 text-purple-700 border-purple-200",
  tax: "bg-red-50 text-red-700 border-red-200",
  arbitration: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default async function InsightDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const insight = INSIGHTS.find((i) => i.slug === slug);
  if (!insight) notFound();

  const t = await getTranslations({ locale, namespace: "pulse" });

  const title =
    locale === "ru" ? insight.titleRu :
    locale.startsWith("uz") || locale === "kaa" ? insight.titleUz :
    insight.title;

  const summary =
    locale === "ru" ? insight.summaryRu :
    locale.startsWith("uz") || locale === "kaa" ? insight.summaryUz :
    insight.summary;

  const businessImpact =
    locale === "ru" ? (insight.businessImpactRu ?? insight.businessImpact) :
    locale.startsWith("uz") || locale === "kaa" ? (insight.businessImpactUz ?? insight.businessImpact) :
    insight.businessImpact;

  const recommendedAction =
    locale === "ru" ? (insight.recommendedActionRu ?? insight.recommendedAction) :
    locale.startsWith("uz") || locale === "kaa" ? (insight.recommendedActionUz ?? insight.recommendedAction) :
    insight.recommendedAction;

  const publishedDate = new Date(insight.publishedAt).toLocaleDateString(
    locale === "ru" ? "ru-RU" : locale.startsWith("uz") ? "uz-UZ" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const categoryColor = CATEGORY_COLORS[insight.category] ?? "bg-stone text-ink-muted border-stone-dark";

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-10 max-w-3xl mx-auto">
          <Link href="/insights"
            className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t("backToInsights")}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryColor}`}>
              {insight.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <Clock className="w-3.5 h-3.5" /> {insight.readingTime} min · {publishedDate}
            </span>
          </div>

          <h1 className="font-sans font-bold text-ink mb-4 leading-tight"
            style={{ fontSize: "clamp(24px, 3.5vw, 42px)", letterSpacing: "-0.02em" }}>
            {title}
          </h1>

          <div className="flex flex-wrap gap-2 mt-4">
            {insight.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-[11px] text-ink-muted bg-stone border border-stone-dark rounded-full px-2.5 py-0.5">
                <Tag className="w-2.5 h-2.5" /> #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="site-container py-10 max-w-3xl mx-auto">
        {/* Summary */}
        <div className="bg-white rounded-xl border border-stone p-6 mb-6 shadow-legal-sm">
          <p className="text-body-md text-ink-secondary leading-relaxed">{summary}</p>
        </div>

        {/* Business Impact */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wider">{t("impact")}</h2>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">{businessImpact}</p>
        </div>

        {/* Recommended Action */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h2 className="text-sm font-bold text-green-700 uppercase tracking-wider">{t("action")}</h2>
          </div>
          <p className="text-sm text-green-800 leading-relaxed">{recommendedAction}</p>
        </div>

        {/* CTA */}
        <div className="bg-navy-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-1">{t("ctaTitle")}</p>
            <p className="text-white/70 text-xs">{t("ctaSubtitle")}</p>
          </div>
          <Link href="/contact" className="flex-shrink-0 px-5 py-2.5 bg-gold text-navy-800 font-bold text-sm rounded-lg hover:bg-gold/90 transition-colors">
            {t("ctaBtn")}
          </Link>
        </div>
      </section>
    </main>
  );
}
