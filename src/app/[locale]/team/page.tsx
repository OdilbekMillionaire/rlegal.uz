import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TeamCard } from "@/components/molecules/TeamCard";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CTASection } from "@/components/organisms/CTASection";
import { TEAM_MEMBERS } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle") };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });

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

      {/* Team Grid */}
      <section className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard
              key={member.id}
              member={member}
              yearsExpLabel={t("yearsExp")}
              admittedLabel={t("admittedIn")}
              languagesLabel={t("languages")}
              index={i}
            />
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
}
