/**
 * Cal.com API helper — v2 REST API
 *
 * Two main operations:
 *   1. fetchCalSlots()    — get available time slots for a given event type + date
 *   2. createCalBooking() — create a confirmed booking (called ONLY after payment)
 */

import type { CalSlot } from "@/lib/types";

const CAL_API_BASE = "https://api.cal.com/v2";
const CAL_API_VERSION = "2024-08-13";

// ── IST conversion helpers ─────────────────────────────────────────────────────

/** Convert UTC ISO string → "10:00 AM" display in IST (UTC+5:30) */
export function utcToISTDisplay(utcIso: string): string {
  try {
    return new Date(utcIso).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return utcIso;
  }
}

/** Convert user-selected date (YYYY-MM-DD) + time ("10:00 AM") in IST → UTC ISO string */
export function istSlotToUTC(dateISO: string, timeSlot: string): string {
  // Node.js 18+ en-IN locale uses U+202F (narrow no-break space) between time and
  // meridiem — replace any Unicode whitespace before matching so split(" ") never silently
  // produces NaN minutes and an invalid ISO string.
  const normalized = timeSlot.trim().replace(/[\s  ]+/g, " ");
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    console.error("[Cal.com] istSlotToUTC: cannot parse time slot:", JSON.stringify(timeSlot), "normalized:", JSON.stringify(normalized));
    throw new Error(`istSlotToUTC: unparseable time slot "${timeSlot}"`);
  }
  let hours   = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const [year, month, day] = dateISO.split("-").map(Number);
  // Build the instant as if it were UTC, then subtract 5h30m to get true UTC
  const pseudoUtc = Date.UTC(year, month - 1, day, hours, minutes, 0);
  const utcMs = pseudoUtc - 330 * 60 * 1000; // IST is UTC+5:30
  return new Date(utcMs).toISOString();
}

// ── Event type ID helpers ──────────────────────────────────────────────────────

export function getEventTypeId(consultationType: string): number {
  // Prefer the server-only vars; fall back to NEXT_PUBLIC_ variants (which users typically
  // set in .env.local). Never fall back to hardcoded IDs — those belong to a different
  // Cal.com account and will silently 403/404.
  let id: number;
  if (consultationType === "detailed") {
    id = Number(process.env.CAL_EVENT_TYPE_ID_45MIN) ||
         Number(process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_DETAILED) || 0;
  } else if (consultationType === "quick") {
    id = Number(process.env.CAL_EVENT_TYPE_ID_15MIN) ||
         Number(process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_QUICK) || 0;
  } else {
    // doubt
    id = Number(process.env.CAL_EVENT_TYPE_ID_10MIN) ||
         Number(process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_DOUBT) || 0;
  }
  if (!id) {
    console.error(
      `[Cal.com] getEventTypeId: no event type ID configured for "${consultationType}". ` +
      `Set CAL_EVENT_TYPE_ID_45MIN / CAL_EVENT_TYPE_ID_15MIN / CAL_EVENT_TYPE_ID_10MIN in .env.local.`
    );
  }
  return id;
}

// ── Fetch available slots ──────────────────────────────────────────────────────

/**
 * Fetches available time slots from Cal.com for a given event type and date.
 * Returns slots converted to IST display times.
 *
 * @param eventTypeId  Cal.com event type ID
 * @param dateISO      "YYYY-MM-DD" in IST (user-selected date)
 */
