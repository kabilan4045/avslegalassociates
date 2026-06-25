import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
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
    } else {
      calBookingFailed = true;
      console.error("[verify-payment] Cal.com booking failed:", calResult.error);
    }
  }

  // 3. Format appointment for email
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

  const amountDisplay = amount ? `₹${(amount / 100).toLocaleString("en-IN")}` : "";
  const planLabel = body.planName || consultationType || "Legal Consultation";

  // 4. Send confirmation email
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey && email) {
    const resend = new Resend(resendKey);

    const meetingSection = calBookingFailed
      ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin:20px 0;text-align:center">
           <p style="color:#92400e;font-weight:700;margin:0 0 6px">Slot Confirmation In Progress</p>
           <p style="color:#b45309;font-size:0.85rem;margin:0">Your payment was successful. Our team will confirm your slot and send the meeting link shortly.</p>
         </div>`
      : meetingUrl
      ? `<div style="text-align:center;margin:28px 0">
           ${appointmentDisplay ? `<p style="color:#475569;font-size:0.85rem;margin:0 0 4px">Your appointment:</p>
           <p style="color:#0f172a;font-weight:800;font-size:1rem;margin:0 0 18px">${appointmentDisplay}</p>` : ""}
           <a href="${meetingUrl}" style="background:#16a34a;color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:0.95rem;display:inline-block">Join Meeting →</a>
         </div>`
      : "";

    await resend.emails.send({
      from: "AVS Legal Associates <noreply@avslegal.in>",
      to: email,
      subject: calBookingFailed
        ? "Payment Confirmed — Slot Being Arranged | AVS Legal Associates"
        : "Consultation Confirmed — AVS Legal Associates",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <div style="background:#0f172a;padding:28px 36px;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:1.4rem;font-weight:800">AVS Legal Associates</h1>
            <p style="color:#93c5fd;margin:4px 0 0;font-size:0.85rem">Adv. R. Abirami — Madras High Court</p>
          </div>
          <div style="background:#fff;padding:36px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">
            <div style="text-align:center;margin-bottom:24px">
              <div style="background:#dcfce7;border-radius:50%;width:60px;height:60px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style="color:#0f172a;margin:0 0 8px;font-size:1.5rem;font-weight:800">
                ${calBookingFailed ? "Payment Confirmed!" : "Booking Confirmed!"}
              </h2>
              <p style="color:#64748b;margin:0;font-size:0.9rem">Hi ${name}, your payment was received successfully.</p>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0">
              <tr style="background:#f8fafc">
                <td style="padding:12px 16px;font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;width:40%">Consultation</td>
                <td style="padding:12px 16px;font-size:0.9rem;color:#0f172a;font-weight:600">${planLabel}</td>
              </tr>
              ${appointmentDisplay ? `<tr style="border-top:1px solid #e2e8f0">
                <td style="padding:12px 16px;font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Appointment</td>
                <td style="padding:12px 16px;font-size:0.9rem;color:#0f172a;font-weight:600">${appointmentDisplay}</td>
              </tr>` : ""}
              ${amountDisplay ? `<tr style="border-top:1px solid #e2e8f0">
                <td style="padding:12px 16px;font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Amount Paid</td>
                <td style="padding:12px 16px;font-size:0.9rem;color:#16a34a;font-weight:700">${amountDisplay}</td>
              </tr>` : ""}
              <tr style="border-top:1px solid #e2e8f0">
                <td style="padding:12px 16px;font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Payment ID</td>
                <td style="padding:12px 16px;font-size:0.8rem;color:#475569;font-family:monospace">${razorpay_payment_id}</td>
              </tr>
            </table>
            ${meetingSection}
            <p style="color:#94a3b8;font-size:0.75rem;text-align:center;margin:24px 0 0;border-top:1px solid #f1f5f9;padding-top:16px">
              Questions? Email us at contact@avslegal.in
            </p>
          </div>
        </div>
      `,
    });
  }

  return NextResponse.json({
    success:         true,
    meetingUrl:      meetingUrl || null,
    calBookingUid:   calBookingUid || null,
    calBookingFailed,
    appointmentDisplay,
  });
}
