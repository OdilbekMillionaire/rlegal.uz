// ─── Locales ───────────────────────────────────────────────────────────────
export type Locale = "en" | "ru" | "uz" | "uz-cyrl" | "kaa";

// ─── Services ──────────────────────────────────────────────────────────────
export type ServiceSlug =
  | "corporate"
  | "international"
  | "contract"
  | "labor"
  | "litigation";

export interface Service {
  slug: ServiceSlug;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  features: string[];
}

// ─── Case Studies ──────────────────────────────────────────────────────────
export type CaseCategory =
  | "corporate"
  | "fdi"
  | "labor"
  | "litigation"
  | "contract";

export interface CaseStudy {
  id: string;
  slug: string;
  category: CaseCategory;
  clientType: string;
  dealValue?: string;
  timeline?: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[];
  sector: string;
  featured: boolean;
}

// ─── Team Members ─────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleRu: string;
  roleUz: string;
  yearsExp: number;
  admittedIn: string[];
  languages: string[];
  education: string[];
  specializations: ServiceSlug[];
  bio: string;
  image?: string;
  linkedin?: string;
}

// ─── Insights / Blog ──────────────────────────────────────────────────────
export type InsightCategory =
  | "regulatory"
  | "corporate"
  | "investment"
  | "labor"
  | "arbitration"
  | "tax";

export interface Insight {
  id: string;
  slug: string;
  category: InsightCategory;
  title: string;
  titleRu: string;
  titleUz: string;
  summary: string;
  summaryRu: string;
  summaryUz: string;
  businessImpact: string;
  businessImpactRu?: string;
  businessImpactUz?: string;
  recommendedAction: string;
  recommendedActionRu?: string;
  recommendedActionUz?: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
}

// ─── Achievements Carousel ─────────────────────────────────────────────────
export interface Achievement {
  id: string;
  headline: string;
  headlineRu: string;
  headlineUz: string;
  dealValue?: string;
  sector: string;
  clientOrigin: string;
  completedAt: string;
  caseStudySlug?: string;
}

// ─── AI Chat ──────────────────────────────────────────────────────────────
export type AIModelId =
  | "claude-sonnet-4-6"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gemini-2_5-pro"
  | "gemini-2_0-flash"
  | "mistral-large"
  | "llama-3_3-70b";

export interface AIModel {
  id: AIModelId;
  name: string;
  provider: "anthropic" | "openai" | "google" | "mistral" | "groq";
  providerLabel: string;
  description: string;
  badge?: "recommended" | "fast" | "powerful" | "open-source";
  maxTokens: number;
  supportsVision: boolean;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  model?: AIModelId;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  model: AIModelId;
  locale: Locale;
}

// ─── Calculator ───────────────────────────────────────────────────────────
export type InvestmentType = "fdi" | "jv" | "ma" | "contract" | "dispute";
export type Sector =
  | "tech"
  | "energy"
  | "real-estate"
  | "finance"
  | "manufacturing"
  | "retail";
export type Timeline = "urgent" | "standard" | "planned" | "strategic";
export type ComplexityLevel = "low" | "medium" | "high" | "critical";

export interface CalculatorInput {
  investmentType: InvestmentType;
  sector: Sector;
  originCountry: string;
  timeline: Timeline;
  estimatedValue?: number;
}

export interface CalculatorResult {
  level: ComplexityLevel;
  score: number;
  estimatedTimeline: string;
  keyConsiderations: string[];
  recommendedServices: ServiceSlug[];
}

// ─── Contact Form ─────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service?: ServiceSlug;
  message: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────
export interface NavItem {
  labelKey: string;
  href: string;
  children?: NavItem[];
}
