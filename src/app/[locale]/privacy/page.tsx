import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SectionLabel } from "@/components/atoms/SectionLabel";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: `${t("privacy")} | R-Legal Practice` };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "footer" });
  const tp = await getTranslations({ locale, namespace: "privacyPage" });

  const sections = tp.raw("sections") as { title: string; body: string }[];

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">Legal</SectionLabel>
          <h1
            className="font-sans font-bold text-ink mb-3"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.025em" }}
          >
            {t("privacy")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-4" />
          <p className="text-body-md text-ink-muted">{tp("lastUpdated")}</p>
        </div>
      </section>

      <div className="site-container py-12 max-w-3xl">
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="bg-white border border-stone rounded-sm p-6">
              <h2 className="text-heading-sm font-bold text-ink mb-3">{section.title}</h2>
              <p className="text-body-md text-ink-secondary leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
