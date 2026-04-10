"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calculator, Calendar, AlertCircle, CheckCircle, Clock, Scale, ArrowRight, ChevronDown, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Link } from "@/i18n/navigation";

interface DeadlineResult {
  label: string;
  date: Date;
  description: string;
  urgent: boolean;
  legal: string;
}

type EventType =
  | "contractSigned"
  | "disputeArose"
  | "employeeTerminated"
  | "companyRegistered"
  | "propertyTransaction"
  | "taxPeriodEnd"
  | "arbitrationAward";

interface DeadlineConfig {
  label: string;
  days: number;
  description: string;
  urgent?: boolean;
  legal: string;
}

interface EventConfig {
  icon: string;
  color: string;
  deadlines: DeadlineConfig[];
}

// Legal data stays in English (universal legal citations)
const EVENT_CONFIGS: Record<EventType, EventConfig> = {
  contractSigned: {
    icon: "📄",
    color: "text-blue-deep",
    deadlines: [
      { label: "General Limitation Period", days: 1095, description: "3-year statute of limitations for contract claims", legal: "Civil Code Art. 150", urgent: false },
      { label: "Defect Notification Deadline", days: 30, description: "Must notify counterparty of visible defects within 30 days", legal: "Civil Code Art. 479", urgent: true },
      { label: "Performance Bond Expiry", days: 365, description: "Typical performance bond validity period (1 year)", legal: "Contract Terms", urgent: false },
    ],
  },
  disputeArose: {
    icon: "⚖️",
    color: "text-red-600",
    deadlines: [
      { label: "Limitation Period (General)", days: 1095, description: "3-year period to bring commercial claims to court or arbitration", legal: "Civil Code Art. 150", urgent: false },
      { label: "Pre-Claim Notice (Recommended)", days: 30, description: "Send formal demand letter before filing (strongly recommended)", legal: "Best Practice", urgent: true },
      { label: "Urgent Interim Measure Deadline", days: 7, description: "Apply for interim injunction within 7 days of dispute crystallizing", legal: "CPC Art. 88", urgent: true },
      { label: "ICAC Filing Deadline", days: 1095, description: "File at Uzbekistan ICAC within limitation period", legal: "ICAC Rules Art. 4", urgent: false },
    ],
  },
  employeeTerminated: {
    icon: "👷",
    color: "text-amber-600",
    deadlines: [
      { label: "Wrongful Dismissal Claim Deadline", days: 30, description: "Employee must file labour dispute claim within 30 days of termination", legal: "Labor Code Art. 264", urgent: true },
      { label: "Final Settlement Payment", days: 3, description: "All wages, compensation and severance must be paid within 3 days", legal: "Labor Code Art. 163", urgent: true },
      { label: "Work Record Return", days: 3, description: "Return employment record book to employee within 3 days", legal: "Labor Code Art. 101", urgent: true },
      { label: "Social Contributions Filing", days: 30, description: "File final payroll tax/social contribution reports", legal: "Tax Code Art. 406", urgent: false },
    ],
  },
  companyRegistered: {
    icon: "🏢",
    color: "text-purple-600",
    deadlines: [
      { label: "Charter Capital Contribution", days: 365, description: "Full charter capital must be contributed within 1 year", legal: "LLC Law Art. 14", urgent: false },
      { label: "Tax Registration Deadline", days: 10, description: "Register with tax authority within 10 days of state registration", legal: "Tax Code Art. 131", urgent: true },
      { label: "Bank Account Opening", days: 30, description: "Open corporate bank account and notify tax authority", legal: "Currency Law Art. 21", urgent: false },
      { label: "First VAT Filing", days: 20, description: "Submit initial VAT registration if turnover threshold met (20 days after quarter)", legal: "Tax Code Art. 237", urgent: false },
      { label: "Statistical Registration", days: 30, description: "Register with Statistics Committee (for reporting purposes)", legal: "Statistics Law", urgent: false },
    ],
  },
  propertyTransaction: {
    icon: "🏗️",
    color: "text-green-600",
    deadlines: [
      { label: "Notarization Deadline", days: 30, description: "Real estate transfer agreements must be notarized within agreed period", legal: "Civil Code Art. 478", urgent: true },
      { label: "State Registration of Title", days: 30, description: "Title transfer must be registered in State Cadastre after notarization", legal: "State Registration Law Art. 9", urgent: true },
      { label: "Limitation Period (Title Dispute)", days: 1095, description: "3-year period to challenge property title transfers", legal: "Civil Code Art. 161", urgent: false },
      { label: "Property Tax Registration", days: 30, description: "Register property for tax purposes after title registration", legal: "Tax Code Art. 407", urgent: false },
    ],
  },
  taxPeriodEnd: {
    icon: "💰",
    color: "text-green-700",
    deadlines: [
      { label: "VAT Return Filing", days: 20, description: "Submit quarterly VAT return within 20 days of period end", legal: "Tax Code Art. 273", urgent: true },
      { label: "CIT Advance Payment", days: 25, description: "Pay corporate income tax advance within 25 days of quarter end", legal: "Tax Code Art. 345", urgent: true },
      { label: "Payroll Tax Filing", days: 15, description: "Submit monthly payroll/social tax reports within 15 days of month end", legal: "Tax Code Art. 406", urgent: true },
      { label: "Annual CIT Return", days: 90, description: "File annual corporate income tax return within 3 months of year-end", legal: "Tax Code Art. 344", urgent: false },
    ],
  },
  arbitrationAward: {
    icon: "📋",
    color: "text-indigo-600",
    deadlines: [
      { label: "Award Challenge Window", days: 90, description: "3-month window to challenge arbitral award in state court on procedural grounds", legal: "ICAC Law Art. 38", urgent: true },
      { label: "Enforcement Application", days: 1095, description: "Apply for enforcement within 3 years of award becoming final", legal: "New York Convention Art. III", urgent: false },
      { label: "Uzbek Court Enforcement Filing", days: 1095, description: "File enforcement application in Tashkent Economic Court", legal: "CPC Art. 241", urgent: false },
    ],
  },
};

