import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AIAdvisorChat } from "@/components/organisms/AIAdvisorChat";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("aiAdvisorTitle"),
    description:
      "AI-powered legal advisor trained on Uzbekistan legislation. Get instant answers about corporate law, FDI, labor code, and arbitration.",
  };
}

export default async function AIAdvisorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AIAdvisorChat />;
}
