import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UZBEKISTAN_LAW_SYSTEM_PROMPT } from "@/lib/ai-models";

const RequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().max(20000),
    })
  ).min(1).max(100),
  model: z.string().default("claude-sonnet-4-6"),
  mode: z.enum(["fast", "balanced", "deep"]).default("balanced"),
  systemAddition: z.string().max(2000).optional(),
});

// ─── Model priority chains per mode ───────────────────────────────────────
// Try models in order; move to next on 503/404/unavailable
const MODEL_CHAIN: Record<string, string[]> = {
  fast:     ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite"],
  balanced: ["gemini-2.5-flash",      "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"],
  deep:     ["gemini-2.5-pro",        "gemini-2.5-flash",      "gemini-2.5-flash-lite"],
};

// Display model → mode (so we pick the right chain)
const DISPLAY_TO_MODE: Record<string, string> = {
  "claude-sonnet-4-6": "deep",
  "gpt-4o":            "balanced",
  "gpt-4o-mini":       "fast",
  "gemini-2_5-pro":    "deep",
  "gemini-2_0-flash":  "fast",
  "mistral-large":     "balanced",
  "llama-3_3-70b":     "fast",
};

function getChain(displayModel: string, mode: string): string[] {
  return MODEL_CHAIN[mode] ?? MODEL_CHAIN[DISPLAY_TO_MODE[displayModel] ?? "balanced"] ?? MODEL_CHAIN.balanced;
}

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("503") ||
    msg.includes("404") ||
    msg.includes("overloaded") ||
    msg.includes("high demand") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("no longer available") ||
    msg.includes("not found")
  );
}

// ─── Gemini Streaming (auto-fallback through model chain) ─────────────────
async function streamGemini(
  messages: { role: string; content: string }[],
  displayModel: string,
  mode: string,
  systemAddition?: string
): Promise<ReadableStream> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

  const systemInstruction = systemAddition
    ? `${UZBEKISTAN_LAW_SYSTEM_PROMPT}\n\n${systemAddition}`
    : UZBEKISTAN_LAW_SYSTEM_PROMPT;

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;

  const chain = getChain(displayModel, mode);
  let lastErr: unknown;

  for (const modelId of chain) {
    try {
      console.log(`[AI] Trying ${modelId}…`);
      const geminiModel = genAI.getGenerativeModel({ model: modelId, systemInstruction });
      const chat = geminiModel.startChat({ history });
      const result = await chat.sendMessageStream(lastMessage);

      const encoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const delta = chunk.text();
              if (delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    } catch (err) {
      lastErr = err;
      if (isRetryable(err)) {
        console.warn(`[AI] ${modelId} unavailable, trying next…`);
        continue;
      }
      throw err; // non-retryable — bubble up immediately
    }
  }

  // All models in chain exhausted
  throw lastErr ?? new Error("All AI models are currently unavailable. Please try again later.");
}

// ─── Route Handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request: " + parsed.error.message },
        { status: 400 }
      );
    }

    const { messages, model, mode, systemAddition } = parsed.data;

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const stream = await streamGemini(messages, model, mode, systemAddition);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("[AI Chat API Error]:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
