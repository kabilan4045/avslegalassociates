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
  const [timePart, meridiem] = timeSlot.trim().split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;

  const [year, month, day] = dateISO.split("-").map(Number);
  // Build the instant as if it were UTC, then subtract 5h30m to get true UTC
  const pseudoUtc = Date.UTC(year, month - 1, day, hours, minutes, 0);
  const utcMs = pseudoUtc - 330 * 60 * 1000; // IST is UTC+5:30
  return new Date(utcMs).toISOString();
}

// ── Event type ID helpers ──────────────────────────────────────────────────────

export function getEventTypeId(consultationType: string): number {
  if (consultationType === "detailed")
    return Number(process.env.CAL_EVENT_TYPE_ID_45MIN) || 5807966;
  if (consultationType === "quick")
    return Number(process.env.CAL_EVENT_TYPE_ID_15MIN) || 5807967;
  // doubt
  return Number(process.env.CAL_EVENT_TYPE_ID_10MIN) || 5807967;
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

  const startISO = istSlotToUTC(params.dateISO, params.timeSlot);
  const eventTypeId = getEventTypeId(params.consultationType);

  try {
    const res = await fetch(`${CAL_API_BASE}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": CAL_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeId,
        start: startISO,
        attendee: {
          name: params.name,
          email: params.email,
          timeZone: "Asia/Kolkata",
          language: "en",
        },
        metadata: {},
        ...(params.notes ? { responses: { notes: params.notes } } : {}),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Cal.com] Booking failed:", data);
      return { success: false, error: data?.message || "Cal.com booking failed" };
    }

    const booking = data?.data ?? data;
    return {
      success: true,
      bookingUid: booking?.uid,
      meetingUrl: booking?.meetingUrl ?? booking?.videoCallUrl ?? "",
      startTime: booking?.start ?? startISO,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Cal.com] createCalBooking exception:", msg);
    return { success: false, error: msg };
  }
}
