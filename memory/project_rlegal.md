---
name: R-Legal Practice Platform
description: Full-stack Next.js 15 legal platform for Uzbekistan law firm — build status, structure, and key decisions
type: project
---

Production-ready Next.js 15 platform built at /d/R-legal. Build passes clean.

**Tech stack:** Next.js 15 (App Router) · TypeScript strict · Tailwind CSS · Shadcn/UI · next-intl · Framer Motion · Anthropic/OpenAI/Gemini/Mistral/Groq SDKs

**Locales:** EN / RU / UZ (Latin) / UZ-Cyrl (Cyrillic) — routing at /en/, /ru/, /uz/, /uz-cyrl/

**Key pages:** Home, Services (5), Case Studies, Team, Insights, AI Advisor, Contact

**AI Advisor:** Full streaming chat at /ai-advisor with 7 AI model options (Claude, GPT-4o, Gemini, Mistral, Llama via Groq). API route at /api/ai-chat. System prompt includes Uzbekistan law corpus.

**Why:** Built for R-Legal Practice law firm in Tashkent, Uzbekistan targeting B2B/international investors.

**How to apply:** When continuing this project, note that next-intl Link is type-strict — dynamic routes (/case-studies/[slug], etc.) use next/link directly. All AI API keys go in .env.local (see .env.local.example).
