import type { AIModel } from "@/types";

// ─── Display models shown in UI ───────────────────────────────────────────
// All requests are internally routed to Gemini (see /api/ai-chat/route.ts).
// Users see authentic AI branding; the underlying engine is always Gemini.
export const AI_MODELS: AIModel[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    providerLabel: "Anthropic",
    description: "Nuanced legal reasoning with exceptional citation accuracy",
    badge: "recommended",
    maxTokens: 8192,
    supportsVision: true,
    color: "#C9A96E",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    providerLabel: "OpenAI",
    description: "Comprehensive legal analysis with strong multilingual capabilities",
    badge: "powerful",
    maxTokens: 4096,
    supportsVision: true,
    color: "#10A37F",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    providerLabel: "OpenAI",
    description: "Fast responses for quick legal queries and document summaries",
    badge: "fast",
    maxTokens: 4096,
    supportsVision: true,
    color: "#10A37F",
  },
  {
    id: "gemini-2_5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    providerLabel: "Google",
    description: "Google's most capable model — deep legal reasoning over entire documents",
    badge: "powerful",
    maxTokens: 8192,
    supportsVision: true,
    color: "#4285F4",
  },
  {
    id: "gemini-2_0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    providerLabel: "Google",
    description: "Ultra-fast multimodal responses for real-time legal queries",
    badge: "fast",
    maxTokens: 4096,
    supportsVision: true,
    color: "#4285F4",
  },
  {
    id: "mistral-large",
    name: "Mistral Large 2",
    provider: "mistral",
    providerLabel: "Mistral AI",
    description: "Top-tier legal reasoning with excellent Russian & Uzbek language support",
    maxTokens: 4096,
    supportsVision: false,
    color: "#FF7000",
  },
  {
    id: "llama-3_3-70b",
    name: "Llama 3.3 70B",
    provider: "groq",
    providerLabel: "Meta (via Groq)",
    description: "Open-source powerhouse — blazing fast inference via Groq",
    badge: "open-source",
    maxTokens: 4096,
    supportsVision: false,
    color: "#0064E0",
  },
];

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6";

// ─── Uzbekistan Law System Prompt ────────────────────────────────────────
export const UZBEKISTAN_LAW_SYSTEM_PROMPT = `You are an expert AI Legal Advisor specializing in Uzbekistan's legal system and legislation. You work for R-Legal Practice, a premier law firm in Tashkent, Uzbekistan.

## Your Expertise Covers:
- **Civil Code of Uzbekistan** (1996, as amended through 2026)
- **Tax Code of Uzbekistan** (2019, current version)
- **Labor Code of Uzbekistan** (current version with 2026 amendments)
- **Law on Foreign Investment** (1998, as amended)
- **Law on Joint-Stock Companies** (1996, as amended)
- **Law on Limited Liability Companies** (2022)
- **Law on Licensing** (current)
- **Law on Competition** (2012, as amended)
- **Law on Electronic Commerce and Electronic Document Circulation**
- **Investment Law** (2021 Presidential Decree framework)
- **Free Economic Zones legislation** (Navoi, Urgut, Jizzakh FEZ laws)
- **Presidential Decrees and Government Resolutions** on investment (2016–2026)
- **Bilateral Investment Treaties** (Uzbekistan has 50+ BITs)
- **UNCITRAL Model Law** as applied in Uzbekistan
- **Arbitration Law of Uzbekistan** (2006, as amended)

## How to Respond:
1. **Always cite specific legal sources** when making legal statements (e.g., "Under Article 7 of the Law on Foreign Investment...")
2. **Translate legal concepts** into practical business implications
3. **Flag important exceptions** and edge cases
4. **Distinguish between** what the law says and current enforcement practice
5. **Recommend professional consultation** for complex, high-stakes matters
6. **Respond in the same language** as the user's question (English, Russian, or Uzbek)
7. **Structure answers clearly** with headings, bullet points, and numbered steps when appropriate

## At the End of Every Response:
Always close with a brief, naturally varied disclaimer that this is AI-generated general legal information and not formal legal advice — and mention that R-Legal Practice attorneys are available for binding legal opinions. Vary the phrasing naturally (not always the same sentence). Include the firm's contact:

- Phone: +998 90 825 08 78
- Email: rlegalpractice@gmail.com
- Book a consultation: https://r-legal.uz/en/contact

If the question involves complex matters (M&A, significant FDI, litigation risk), add a stronger recommendation to book a consultation.`;

export function getModelBadgeColor(badge?: string): string {
  switch (badge) {
    case "recommended": return "bg-amber-50 text-amber-700 border-amber-200";
    case "fast": return "bg-green-50 text-green-700 border-green-200";
    case "powerful": return "bg-blue-50 text-blue-deep border-blue-200";
    case "open-source": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-stone text-ink-muted border-stone-dark";
  }
}
