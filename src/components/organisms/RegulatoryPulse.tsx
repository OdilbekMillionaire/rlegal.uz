import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { InsightCard } from "@/components/molecules/InsightCard";
import { Link } from "@/i18n/navigation";
import { INSIGHTS } from "@/lib/constants";

export function RegulatoryPulse() {
  const t = useTranslations("pulse");
  const featured = INSIGHTS.filter((i) => i.featured).slice(0, 3);

  return (
    <section className="section-pad bg-cream border-b border-stone">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
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
          <Link href="/insights" className="btn-ghost text-body-sm flex-shrink-0">
            {t("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((insight, i) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              readMoreLabel={t("readMore")}
              impactLabel={t("impact")}
              actionLabel={t("action")}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
