import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createCalBooking } from "@/lib/cal";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    name,
    email,
    consultationType,
    query,
    amount,
    selectedDate,
    selectedTime,
  } = body;

  // 1. Verify Razorpay HMAC signature
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Create Cal.com booking (only after payment verified)
  let meetingUrl = "";
  let calBookingUid = "";
  let appointmentStart = "";
  let calBookingFailed = false;

  if (selectedDate && selectedTime) {
    console.log("[verify-payment] Attempting Cal.com booking:", { name, email, selectedDate, selectedTime, consultationType });
    const calResult = await createCalBooking({
      name:             name || "Client",
      email:            email || "",
      dateISO:          selectedDate,
      timeSlot:         selectedTime,
      consultationType: consultationType || "quick",
      notes:            query || "",
    });

    if (calResult.success) {
      meetingUrl       = calResult.meetingUrl  || "";
      calBookingUid    = calResult.bookingUid  || "";
      appointmentStart = calResult.startTime   || "";
      console.log("[verify-payment] Cal.com booking succeeded:", { calBookingUid, meetingUrl, appointmentStart });
    } else {
      calBookingFailed = true;
      console.error("[verify-payment] Cal.com booking failed:", calResult.error, { selectedDate, selectedTime, consultationType });
    }
  } else {
    console.error("[verify-payment] Cal.com booking SKIPPED — missing date or time:", { selectedDate, selectedTime });
  }

  // 3. Format appointment display (returned to client for success screen)
  let appointmentDisplay = "";
  if (appointmentStart) {
    try {
      appointmentDisplay = new Date(appointmentStart).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + " IST";
    } catch {
      appointmentDisplay = appointmentStart;
    }
  } else if (selectedDate && selectedTime) {
    try {
      const formatted = new Date(selectedDate).toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      appointmentDisplay = `${formatted} at ${selectedTime} IST`;
    } catch {
      appointmentDisplay = `${selectedDate} at ${selectedTime}`;
    }
  }

  // Suppress unused-variable warnings for amount — kept in destructure for
  // potential future use (logging, analytics) without breaking the call signature.
  void amount;

  return NextResponse.json({
    success:           true,
    meetingUrl:        meetingUrl || null,
    calBookingUid:     calBookingUid || null,
    calBookingFailed,
    appointmentDisplay,
  });
}
