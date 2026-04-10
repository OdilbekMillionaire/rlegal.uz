import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const revalidate = 3600; // 1-hour cache

const QuerySchema = z.object({
  q: z.string().min(1).max(200).default("Uzbekistan"),
  court: z.string().max(50).optional(),
  type: z.enum(["o", "oa", "r", "de", "af", "op", "ot"]).optional(), // opinion types
  page: z.coerce.number().int().min(1).max(10).default(1),
  order_by: z.enum(["score desc", "dateFiled desc", "dateFiled asc"]).default("score desc"),
});

const COURT_LISTENER_BASE = "https://www.courtlistener.com/api/rest/v4";
const API_KEY = process.env.COURT_LISTENER_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = QuerySchema.safeParse({
    q: searchParams.get("q") ?? "Uzbekistan",
    court: searchParams.get("court") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    page: searchParams.get("page") ?? 1,
    order_by: searchParams.get("order_by") ?? "score desc",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", details: parsed.error.flatten() }, { status: 400 });
  }

  const { q, court, type, page, order_by } = parsed.data;

  const params = new URLSearchParams({
    q,
    order_by,
    page: String(page),
    page_size: "12",
    type: "o", // opinions by default
    highlight: "on",
  });

  if (court) params.set("court", court);
  if (type) params.set("type", type);

  try {
    const res = await fetch(`${COURT_LISTENER_BASE}/search/?${params.toString()}`, {
      headers: {
        Authorization: `Token ${API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[case-law] CourtListener error:", res.status, errText);
      return NextResponse.json({ error: "CourtListener API error", status: res.status }, { status: 502 });
    }

    const data = await res.json();

    // Normalize results
    const results = (data.results ?? []).map((item: Record<string, unknown>) => ({
      id: item.id,
      caseName: item.caseName ?? item.case_name ?? "Untitled Case",
      court: item.court ?? item.court_id ?? "",
      courtName: item.court_citation_string ?? item.court ?? "",
      dateFiled: item.dateFiled ?? item.date_filed ?? null,
      dateArgued: item.dateArgued ?? null,
      citations: Array.isArray(item.citation) ? item.citation : [],
      judges: item.judge ?? "",
      status: item.status ?? "",
      snippet: item.snippet ?? item.text ?? "",
      absoluteUrl: item.absolute_url
        ? `https://www.courtlistener.com${item.absolute_url}`
        : null,
      cluster: item.cluster_id ?? null,
      docketNumber: item.docketNumber ?? item.docket_number ?? "",
    }));

    return NextResponse.json({
      count: data.count ?? 0,
      next: data.next,
      previous: data.previous,
      results,
    });
  } catch (err) {
    console.error("[case-law] fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch case law data" }, { status: 500 });
  }
}
