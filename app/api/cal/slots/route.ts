import { NextRequest, NextResponse } from "next/server";
import { fetchCalSlots, getEventTypeId } from "@/lib/cal";

const CAL_API_BASE = "https://api.cal.com/v2";
const CAL_API_VERSION = "2024-08-13";

/**
 * GET /api/cal/slots?consultationType=quick&date=2026-06-10
 *   → returns available time slots for a single day
 *
 * GET /api/cal/slots?consultationType=quick&month=2026-07
 *   → returns set of dates that have at least one slot (for calendar greying)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const consultationType = searchParams.get("consultationType") || "quick";
  const month  = searchParams.get("month") || "";
  const dateISO = searchParams.get("date") || "";

  if (!process.env.CAL_API_KEY) {
    return NextResponse.json({ slots: [], error: "Scheduling service not configured." }, { status: 500 });
  }

  const eventTypeId = getEventTypeId(consultationType);

  // ── Month mode: return which dates have any availability ──────────────────
  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ availableDates: [] }, { status: 400 });
    }
    const [y, m] = month.split("-").map(Number);
    const firstDay = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0) - 330 * 60 * 1000);
    const lastDay  = new Date(Date.UTC(y, m,     0, 23, 59, 0) - 330 * 60 * 1000);

    const params = new URLSearchParams({
      eventTypeId: String(eventTypeId),
      startTime:   firstDay.toISOString(),
      endTime:     lastDay.toISOString(),
      timeZone:    "Asia/Kolkata",
    });

    try {
      const res = await fetch(`${CAL_API_BASE}/slots/available?${params}`, {
        headers: {
          Authorization:     `Bearer ${process.env.CAL_API_KEY}`,
          "cal-api-version": CAL_API_VERSION,
        },
        next: { revalidate: 300 },
      });
      if (!res.ok) {
        return NextResponse.json({ availableDates: [] });
      }
      const json = await res.json();
      const slotsMap: Record<string, unknown[]> = json?.data?.slots ?? json?.slots ?? {};
      const availableDates = Object.keys(slotsMap).filter(d => (slotsMap[d] as unknown[]).length > 0);
      return NextResponse.json(
        { availableDates },
        { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" } }
      );
    } catch {
      return NextResponse.json({ availableDates: [] });
    }
  }

  // ── Single day mode ───────────────────────────────────────────────────────
  if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    return NextResponse.json({ slots: [], error: "Invalid or missing date. Expected YYYY-MM-DD." }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(dateISO + "T00:00:00") <= today) {
    return NextResponse.json({ slots: [], error: "Cannot book a past or same-day date." }, { status: 400 });
  }

  const slots = await fetchCalSlots(eventTypeId, dateISO);
  return NextResponse.json(
    { slots },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=30" } }
  );
}