export async function fetchCalSlots(
  eventTypeId: number,
  dateISO: string
): Promise<CalSlot[]> {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    console.error("[Cal.com] CAL_API_KEY not configured");
    return [];
  }

  // Build day boundaries in UTC (IST day = UTC day - 5:30 start, +18:30 end)
  const [year, month, day] = dateISO.split("-").map(Number);
  const dayStartIST = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 330 * 60 * 1000);
  const dayEndIST   = new Date(Date.UTC(year, month - 1, day, 23, 59, 0) - 330 * 60 * 1000);

  const params = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    startTime:   dayStartIST.toISOString(),
    endTime:     dayEndIST.toISOString(),
    timeZone:    "Asia/Kolkata",
  });

  try {
    const res = await fetch(`${CAL_API_BASE}/slots/available?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": CAL_API_VERSION,
      },
      next: { revalidate: 60 }, // cache for 60s
    });

    if (!res.ok) {
      console.error("[Cal.com] Slots fetch failed:", res.status, await res.text());
      return [];
    }

    const json = await res.json();

    // Response shape: { status, data: { slots: { "YYYY-MM-DD": [{ time: ISO }] } } }
    const slotsForDate: { time: string }[] =
      json?.data?.slots?.[dateISO] ??
      json?.slots?.[dateISO] ??
      [];

    return slotsForDate.map((s) => ({
      time:        s.time,
      displayTime: utcToISTDisplay(s.time),
    }));
  } catch (err) {
    console.error("[Cal.com] fetchCalSlots exception:", err);
    return [];
  }
}

// ── Create booking (ONLY called after payment success) ─────────────────────────

export interface CalBookingResult {
  success: boolean;
  bookingUid?: string;
  meetingUrl?: string;
  startTime?: string;
  error?: string;
}

export async function createCalBooking(params: {
  name: string;
  email: string;
  dateISO: string;         // "YYYY-MM-DD"
  timeSlot: string;        // "10:00 AM" IST
  consultationType: string; // "doubt" | "quick" | "detailed"
  notes?: string;
}): Promise<CalBookingResult> {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return { success: false, error: "CAL_API_KEY not configured" };
  if (!params.dateISO || !params.timeSlot) return { success: false, error: "Date/time not provided" };

  let startISO: string;
  try {
    startISO = istSlotToUTC(params.dateISO, params.timeSlot);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Cal.com] createCalBooking: IST→UTC conversion failed:", msg, { dateISO: params.dateISO, timeSlot: params.timeSlot });
    return { success: false, error: `Time conversion failed: ${msg}` };
  }

  const eventTypeId = getEventTypeId(params.consultationType);
  if (!eventTypeId) {
    return { success: false, error: `No Cal.com event type ID configured for "${params.consultationType}"` };
  }

  // responses: { notes } is intentionally omitted — it only works if the Cal.com event type
  // has a custom "notes" booking form field configured, otherwise the API returns 422.
  // Use metadata for free-form internal data instead.
  const requestPayload = {
    eventTypeId,
    start: startISO,
    attendee: {
      name:     params.name,
      email:    params.email,
      timeZone: "Asia/Kolkata",
      language: "en",
    },
    metadata: {
      notes:  params.notes || "",
      source: "avslegal-website",
    },
  };

  console.log("[Cal.com] createCalBooking → sending payload:", JSON.stringify(requestPayload));

  try {
    const res = await fetch(`${CAL_API_BASE}/bookings`, {
      method: "POST",
      headers: {
        Authorization:      `Bearer ${apiKey}`,
        "cal-api-version":  CAL_API_VERSION,
        "Content-Type":     "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const rawText = await res.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = {};
    }

    if (!res.ok) {
      console.error("[Cal.com] Booking failed — status:", res.status, "body:", rawText, "payload sent:", JSON.stringify(requestPayload));
      return { success: false, error: (data?.message as string) || `Cal.com ${res.status}` };
    }

    console.log("[Cal.com] Booking created — status:", res.status, "response:", rawText);

    const booking = (data?.data ?? data) as Record<string, unknown>;
    return {
      success:    true,
      bookingUid: booking?.uid as string | undefined,
      meetingUrl: (booking?.meetingUrl ?? booking?.videoCallUrl ?? "") as string,
      startTime:  (booking?.start ?? startISO) as string,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Cal.com] createCalBooking exception:", err, "payload was:", JSON.stringify(requestPayload));
    return { success: false, error: msg };
  }
}
