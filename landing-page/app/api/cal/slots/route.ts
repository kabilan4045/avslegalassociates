import { NextRequest, NextResponse } from "next/server";
import { fetchCalSlots, getEventTypeId } from "@/lib/cal";

/**
 * GET /api/cal/slots?consultationType=quick&date=2026-06-10
 *
 * Returns available time slots for the given consultation type and date.
 * Proxies Cal.com API — keeps API key server-side only.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const consultationType = searchParams.get("consultationType") || "quick";
  const dateISO = searchParams.get("date") || "";

  if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    return NextResponse.json(
      { slots: [], error: "Invalid or missing date. Expected YYYY-MM-DD." },
      { status: 400 }
    );
  }

  // Reject past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(dateISO + "T00:00:00");
  if (selected <= today) {
    return NextResponse.json(
      { slots: [], error: "Cannot book a past or same-day date." },
      { status: 400 }
    );
  }

  const eventTypeId = getEventTypeId(consultationType);

  if (!process.env.CAL_API_KEY) {
    console.error("[/api/cal/slots] CAL_API_KEY not configured");
    return NextResponse.json(
      { slots: [], error: "Scheduling service not configured." },
      { status: 500 }
    );
  }

  const slots = await fetchCalSlots(eventTypeId, dateISO);

  return NextResponse.json(
    { slots },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
      },
    }
  );
}