export default function ToolsPage() {
  const t = useTranslations("tools");
  const eventTypes = t.raw("eventTypes") as Record<EventType, string>;
  const quickRefItems = t.raw("quickRefItems") as { period: string; label: string; citation: string }[];

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [results, setResults] = useState<DeadlineResult[]>([]);
  const [calculated, setCalculated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEventMenu, setShowEventMenu] = useState(false);

  const calculate = () => {
    if (!selectedEvent || !eventDate) return;
    const base = new Date(eventDate);
    const config = EVENT_CONFIGS[selectedEvent];
    const deadlines: DeadlineResult[] = config.deadlines.map((d) => {
      const date = new Date(base);
      date.setDate(date.getDate() + d.days);
      return { label: d.label, date, description: d.description, urgent: d.urgent ?? false, legal: d.legal };
    });
    deadlines.sort((a, b) => a.date.getTime() - b.date.getTime());
    setResults(deadlines);
    setCalculated(true);
  };

  const copyResults = () => {
    const text = results.map((r) => `${r.label}: ${r.date.toLocaleDateString("en-GB")} — ${r.description} (${r.legal})`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPast = (date: Date) => date < new Date();
  const daysUntil = (date: Date) => Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">{t("badge")}</SectionLabel>
          <h1 className="font-sans font-bold text-ink mb-4 leading-tight" style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}>
            {t("title")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-5" />
          <p className="text-body-lg text-ink-secondary max-w-2xl">{t("subtitle")}</p>
        </div>
      </section>

      <section className="site-container py-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[1fr,1fr] gap-6">
          {/* Input panel */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-deep flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-ink text-heading-sm">{t("calculate")}</h2>
            </div>

            <div className="space-y-5">
              {/* Event type selector */}
              <div>
                <label className="text-label text-ink-muted mb-2 block">{t("eventType")}</label>
                <div className="relative">
                  <button onClick={() => setShowEventMenu(!showEventMenu)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone bg-white text-sm text-left transition-all hover:border-stone-dark focus:outline-none focus:border-blue-deep">
                    {selectedEvent ? (
                      <span className="flex items-center gap-2">
                        <span>{EVENT_CONFIGS[selectedEvent].icon}</span>
                        <span className="text-ink font-medium">{eventTypes[selectedEvent]}</span>
                      </span>
                    ) : (
                      <span className="text-ink-muted">{t("selectPlaceholder")}</span>
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-ink-muted transition-transform", showEventMenu && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showEventMenu && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                        className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-stone rounded-xl shadow-legal-md overflow-hidden">
                        {(Object.keys(EVENT_CONFIGS) as EventType[]).map((key) => (
                          <button key={key} onClick={() => { setSelectedEvent(key); setShowEventMenu(false); setCalculated(false); }}
                            className={cn("w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors border-b border-stone/50 last:border-0",
                              selectedEvent === key ? "bg-blue-50 text-blue-deep" : "hover:bg-cream text-ink")}>
                            <span className="text-lg flex-shrink-0">{EVENT_CONFIGS[key].icon}</span>
                            <span className="font-medium">{eventTypes[key]}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Date input */}
              <div>
                <label className="text-label text-ink-muted mb-2 block">{t("eventDate")}</label>
                <input type="date" value={eventDate} onChange={(e) => { setEventDate(e.target.value); setCalculated(false); }}
                  className="form-input w-full" max={new Date().toISOString().split("T")[0]} />
              </div>

              <button onClick={calculate} disabled={!selectedEvent || !eventDate}
                className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
                  selectedEvent && eventDate ? "bg-blue-deep hover:bg-blue-action text-white shadow-sm" : "bg-stone text-ink-muted cursor-not-allowed")}>
                <Calculator className="w-4 h-4" />
                {t("calculate")}
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed">{t("disclaimer")}</p>
              </div>
            </div>
          </div>

          {/* Quick reference panel */}
          <div className="card p-6">
            <h3 className="font-bold text-ink mb-4 text-heading-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-deep" /> {t("quickRef")}
            </h3>
            <div className="space-y-3">
              {quickRefItems.map(({ period, label, citation }) => (
                <div key={citation} className="flex items-start gap-3 py-2 border-b border-stone/40 last:border-0">
                  <span className="text-[11px] font-bold text-blue-deep bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 flex-shrink-0 whitespace-nowrap">{period}</span>
                  <div>
                    <p className="text-xs text-ink leading-snug">{label}</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">{citation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {calculated && results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink text-heading-sm">
                  {selectedEvent ? eventTypes[selectedEvent] : ""}
                </h3>
                <button onClick={copyResults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone hover:border-stone-dark text-xs text-ink-secondary hover:text-ink transition-all">
                  {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> {t("copied")}</> : <><Copy className="w-3.5 h-3.5" /> {t("copyAll")}</>}
                </button>
              </div>

              <div className="space-y-3">
                {results.map((result, i) => {
                  const past = isPast(result.date);
                  const days = daysUntil(result.date);
                  return (
                    <motion.div key={result.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all",
                        past ? "bg-stone/30 border-stone text-ink-muted" :
                        result.urgent && days <= 14 ? "bg-red-50 border-red-200" :
                        result.urgent ? "bg-amber-50 border-amber-200" :
                        "bg-white border-stone"
                      )}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        past ? "bg-stone" : result.urgent && days <= 14 ? "bg-red-100" : result.urgent ? "bg-amber-100" : "bg-blue-50")}>
                        {past ? <Clock className="w-4 h-4 text-ink-muted" /> :
                         result.urgent && days <= 14 ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                         result.urgent ? <AlertCircle className="w-4 h-4 text-amber-600" /> :
                         <Calendar className="w-4 h-4 text-blue-deep" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                          <p className={cn("text-sm font-bold", past ? "text-ink-muted" : "text-ink")}>{result.label}</p>
                          {result.urgent && !past && (
                            <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                              days <= 14 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600")}>
                              {days <= 0 ? "EXPIRED" : days <= 14 ? "URGENT" : "Time-sensitive"}
                            </span>
                          )}
                          {past && <span className="text-[10px] bg-stone text-ink-muted px-2 py-0.5 rounded-full font-medium uppercase">{t("pastLabel")}</span>}
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed mb-2">{result.description}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-ink-muted" />
                            <span className={cn("text-xs font-semibold", past ? "text-ink-muted" : "text-ink")}>
                              {result.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          {!past && (
                            <span className={cn("text-xs", days <= 14 ? "text-red-600 font-semibold" : "text-ink-muted")}>
                              {days === 0 ? t("todayLabel") : days > 0 ? `${days}d` : `${Math.abs(days)}d`}
                            </span>
                          )}
                          <span className="text-[10px] text-ink-muted bg-stone px-2 py-0.5 rounded font-mono">{result.legal}</span>
                        </div>
                      </div>
                      {!past && <CheckCircle className={cn("w-4 h-4 flex-shrink-0 mt-1", days <= 14 && result.urgent ? "text-red-400" : "text-stone-dark")} />}
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="mt-6 p-5 bg-blue-deep rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm mb-1">{t("ctaTitle")}</p>
                  <p className="text-white/70 text-xs">{t("ctaSubtitle")}</p>
                </div>
                <Link href="/contact" className="flex items-center gap-2 px-4 py-2 bg-white text-blue-deep font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
                  {t("ctaBtn")} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
