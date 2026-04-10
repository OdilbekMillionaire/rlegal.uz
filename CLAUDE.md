# R-LEGAL PRACTICE — Claude Code Standards (Oxforder LLC)

## Project Overview
Premium B2B legal platform for a top-tier Uzbekistan law firm targeting international investors, entrepreneurs, and corporate clients.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Shadcn/UI · next-intl · Framer Motion · Anthropic SDK

---

## Architecture Principles

### Folder Structure (Atomic Design)
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n routing (en | ru | uz | uz-cyrl)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── services/
│   │   ├── case-studies/
│   │   ├── team/
│   │   ├── insights/
│   │   ├── ai-advisor/
│   │   └── contact/
│   └── api/                # Route handlers (server-side only)
├── components/
│   ├── atoms/              # Smallest UI units (Button, Badge, Icon)
│   ├── molecules/          # Composed units (NavLink, ServiceCard)
│   ├── organisms/          # Full sections (Header, HeroSection)
│   ├── templates/          # Page-level layout wrappers
│   └── ui/                 # Shadcn/UI primitives (auto-generated)
├── i18n/                   # next-intl configuration
├── lib/                    # Utilities, constants, AI model config
└── types/                  # Shared TypeScript types
```

### i18n — Language Routing
- Locales: `en` (English), `ru` (Russian), `uz` (Uzbek Latin), `uz-cyrl` (Uzbek Cyrillic)
- Default locale: `en`
- URL pattern: `/en/services`, `/ru/services`, `/uz/services`, `/uz-cyrl/services`
- Translations: `messages/{locale}.json` — flat key structure
- **Never hardcode UI strings** — always use `useTranslations()` or `getTranslations()`

### AI Legal Advisor
- Architecture: server-side streaming via `/api/ai-chat` route handler
- Supported models: Claude claude-sonnet-4-6 (default), GPT-4o, Gemini 1.5 Pro, Mistral Large, Llama 3 (via Groq)
- System prompt injected server-side (Uzbekistan legislation context)
- API keys stored in `.env.local` — never exposed to client

### Color Palette (Enforce Strictly)
```
Navy:    #0A1628  (bg-navy-800)
Gold:    #C9A96E  (text-gold / bg-gold)
White:   #FAFAFA  (bg-white)
Black:   #0D0D0D  (bg-black)
```

---

## Coding Standards

### TypeScript
- Strict mode enabled — no `any` types
- Prefer `interface` for component props, `type` for unions/utilities
- All server components are async by default
- Client components use `"use client"` directive at top

### Components
- One component per file, named export preferred
- Props interface directly above component
- Server Components by default; opt into client only for interactivity
- Animation via Framer Motion `motion.*` components with `viewport={{ once: true }}`

### Tailwind
- Use semantic color aliases (`gold`, `navy`) not hex values
- Responsive-first: mobile → `md:` → `lg:` → `xl:`
- `cn()` utility for conditional classes (clsx + tailwind-merge)

### API Routes
- All AI calls must be server-side (protect API keys)
- Return `ReadableStream` for streaming responses
- Validate all inputs with Zod before processing

---

## SEO Standards
- `generateMetadata()` on every page — locale-aware
- `hreflang` alternate links in root layout
- `next-sitemap` generates sitemaps per locale
- OG images via `opengraph-image.tsx` in each route segment
- Schema.org `LegalService` JSON-LD on homepage and service pages

---

## Performance Targets
- LCP < 2.5s on 4G mobile
- CLS < 0.1
- FID < 100ms
- All images: `next/image` with proper `sizes` prop
- Route segments: static where possible, dynamic only for AI/form routes

---

## Contact Info (Never Change)
- Phone: +998 90 825 08 78
- Email: rlegalpractice@gmail.com

---

*Maintained by Oxforder LLC — Last updated: April 2026*
