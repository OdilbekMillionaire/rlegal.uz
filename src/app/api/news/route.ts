import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  q: z.string().optional().default("Uzbekistan law investment business"),
  category: z.enum(["business", "technology", "general", "science", "health", "entertainment", "sports"]).optional().default("business"),
  language: z.enum(["en", "ru"]).optional().default("en"),
  sortBy: z.enum(["publishedAt", "relevancy", "popularity"]).optional().default("publishedAt"),
  page: z.coerce.number().int().min(1).max(5).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(30).optional().default(12),
});

export const runtime = "nodejs";
export const revalidate = 1800; // 30 min cache

export async function GET(req: NextRequest) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "News API not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    language: searchParams.get("language") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", details: parsed.error.flatten() }, { status: 400 });
  }

  const { q, category, language, sortBy, page, pageSize } = parsed.data;

  // Build search query — add Uzbekistan context if not already in query
  const searchQuery = q.toLowerCase().includes("uzbekistan")
    ? q
    : `${q} Uzbekistan`;

  // Use /everything endpoint for flexible search + language support
  const params = new URLSearchParams({
    q: searchQuery,
    language,
    sortBy,
    page: String(page),
    pageSize: String(pageSize),
    apiKey,
  });

  // For Russian news specifically, use broader query
  if (language === "ru") {
    params.set("q", `Узбекистан инвестиции бизнес право ${category === "business" ? "экономика" : category}`);
  }

  try {
    const url = `https://newsapi.org/v2/everything?${params.toString()}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "R-Legal-Practice/1.0" },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: "NewsAPI error", code: err.code ?? res.status, message: err.message ?? "Unknown error" },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = await res.json();

    // Filter out articles with [Removed] content
    const articles = (data.articles ?? []).filter(
      (a: { title?: string; description?: string; urlToImage?: string }) =>
        a.title && a.title !== "[Removed]" && a.description && a.description !== "[Removed]"
    );

    return NextResponse.json({
      articles,
      totalResults: data.totalResults ?? 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error("[api/news] fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
