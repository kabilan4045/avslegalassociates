import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import type { ConsultationType } from "@/lib/types";

const AMOUNT_MAP: Record<ConsultationType, number> = {
  doubt:    30000,   // ₹300
  quick:    50000,   // ₹500
  detailed: 200000,  // ₹2,000
};

export async function POST(req: NextRequest) {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const consultationType: ConsultationType =
    body.consultationType ?? (body.planName as ConsultationType) ?? "quick";

  const amount = AMOUNT_MAP[consultationType] ?? AMOUNT_MAP.quick;

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        name:             body.name     || "",
        email:            body.email    || "",
        phone:            body.phone    || "",
        consultationType: consultationType,
        legal_query:      body.query    || "",
        selectedDate:     body.selectedDate || "",
        selectedTime:     body.selectedTime || "",
      },
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
