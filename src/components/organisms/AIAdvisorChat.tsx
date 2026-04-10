"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send, Plus, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  AlertTriangle, Check, X, Scale,
  Mic, MicOff, Paperclip, Trash2,
  MessageSquare, Zap, Brain, ChevronLeft, ChevronRight,
  Phone, Calendar, Menu, Bookmark, BookmarkCheck,
  Search, ChevronDown, Info,
  ArrowDown, AlignLeft, FileDown, SlidersHorizontal,
  Mail, Pencil, Hash, FileText, ShieldAlert, ShieldCheck, ShieldMinus, Pin,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { AI_MODELS, DEFAULT_MODEL_ID } from "@/lib/ai-models";
import type { ChatMessage, AIModel } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────
type Mode = "fast" | "balanced" | "deep";
type Tone = "formal" | "concise" | "detailed";

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  mode: Mode;
  createdAt: string;
}

interface AttachedFile {
  name: string;
  content: string;
  type: string;
}

// ─── Constants ────────────────────────────────────────────────────────────
const MODE_COLORS: Record<string, string> = {
  fast: "text-green-500", balanced: "text-blue-500", deep: "text-purple-500",
};
const MODE_ICONS: Record<string, React.ReactNode> = {
  fast: <Zap className="w-3.5 h-3.5" />,
  balanced: <Scale className="w-3.5 h-3.5" />,
  deep: <Brain className="w-3.5 h-3.5" />,
};

const PROVIDER_DOT: Record<string, string> = {
  anthropic: "bg-[#C9A96E]", openai: "bg-[#10A37F]",
  google: "bg-[#4285F4]", mistral: "bg-[#FF7000]", groq: "bg-[#0064E0]",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  formal: "Respond in a formal, professional legal writing style suitable for a senior attorney audience.",
  concise: "Be concise and direct. Provide short, precise answers. Avoid lengthy preambles or repetition.",
  detailed: "Provide a comprehensive, in-depth analysis. Include relevant legal articles, practical examples, and step-by-step guidance.",
};

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateTokens(msgs: { content: string }[]): number {
  const total = msgs.reduce((sum, m) => sum + m.content.length, 0);
  return Math.round(total / 4);
}

// ─── Legal risk detection ─────────────────────────────────────────────────
type RiskLevel = "low" | "medium" | "high";
function detectRisk(text: string): RiskLevel | null {
  const t = text.toLowerCase();
  const high = ["criminal","fraud","sanction","void","illegal","violation","imprisonment","jarima","штраф","jinoyat","criminal liability","uголовн"];
  const med  = ["risk","dispute","liability","mandatory","required","penalty","xavf","mas'uliyat","риск","ответственност","registratsiya","mahkama"];
  if (high.some((k) => t.includes(k))) return "high";
  if (med.some((k) => t.includes(k))) return "medium";
  if (text.length > 200) return "low";
  return null;
}
const RISK_META: Record<RiskLevel, { icon: React.ComponentType<{className?: string}>; color: string; bg: string; label: string }> = {
  high:   { icon: ShieldAlert,  color: "text-red-600",    bg: "bg-red-50 border-red-200",    label: "High Legal Risk" },
  medium: { icon: ShieldMinus,  color: "text-amber-600",  bg: "bg-amber-50 border-amber-200",  label: "Medium Risk" },
  low:    { icon: ShieldCheck,  color: "text-green-600",  bg: "bg-green-50 border-green-200",  label: "Low Risk" },
};

// ─── Legal citation extractor ─────────────────────────────────────────────
function extractCitations(text: string): string[] {
  const patterns = [
    /(?:Article|Art\.?)\s+\d+[\d\w\.\-]*/gi,
    /Статья\s+\d+[\d\w\.\-]*/gi,
    /Modda\s+\d+[\d\w\.\-]*/gi,
    /\d+-(?:modda|modd|son)\b/gi,
    /PQ-\d+/gi, /ПП-\d+/gi, /УП-\d+/gi,
    /(?:Law|Qonun|Закон)\s+(?:on|of|об?|haqida|to'g'risida)\s+["«]?[A-ZА-ЯA-ZO'G']{1}[^"»\n.]{3,60}/gi,
  ];
  const found = new Set<string>();
  patterns.forEach((p) => text.match(p)?.forEach((s) => found.add(s.trim())));
  return [...found].slice(0, 12);
}

// ─── Utility: get 3 follow-up suggestions from response text ──────────────
function getFollowUps(text: string, bank: string[]): string[] {
  const lower = text.toLowerCase();
  const picks: string[] = [];
  if (lower.includes("tax") || lower.includes("soliq") || lower.includes("налог")) picks.push(bank[3]);
  if (lower.includes("penalt") || lower.includes("jarima") || lower.includes("штраф")) picks.push(bank[0]);
  if (lower.includes("document") || lower.includes("hujjat") || lower.includes("документ")) picks.push(bank[1]);
  if (lower.includes("process") || lower.includes("muddati") || lower.includes("срок")) picks.push(bank[2]);
  if (lower.includes("risk") || lower.includes("xavf") || lower.includes("риск")) picks.push(bank[5]);
  while (picks.length < 3) {
    const candidate = bank[picks.length + 5] || bank[picks.length];
    if (candidate && !picks.includes(candidate)) picks.push(candidate);
    else break;
  }
  return picks.slice(0, 3);
}

