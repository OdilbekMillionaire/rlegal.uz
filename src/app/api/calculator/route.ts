import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateComplexity } from "@/lib/utils";

const Schema = z.object({
  investmentType: z.enum(["fdi", "jv", "ma", "contract", "dispute"]),
  sector: z.enum(["tech", "energy", "real-estate", "finance", "manufacturing", "retail"]),
  originCountry: z.string().min(1).max(100),
  timeline: z.enum(["urgent", "standard", "planned", "strategic"]),
  estimatedValue: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const result = calculateComplexity(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
