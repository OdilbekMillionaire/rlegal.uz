import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  ComplexityLevel,
  CalculatorInput,
  CalculatorResult,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  locale: string = "en"
): string {
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    en: "en-US",
    ru: "ru-RU",
    uz: "uz-UZ",
    "uz-cyrl": "uz-Cyrl-UZ",
  };
  return date.toLocaleDateString(localeMap[locale] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

// ─── Calculator Logic ────────────────────────────────────────────────────
const COMPLEXITY_WEIGHTS = {
  investmentType: {
    fdi: 8,
    jv: 7,
    ma: 9,
    contract: 4,
    dispute: 8,
  },
  sector: {
    energy: 9,
    finance: 8,
    tech: 6,
    "real-estate": 7,
    manufacturing: 6,
    retail: 4,
  },
  timeline: {
    urgent: 10,
    standard: 5,
    planned: 3,
    strategic: 2,
  },
  highRiskCountries: [
    "US",
    "EU",
    "UK",
    "CN",
    "JP",
    "KR",
    "DE",
    "FR",
    "CH",
    "SG",
  ],
};

export function calculateComplexity(
  input: CalculatorInput
): CalculatorResult {
  const { investmentType, sector, originCountry, timeline } = input;

  const typeScore =
    COMPLEXITY_WEIGHTS.investmentType[investmentType] || 5;
  const sectorScore = COMPLEXITY_WEIGHTS.sector[sector] || 5;
  const timelineScore = COMPLEXITY_WEIGHTS.timeline[timeline] || 5;
  const countryScore = COMPLEXITY_WEIGHTS.highRiskCountries.includes(
    originCountry.toUpperCase()
  )
    ? 8
    : 5;

  const rawScore =
    typeScore * 0.3 +
    sectorScore * 0.25 +
    timelineScore * 0.25 +
    countryScore * 0.2;

  const score = Math.min(Math.round(rawScore * 10), 100);

  let level: ComplexityLevel;
  if (score < 40) level = "low";
  else if (score < 60) level = "medium";
  else if (score < 80) level = "high";
  else level = "critical";

  const timelineMap: Record<typeof timeline, string> = {
    urgent: "4–8 weeks (expedited)",
    standard: "2–4 months",
    planned: "4–6 months",
    strategic: "6–12 months",
  };

  const considerationsMap: Partial<Record<typeof investmentType, string[]>> = {
    fdi: [
      "Investment registration with Ministry of Investment",
      "Currency repatriation rights confirmation",
      "Bilateral Investment Treaty review",
      "Sector-specific licensing requirements",
    ],
    jv: [
      "Shareholder agreement structuring",
      "Capital contribution structure",
      "Governance and voting mechanics",
      "Exit and dispute mechanisms",
    ],
    ma: [
      "Due diligence on target entity",
      "Regulatory approval timeline",
      "Asset vs. share deal analysis",
      "Post-acquisition integration plan",
    ],
    contract: [
      "Governing law selection",
      "Dispute resolution clause",
      "Force majeure provisions",
      "Uzbek language requirements",
    ],
    dispute: [
      "Court vs. arbitration analysis",
      "Evidence gathering and preservation",
      "Enforcement jurisdiction strategy",
      "Timeline and cost assessment",
    ],
  };

  const serviceMap: Partial<
    Record<typeof investmentType, CalculatorResult["recommendedServices"]>
  > = {
    fdi: ["international", "corporate"],
    jv: ["corporate", "contract"],
    ma: ["corporate", "international"],
    contract: ["contract"],
    dispute: ["litigation"],
  };

  return {
    level,
    score,
    estimatedTimeline: timelineMap[timeline],
    keyConsiderations:
      considerationsMap[investmentType] || [],
    recommendedServices: serviceMap[investmentType] || ["corporate"],
  };
}

// ─── Streaming helpers ────────────────────────────────────────────────────
export function createStreamingResponse(stream: ReadableStream) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