// ─── Sub: Model Selector ──────────────────────────────────────────────────
function ModelSelector({ selected, onSelect, descriptions }: {
  selected: AIModel;
  onSelect: (m: AIModel) => void;
  descriptions: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const grouped = AI_MODELS.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone hover:border-stone-dark text-xs font-medium text-ink-secondary bg-white transition-all">
        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", PROVIDER_DOT[selected.provider])} />
        {selected.name}
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 w-72 z-50 bg-white border border-stone rounded-xl shadow-legal-lg overflow-hidden">
            {Object.entries(grouped).map(([prov, models]) => (
              <div key={prov} className="border-b border-stone last:border-0">
                <div className="px-3 py-2 bg-cream flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", PROVIDER_DOT[prov])} />
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">{models[0].providerLabel}</span>
                </div>
                {models.map((m) => (
                  <button key={m.id} onClick={() => { onSelect(m); setOpen(false); }}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors", selected.id === m.id ? "bg-blue-50" : "hover:bg-cream")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-ink">{m.name}</span>
                        {m.badge && <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-50 text-blue-deep border border-blue-200 font-bold">{m.badge}</span>}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-tight mt-0.5">{descriptions[m.id.replace(/\./g, "_")] ?? m.description}</p>
                    </div>
                    {selected.id === m.id && <Check className="w-3.5 h-3.5 text-blue-deep flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub: Thinking Animation ─────────────────────────────────────────────
function ThinkingCard({ modelName, mode, messages }: { modelName: string; mode: Mode; messages: string[] }) {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % (messages.length || 1)), 1800);
    return () => clearInterval(t);
  }, [messages.length]);

  const modeColor = mode === "deep" ? "from-purple-500 to-blue-deep" : mode === "fast" ? "from-green-500 to-blue-action" : "from-blue-action to-blue-deep";

  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="relative w-8 h-8 flex-shrink-0">
        <div className={cn("absolute inset-0 rounded-full bg-gradient-to-br opacity-20 animate-pulse", modeColor)} />
        <div className="relative w-8 h-8 rounded-full bg-white border border-stone shadow-sm flex items-center justify-center">
          <Scale className="w-3.5 h-3.5 text-blue-deep" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-ink-muted font-medium mb-1.5 ml-0.5">{modelName}</p>
        <div className="bg-white border border-stone rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.22 }}
                className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", modeColor)} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={msgIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}
              className="text-xs text-ink-muted italic">{messages[msgIdx] ?? "…"}</motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Sub: Message Bubble ──────────────────────────────────────────────────
function MessageBubble({ message, isLast, onCopy, onRegenerate, onFeedback, onToggleSave, isSaved, copyLabel, copiedLabel, retryLabel, saveLabel, unsaveLabel, wordCountLabel, compact }: {
  message: ChatMessage & { feedback?: "up" | "down" };
  isLast: boolean;
  onCopy: (t: string) => void;
  onRegenerate?: () => void;
  onFeedback: (id: string, v: "up" | "down") => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  copyLabel: string;
  copiedLabel: string;
  retryLabel: string;
  saveLabel: string;
  unsaveLabel: string;
  wordCountLabel: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [showCitations, setShowCitations] = useState(false);
  const handleCopy = () => { onCopy(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleEmail = () => {
    const subject = encodeURIComponent("R-Legal AI Legal Advice");
    const body = encodeURIComponent(message.content.slice(0, 2000));
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  const modelName = AI_MODELS.find((m) => m.id === message.model)?.name;
  const wc = message.role === "assistant" && !message.isStreaming ? wordCount(message.content) : 0;
  const risk = message.role === "assistant" && !message.isStreaming && message.content.length > 100
    ? detectRisk(message.content) : null;
  const citations = showCitations ? extractCitations(message.content) : [];

  if (message.role === "user") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex justify-end", compact ? "mb-3" : "mb-5")}>
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="bg-blue-deep text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </motion.div>
    );
  }

  // Don't render empty streaming placeholders — ThinkingCard covers that phase
  if (message.isStreaming && !message.content) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex justify-start group", compact ? "mb-3" : "mb-5")}>
      <div className="flex items-start gap-2.5 max-w-[88%] w-full">
        <div className={cn("w-8 h-8 rounded-full border shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5", message.isStreaming ? "bg-blue-50 border-blue-200" : "bg-white border-stone")}>
          <Scale className={cn("w-3.5 h-3.5", message.isStreaming ? "text-blue-deep animate-pulse" : "text-blue-deep")} />
        </div>
        <div className="flex-1 min-w-0">
          {modelName && (
            <p className="text-[11px] text-ink-muted font-medium mb-1.5 flex items-center gap-1.5">
              {modelName}
              {message.isStreaming && <span className="inline-flex items-center gap-1 text-blue-action"><span className="w-1 h-1 rounded-full bg-blue-action animate-ping" />generating…</span>}
            </p>
          )}
          <div className={cn("bg-white border rounded-2xl rounded-tl-sm shadow-sm", compact ? "px-3 py-2.5" : "px-4 py-3.5", message.isStreaming && "typing-cursor border-blue-100", isSaved ? "border-amber-300 bg-amber-50/30" : !message.isStreaming ? "border-stone" : "")}>
            <div className="prose prose-sm max-w-none text-ink prose-headings:font-bold prose-headings:text-ink prose-a:text-blue-deep prose-strong:text-ink prose-code:bg-cream prose-code:px-1 prose-code:rounded prose-code:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || "…"}</ReactMarkdown>
            </div>
          </div>
          {!message.isStreaming && (
            <>
              {/* Risk badge */}
              {risk && (() => { const rm = RISK_META[risk]; const RIcon = rm.icon; return (
                <div className={cn("inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full border text-[10px] font-semibold", rm.bg, rm.color)}>
                  <RIcon className="w-3 h-3" /> {rm.label}
                </div>
              ); })()}

              {/* Citations panel */}
              <AnimatePresence>
                {showCitations && citations.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-blue-deep uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Hash className="w-3 h-3" /> Legal References Detected
                      </p>
                      <ul className="space-y-1">
                        {citations.map((c, i) => (
                          <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                            <span className="text-blue-400 font-mono text-[10px] mt-0.5">{i + 1}.</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
                {showCitations && citations.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-2 text-[11px] text-ink-muted italic">No specific legal citations detected in this response.</motion.div>
                )}
              </AnimatePresence>

              {/* Action bar */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors px-2 py-1 rounded-md hover:bg-stone">
                  {copied ? <><Check className="w-3 h-3 text-green-600" /> {copiedLabel}</> : <><Copy className="w-3 h-3" /> {copyLabel}</>}
                </button>
                {isLast && onRegenerate && (
                  <button onClick={onRegenerate} className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors px-2 py-1 rounded-md hover:bg-stone">
                    <RefreshCw className="w-3 h-3" /> {retryLabel}
                  </button>
                )}
                <button onClick={() => onToggleSave(message.id)}
                  className={cn("flex items-center gap-1 text-[11px] transition-colors px-2 py-1 rounded-md",
                    isSaved ? "text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100" : "text-ink-muted hover:text-amber-600 hover:bg-stone")}>
                  {isSaved ? <><BookmarkCheck className="w-3 h-3" /> {unsaveLabel}</> : <><Bookmark className="w-3 h-3" /> {saveLabel}</>}
                </button>
                {/* Citation extractor */}
                <button onClick={() => setShowCitations(!showCitations)}
                  className={cn("flex items-center gap-1 text-[11px] transition-colors px-2 py-1 rounded-md",
                    showCitations ? "bg-blue-50 text-blue-deep border border-blue-200" : "text-ink-muted hover:text-blue-deep hover:bg-stone")}>
                  <Hash className="w-3 h-3" /> Citations
                </button>
                {/* Email response */}
                <button onClick={handleEmail}
                  className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors px-2 py-1 rounded-md hover:bg-stone">
                  <Mail className="w-3 h-3" /> Email
                </button>
                {wc > 0 && (
                  <span className="text-[10px] text-ink-muted/60 ml-1">{wc} {wordCountLabel}</span>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <button onClick={() => onFeedback(message.id, "up")}
                    className={cn("p-1.5 rounded-md transition-colors", message.feedback === "up" ? "bg-green-50 text-green-600" : "text-ink-muted hover:bg-stone hover:text-ink")}>
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => onFeedback(message.id, "down")}
                    className={cn("p-1.5 rounded-md transition-colors", message.feedback === "down" ? "bg-red-50 text-red-500" : "text-ink-muted hover:bg-stone hover:text-ink")}>
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sub: Suggested Follow-ups ────────────────────────────────────────────
function SuggestedFollowups({ suggestions, onSelect, label }: { suggestions: string[]; onSelect: (s: string) => void; label: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="flex flex-col gap-2 mb-5 ml-[44px]">
      <p className="text-[11px] text-ink-muted font-medium mb-0.5">{label}</p>
      {suggestions.map((s) => (
        <button key={s} onClick={() => onSelect(s)}
          className="text-left text-xs text-blue-action px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all">
          {s}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Main: AIAdvisorChat ──────────────────────────────────────────────────
export function AIAdvisorChat() {
  const t = useTranslations("aiAdvisor");
  const locale = useLocale();

  // ── Derived translations ─────────────────────────────────────────────
  const MODES = [
    { id: "fast" as Mode,     label: t("modes.fast.label"),     icon: MODE_ICONS.fast,     desc: t("modes.fast.desc"),     color: MODE_COLORS.fast },
    { id: "balanced" as Mode, label: t("modes.balanced.label"), icon: MODE_ICONS.balanced, desc: t("modes.balanced.desc"), color: MODE_COLORS.balanced },
    { id: "deep" as Mode,     label: t("modes.deep.label"),     icon: MODE_ICONS.deep,     desc: t("modes.deep.desc"),     color: MODE_COLORS.deep },
  ];
  const THINKING_MESSAGES = t.raw("thinkingMessages") as string[];
  const FOLLOW_UP_BANK    = t.raw("followUpBank")    as string[];
  const TEMPLATES         = t.raw("templates")       as { icon: string; label: string; prompt: string }[];
  const DRAFTS            = t.raw("drafts")          as { icon: string; label: string; prompt: string }[];
  const MODEL_DESCRIPTIONS = t.raw("models") as Record<string, string>;

  // Core state
  const [messages, setMessages] = useState<(ChatMessage & { feedback?: "up" | "down" })[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS.find((m) => m.id === DEFAULT_MODEL_ID) || AI_MODELS[0]);
  const [mode, setMode] = useState<Mode>("balanced");
  const [tone, setTone] = useState<Tone>("formal");
  const [error, setError] = useState<string | null>(null);

  // Feature state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // New features state
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [customContext, setCustomContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [compact, setCompact] = useState(false);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);

  // ── New feature state ─────────────────────────────────────────────────
  const [responseFormat, setResponseFormat] = useState<"auto" | "opinion" | "summary" | "assessment">("auto");
  const [chatSearch, setChatSearch] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const toneMenuRef = useRef<HTMLDivElement>(null);

  // ── Load conversations from localStorage ─────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rl_conversations");
      if (stored) setConversations(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const saveConversations = useCallback((convs: Conversation[]) => {
    setConversations(convs);
    try { localStorage.setItem("rl_conversations", JSON.stringify(convs.slice(0, 30))); } catch { /* ignore */ }
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Send message ─────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);
    setShowSuggestions(false);

    // Build content (include file if attached)
    let content = text.trim();
    if (attachedFile) {
      content = `[Attached file: ${attachedFile.name}]\n\n${attachedFile.content ? `File content:\n${attachedFile.content}\n\n` : ""}User query: ${content}`;
      setAttachedFile(null);
    }
    // Prepend custom context if set
    const contextPrefix = customContext.trim()
      ? `[Business context: ${customContext.trim()}]\n\n`
      : "";
    const tonePrefix = TONE_INSTRUCTIONS[tone]
      ? `[Style: ${TONE_INSTRUCTIONS[tone]}]\n\n`
      : "";
    const formatPrefix = responseFormat === "opinion"
      ? "[Format: Structure your response as a formal Legal Opinion with: 1) Facts, 2) Applicable Law, 3) Analysis, 4) Conclusion & Recommendation.]\n\n"
      : responseFormat === "summary"
      ? "[Format: Provide a brief Executive Summary in 3-5 bullet points, suitable for a non-lawyer.]\n\n"
      : responseFormat === "assessment"
      ? "[Format: Structure as a Legal Risk Assessment with: Risk Level, Key Risks (numbered), Probability, Recommended Mitigations.]\n\n"
      : "";

    const userMsg: ChatMessage & { feedback?: "up" | "down" } = {
      id: generateId(), role: "user", content, timestamp: new Date(),
    };
    const aiMsg: ChatMessage & { feedback?: "up" | "down" } = {
      id: generateId(), role: "assistant", content: "", timestamp: new Date(),
      model: selectedModel.id, isStreaming: true,
    };

    const newMessages = [...messages, userMsg, aiMsg];
    setMessages(newMessages);
    setInput("");
    setCharCount(0);
    setIsLoading(true);
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }

    abortRef.current = new AbortController();

    try {
      const systemAddition = contextPrefix + tonePrefix + formatPrefix;
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content }],
          model: selectedModel.id,
          mode,
          systemAddition: systemAddition || undefined,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Server error ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta || parsed.text || "";
            if (delta) {
              full += delta;
              setMessages((p) => p.map((m) => m.id === aiMsg.id ? { ...m, content: full } : m));
            }
          } catch { /* skip */ }
        }
      }

      const finalMessages = newMessages.map((m) =>
        m.id === aiMsg.id ? { ...m, isStreaming: false, content: full } : m
      );
      setMessages(finalMessages);

      // Show follow-up suggestions
      const followUps = getFollowUps(full, FOLLOW_UP_BANK);
      setSuggestions(followUps);
      setShowSuggestions(true);

      // Save/update conversation
      const convTitle = content.slice(0, 45) + (content.length > 45 ? "…" : "");
      const convId = activeConvId || generateId();
      if (!activeConvId) setActiveConvId(convId);

      const updatedConv: Conversation = {
        id: convId, title: convTitle,
        messages: finalMessages,
        model: selectedModel.id, mode,
        createdAt: new Date().toISOString(),
      };
      saveConversations([updatedConv, ...conversations.filter((c) => c.id !== convId)]);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "An error occurred.");
      setMessages((p) => p.filter((m) => m.id !== aiMsg.id));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [isLoading, messages, selectedModel.id, mode, attachedFile, activeConvId, conversations, saveConversations]);

  const newChat = () => {
    abortRef.current?.abort();
    setMessages([]); setInput(""); setError(null); setIsLoading(false);
    setSuggestions([]); setShowSuggestions(false); setAttachedFile(null);
    setActiveConvId(null); setCharCount(0); setSavedIds(new Set());
    setShowJumpToBottom(false);
  };

  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setActiveConvId(conv.id);
    setShowSuggestions(false);
    setSuggestions([]);
    const model = AI_MODELS.find((m) => m.id === conv.model);
    if (model) setSelectedModel(model);
    setMode(conv.mode);
  };

  const deleteConversation = (id: string) => {
    saveConversations(conversations.filter((c) => c.id !== id));
    if (activeConvId === id) newChat();
  };

  const exportChatPDF = () => {
    const date = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    const rows = messages.map((m) => {
      const role = m.role === "user" ? "Your Question" : `AI Legal Advisor${m.model ? ` · ${AI_MODELS.find((am) => am.id === m.model)?.name ?? ""}` : ""}`;
      const cls = m.role === "user" ? "user" : "ai";
      const escaped = m.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
      return `<div class="message"><div class="msg-role ${cls}">${role}</div><div class="bubble ${cls}">${escaped}</div></div>`;
    }).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>R-Legal AI Conversation — ${date}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;color:#151414;background:#fff;padding:40px;max-width:780px;margin:0 auto}
header{border-bottom:3px solid #0f2ccf;padding-bottom:18px;margin-bottom:28px}
.brand{font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#151414}
.brand-sub{font-size:10px;letter-spacing:0.14em;color:#6b6a69;text-transform:uppercase;margin-top:2px}
.meta{margin-top:12px;font-size:11px;color:#6b6a69}
.message{margin-bottom:22px;page-break-inside:avoid}
.msg-role{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:7px}
.msg-role.user{color:#0f2ccf}
.msg-role.ai{color:#525150}
.bubble{padding:14px 18px;border-radius:12px;font-size:13px;line-height:1.7}
.bubble.user{background:#0f2ccf;color:#fff}
.bubble.ai{background:#f8f8f8;border:1px solid #e0dfdf}
footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0dfdf;font-size:10px;color:#a0a0a0;text-align:center}
@media print{body{padding:20px}}
</style></head><body>
<header><div class="brand">R-LEGAL</div><div class="brand-sub">Practice · AI Legal Advisor</div>
<div class="meta">Exported on ${date} · AI-generated content for informational purposes only</div></header>
${rows}
<footer>© ${new Date().getFullYear()} R-Legal Practice · rlegalpractice@gmail.com · +998 90 825 08 78<br/>
This document contains AI-generated general legal information and does not constitute formal legal advice.</footer>
</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowJumpToBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  const jumpToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Close tone menu on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (toneMenuRef.current && !toneMenuRef.current.contains(e.target as Node)) setShowToneMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleFeedback = (id: string, val: "up" | "down") => {
    setMessages((p) => p.map((m) => m.id === id ? { ...m, feedback: val } : m));
  };

  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) { setMessages((p) => p.slice(0, -1)); sendMessage(lastUser.content); }
  };

  // ── File upload ───────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = typeof e.target?.result === "string" ? e.target.result.slice(0, 8000) : "";
      setAttachedFile({ name: file.name, content, type: file.type });
    };
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      reader.readAsText(file);
    } else {
      setAttachedFile({ name: file.name, content: "", type: file.type });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Voice input ───────────────────────────────────────────────────────
  const startVoice = () => {
    if (typeof window === "undefined") return;
    type SpeechRecognitionConstructor = new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
      onend: () => void;
      start: () => void;
    };
    const w = window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setError("Voice input not supported in this browser. Try Chrome."); return; }
    const rec = new SR();
    rec.lang = locale === "ru" ? "ru-RU" : locale.startsWith("uz") ? "uz-UZ" : "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      const results = e.results as unknown as SpeechRecognitionResultList;
      const text = Array.from(results).map((r) => r[0].transcript).join("");
      setInput(text);
      setCharCount(text.length);
    };
    rec.onend = () => setIsListening(false);
    rec.start();
    setIsListening(true);
  };

  const stopVoice = () => { setIsListening(false); };

  // ── Input handlers ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setCharCount(e.target.value.length);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  const isEmpty = messages.length === 0;
  // Show thinking animation while waiting for first token (content is still empty string)
  const lastMsg = messages[messages.length - 1];
  const showTypingIndicator = isLoading && (!lastMsg?.isStreaming || lastMsg?.content === "");

  // Message search filter
  const visibleMessages = chatSearch.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(chatSearch.toLowerCase()))
    : messages;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex bg-[#F4F4F5]"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}>

      {/* ── Drag overlay ── */}
      <AnimatePresence>
        {isDragging && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-blue-deep/20 backdrop-blur-sm border-4 border-dashed border-blue-deep flex items-center justify-center">
            <div className="text-center text-white">
              <Paperclip className="w-12 h-12 mx-auto mb-3" />
              <p className="text-xl font-bold">{t("dropFile")}</p>
              <p className="text-sm opacity-70">{t("dropFileHint")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col h-full bg-[#0C0C0D] text-white overflow-hidden flex-shrink-0 border-r border-white/8">

            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Scale className="w-5 h-5 text-blue-action" />
                <div>
                  <p className="text-sm font-bold text-white leading-none">R-Legal AI</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{t("legalAdvisor")}</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* New Chat button */}
            <div className="px-3 py-3">
              <button onClick={newChat}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 text-sm font-medium text-white/80 hover:text-white transition-all">
                <Plus className="w-4 h-4" />
                {t("newChat")}
              </button>
            </div>

            {/* Sidebar search */}
            <div className="px-3 pb-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder={t("searchChats")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-white/70 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
            </div>

            {/* Conversation history */}
            <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-4">
              {/* Saved responses panel */}
              {savedIds.size > 0 && (
                <div>
                  <button onClick={() => setShowSavedPanel(!showSavedPanel)}
                    className="flex items-center gap-1.5 w-full text-[10px] font-semibold text-amber-400/80 uppercase tracking-widest px-1 mb-2 hover:text-amber-400 transition-colors">
                    <BookmarkCheck className="w-3 h-3" />
                    {t("savedMessages")} ({savedIds.size})
                    <ChevronDown className={cn("w-3 h-3 ml-auto transition-transform", showSavedPanel && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showSavedPanel && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="space-y-1 mb-3 overflow-hidden">
                        {messages.filter((m) => m.role === "assistant" && savedIds.has(m.id)).map((m) => (
                          <div key={m.id} className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-2 text-[10px] text-white/70 leading-relaxed">
                            {m.content.slice(0, 120)}{m.content.length > 120 ? "…" : ""}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {conversations.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1 mb-2">{t("recent")}</p>
                  <div className="space-y-0.5">
                    {conversations.filter((c) => !sidebarSearch || c.title.toLowerCase().includes(sidebarSearch.toLowerCase())).slice(0, 15).map((conv) => (
                      <div key={conv.id} className={cn(
                        "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all",
                        activeConvId === conv.id ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/60 hover:text-white"
                      )}>
                        <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                        {editingConvId === conv.id ? (
                          <input
                            autoFocus
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => {
                              if (editingTitle.trim()) {
                                saveConversations(conversations.map((c) => c.id === conv.id ? { ...c, title: editingTitle.trim() } : c));
                              }
                              setEditingConvId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.currentTarget.blur();
                              if (e.key === "Escape") { setEditingConvId(null); }
                            }}
                            className="flex-1 text-xs bg-white/10 rounded px-1 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                          />
                        ) : (
                          <button onClick={() => loadConversation(conv)} className="flex-1 text-left text-xs truncate">
                            {conv.title}
                          </button>
                        )}
                        <button onClick={() => { setEditingConvId(conv.id); setEditingTitle(conv.title); }}
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center hover:text-white/80 transition-all flex-shrink-0">
                          <Pencil className="w-2.5 h-2.5" />
                        </button>
                        <button onClick={() => deleteConversation(conv.id)}
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center hover:text-red-400 transition-all flex-shrink-0">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Templates */}
              <div>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1 mb-2">{t("legalTemplates")}</p>
                <div className="space-y-0.5">
                  {TEMPLATES.map((tpl) => (
                    <button key={tpl.label} onClick={() => sendMessage(tpl.prompt)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white text-xs transition-all text-left">
                      <span className="text-base leading-none flex-shrink-0">{tpl.icon}</span>
                      <span className="truncate">{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Drafts */}
              <div>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-1 mb-2">{t("documentDrafts")}</p>
                <div className="space-y-0.5">
                  {DRAFTS.map((draft) => (
                    <button key={draft.label} onClick={() => sendMessage(draft.prompt)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white text-xs transition-all text-left group">
                      <span className="text-base leading-none flex-shrink-0">{draft.icon}</span>
                      <span className="truncate flex-1">{draft.label}</span>
                      <span className="text-[9px] text-white/20 group-hover:text-white/40 flex-shrink-0 font-mono">AI</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar footer */}
            <div className="px-3 py-3 border-t border-white/8 space-y-2">
              <Link href="/contact"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white text-xs transition-all">
                <Phone className="w-3.5 h-3.5" /> +998 90 825 08 78
              </Link>
              <Link href="/contact"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-deep hover:bg-blue-action text-white text-xs font-semibold transition-all">
                <Calendar className="w-3.5 h-3.5" /> {t("bookConsultation")}
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════
          MAIN CHAT AREA
      ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-stone flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)}
                className="w-8 h-8 rounded-lg hover:bg-stone flex items-center justify-center transition-colors">
                <Menu className="w-4 h-4 text-ink-muted" />
              </button>
            )}

            {/* Mode selector */}
            <div className="flex items-center gap-0.5 bg-cream rounded-lg p-0.5 border border-stone">
              {MODES.map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    mode === m.id ? "bg-white shadow-sm text-ink border border-stone" : "text-ink-muted hover:text-ink"
                  )}>
                  <span className={mode === m.id ? m.color : ""}>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Token estimate */}
            {messages.length > 0 && (
              <span className="text-[10px] text-ink-muted/60 font-mono hidden sm:block">
                {t("tokenEstimate")} ~{estimateTokens(messages).toLocaleString()}
              </span>
            )}

            {/* Tone selector */}
            <div ref={toneMenuRef} className="relative">
              <button onClick={() => setShowToneMenu(!showToneMenu)}
                className={cn("flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-all",
                  tone !== "formal" ? "border-blue-300 bg-blue-50 text-blue-deep" : "border-stone text-ink-secondary hover:border-stone-dark bg-white")}>
                <SlidersHorizontal className="w-3 h-3" />
                <span className="hidden sm:block">{t(`tone.${tone}`)}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              <AnimatePresence>
                {showToneMenu && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone rounded-xl shadow-legal-md overflow-hidden z-50">
                    <p className="px-3 py-2 text-[10px] font-bold text-ink-muted uppercase tracking-widest border-b border-stone">{t("tone.label")}</p>
                    {(["formal", "concise", "detailed"] as Tone[]).map((toneOpt) => (
                      <button key={toneOpt} onClick={() => { setTone(toneOpt); setShowToneMenu(false); }}
                        className={cn("w-full flex items-start gap-2 px-3 py-2.5 text-left transition-colors", tone === toneOpt ? "bg-blue-50" : "hover:bg-cream")}>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-ink">{t(`tone.${toneOpt}`)}</p>
                          <p className="text-[10px] text-ink-muted mt-0.5">{t(`toneHint.${toneOpt}`)}</p>
                        </div>
                        {tone === toneOpt && <Check className="w-3.5 h-3.5 text-blue-deep flex-shrink-0 mt-0.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message search */}
            {showChatSearch ? (
              <div className="flex items-center gap-1 bg-white border border-blue-300 rounded-lg px-2 py-1">
                <Search className="w-3 h-3 text-blue-deep flex-shrink-0" />
                <input autoFocus value={chatSearch} onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Search messages…"
                  className="w-28 text-[11px] text-ink bg-transparent focus:outline-none placeholder:text-ink-muted" />
                <button onClick={() => { setChatSearch(""); setShowChatSearch(false); }} className="text-ink-muted hover:text-ink">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowChatSearch(true)} title="Search messages"
                className={cn("w-7 h-7 rounded-md flex items-center justify-center transition-colors", "hover:bg-stone text-ink-muted hover:text-ink")}>
                <Search className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Compact toggle */}
            <button onClick={() => setCompact(!compact)} title={compact ? "Comfortable view" : "Compact view"}
              className={cn("w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                compact ? "bg-blue-50 text-blue-deep border border-blue-200" : "hover:bg-stone text-ink-muted hover:text-ink")}>
              <AlignLeft className="w-3.5 h-3.5" />
            </button>

            <ModelSelector selected={selectedModel} onSelect={setSelectedModel} descriptions={MODEL_DESCRIPTIONS} />
            {messages.length > 0 && (
              <>
                <button onClick={exportChatPDF} title="Export as PDF"
                  className="w-7 h-7 rounded-md hover:bg-stone flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                  <FileDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={newChat} title={t("clearChat")}
                  className="w-7 h-7 rounded-md hover:bg-stone flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Messages area ── */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto relative">
          <div className="max-w-3xl mx-auto px-4 py-6">

            {isEmpty ? (
              /* Welcome screen */
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-deep flex items-center justify-center mb-5 shadow-lg">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-sans text-2xl font-bold text-ink mb-2">{t("title")}</h1>
                <p className="text-sm text-ink-secondary max-w-sm leading-relaxed mb-2">{t("subtitle")}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                  {MODES.map((m) => (
                    <span key={m.id} className={cn("flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-stone", mode === m.id && "border-blue-deep bg-blue-50")}>
                      <span className={m.color}>{m.icon}</span>{m.label}: {m.desc}
                    </span>
                  ))}
                </div>
                <div className="w-full max-w-md space-y-2">
                  {[
                    { emoji: "🌐", key: "fdi" }, { emoji: "🏢", key: "company" },
                    { emoji: "👷", key: "labor" }, { emoji: "⚖️", key: "dispute" }, { emoji: "💰", key: "tax" },
                  ].map(({ emoji, key }) => (
                    <button key={key} onClick={() => sendMessage(t(`quickPrompts.${key}` as "quickPrompts.fdi"))}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-stone hover:border-blue-deep/40 hover:shadow-sm text-left transition-all group">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-sm text-ink-secondary group-hover:text-ink transition-colors">
                        {t(`quickPrompts.${key}` as "quickPrompts.fdi")}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {chatSearch && (
                  <div className="text-[11px] text-ink-muted text-center mb-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    {visibleMessages.length === 0 ? "No messages match your search." : `Showing ${visibleMessages.length} of ${messages.length} messages matching "${chatSearch}"`}
                  </div>
                )}
                {visibleMessages.map((msg, i) => (
                  <MessageBubble key={msg.id} message={msg}
                    isLast={i === visibleMessages.length - 1}
                    onCopy={(text) => navigator.clipboard.writeText(text)}
                    onRegenerate={i === messages.length - 1 && msg.role === "assistant" ? handleRegenerate : undefined}
                    onFeedback={handleFeedback}
                    onToggleSave={toggleSave}
                    isSaved={savedIds.has(msg.id)}
                    copyLabel={t("copy")}
                    copiedLabel={t("copied")}
                    retryLabel={t("retry")}
                    saveLabel={t("saveMsg")}
                    unsaveLabel={t("unsaveMsg")}
                    wordCountLabel={t("wordCount")}
                    compact={compact}
                  />
                ))}
                {showTypingIndicator && <ThinkingCard modelName={selectedModel.name} mode={mode} messages={THINKING_MESSAGES} />}
                {showSuggestions && suggestions.length > 0 && !isLoading && (
                  <SuggestedFollowups suggestions={suggestions} label={t("suggestedFollowups")} onSelect={(s) => { sendMessage(s); setShowSuggestions(false); }} />
                )}
              </>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 mt-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                  <button onClick={() => { setError(null); handleRegenerate(); }}
                    className="text-xs text-red-600 font-semibold underline mt-1 hover:text-red-800">
                    {t("tryAgain")}
                  </button>
                </div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Jump to bottom button */}
          <AnimatePresence>
            {showJumpToBottom && (
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                onClick={jumpToBottom}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone shadow-md text-xs text-ink-secondary hover:text-ink hover:border-stone-dark transition-all">
                <ArrowDown className="w-3 h-3" /> {t("jumpToBottom")}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Disclaimer bar ── */}
        {!isEmpty && (
          <div className="flex-shrink-0 bg-amber-50 border-t border-amber-100 px-4 py-2 flex items-center justify-between gap-4">
            <p className="text-[11px] text-amber-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {t("disclaimer")}
            </p>
            <Link href="/contact"
              className="flex-shrink-0 text-[11px] font-semibold text-blue-deep hover:text-blue-action transition-colors whitespace-nowrap flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {t("bookConsultation")}
            </Link>
          </div>
        )}

        {/* ── Input area ── */}
        <div className="flex-shrink-0 bg-white border-t border-stone px-4 pt-3 pb-4">
          <div className="max-w-3xl mx-auto">

            {/* Custom context panel */}
            <div className="mb-2">
              <button onClick={() => setShowContext(!showContext)}
                className={cn("flex items-center gap-1.5 text-[11px] transition-colors",
                  customContext ? "text-blue-deep font-medium" : "text-ink-muted hover:text-ink")}>
                <Info className="w-3 h-3" />
                {customContext ? t("contextActive") : t("addContext")}
                <ChevronDown className={cn("w-3 h-3 transition-transform", showContext && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showContext && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <textarea
                      value={customContext}
                      onChange={(e) => setCustomContext(e.target.value)}
                      placeholder={t("contextPlaceholder")}
                      rows={2}
                      className="mt-2 w-full resize-none rounded-xl border border-blue-200 bg-blue-50/40 px-3 py-2 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-blue-deep transition-colors"
                    />
                    <p className="text-[10px] text-ink-muted mt-1">{t("contextHint")}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Format preset selector */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[10px] text-ink-muted font-medium flex-shrink-0">{t("format.label")}:</span>
              {([
                { id: "auto",       labelKey: "format.auto",       descKey: undefined },
                { id: "opinion",    labelKey: "format.opinion",    descKey: "format.opinionDesc" },
                { id: "summary",    labelKey: "format.summary",    descKey: "format.summaryDesc" },
                { id: "assessment", labelKey: "format.assessment", descKey: "format.assessmentDesc" },
              ] as const).map(({ id, labelKey, descKey }) => (
                <button key={id} onClick={() => setResponseFormat(id)}
                  title={descKey ? t(descKey) : t(labelKey)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold transition-all",
                    responseFormat === id
                      ? "bg-blue-deep text-white border-blue-deep shadow-sm"
                      : "bg-white text-ink-muted border-stone hover:border-stone-dark hover:text-ink"
                  )}>
                  {id !== "auto" && <FileText className="w-2.5 h-2.5 flex-shrink-0" />}
                  {t(labelKey)}
                </button>
              ))}
            </div>

            {/* Attached file preview */}
            <AnimatePresence>
              {attachedFile && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2.5 px-3 py-2 mb-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <Paperclip className="w-4 h-4 text-blue-deep flex-shrink-0" />
                  <span className="text-sm text-ink flex-1 truncate">{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="text-ink-muted hover:text-ink">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2 mb-2 bg-red-50 border border-red-200 rounded-xl">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-red-600 font-medium">{t("listening")}</span>
                  <button onClick={stopVoice} className="ml-auto text-red-500 hover:text-red-700 text-xs font-semibold">{t("stopListening")}</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main input box */}
            <form onSubmit={handleSubmit}>
              <div className={cn(
                "relative bg-white border rounded-2xl shadow-sm transition-all duration-200",
                "focus-within:border-blue-deep focus-within:shadow-md",
                isDragging ? "border-blue-deep border-2" : "border-stone"
              )}>
                <textarea ref={textareaRef} value={input} onChange={handleTextarea} onKeyDown={handleKeyDown}
                  placeholder={isListening ? t("listening") : t("placeholder")}
                  rows={1} disabled={isLoading}
                  className="w-full resize-none bg-transparent px-4 pt-3.5 pb-10 text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ maxHeight: "180px" }}
                />

                {/* Bottom controls inside textarea */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                  {/* File upload */}
                  <input ref={fileInputRef} type="file" className="hidden"
                    accept=".txt,.pdf,.docx,.doc,.md,.csv"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted hover:text-blue-deep hover:bg-blue-50 transition-all"
                    title="Attach file">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>

                  {/* Voice input */}
                  <button type="button" onClick={isListening ? stopVoice : startVoice}
                    className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                      isListening ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-ink-muted hover:text-blue-deep hover:bg-blue-50")}
                    title="Voice input">
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>

                  {/* Character count */}
                  {charCount > 0 && (
                    <span className={cn("text-[10px] font-mono", charCount > 8000 ? "text-red-500" : "text-ink-muted")}>
                      {charCount.toLocaleString()}
                    </span>
                  )}

                  {/* Mode indicator */}
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] text-ink-muted">
                    <span className={MODES.find((m) => m.id === mode)?.color}>
                      {MODES.find((m) => m.id === mode)?.icon}
                    </span>
                    {MODES.find((m) => m.id === mode)?.label}
                  </div>

                  {/* Send / Stop */}
                  {isLoading ? (
                    <button type="button" onClick={() => { abortRef.current?.abort(); setIsLoading(false); }}
                      className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={!input.trim() && !attachedFile}
                      className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                        (input.trim() || attachedFile)
                          ? "bg-blue-deep hover:bg-blue-action text-white shadow-sm"
                          : "bg-stone text-ink-muted cursor-not-allowed")}>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </form>

            <p className="text-[10px] text-ink-muted text-center mt-2">
              {t("inputHint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
