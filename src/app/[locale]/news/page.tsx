import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { NewsPageClient } from "./NewsPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("newsTitle"),
    description: "Stay current with Uzbekistan legal and business news in English and Russian.",
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  return <NewsPageClient locale={locale} />;
}
