// Shared TypeScript types for AVS Legal booking system

export type ConsultationType = "doubt" | "quick" | "detailed";
export type PaymentStatus = "pending" | "paid" | "failed";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  legal_query: string | null;
  consultation_type: ConsultationType;
  amount: number; // paise
  payment_id: string | null;
  order_id: string | null;
  payment_status: PaymentStatus;
  selected_date: string | null; // "YYYY-MM-DD"
  selected_time: string | null; // "10:00 AM"
  cal_booking_uid: string | null;
  meeting_url: string | null;
  booking_status: BookingStatus;
  email_sent: boolean;
  webhook_verified: boolean;
  // Legacy columns (kept for backward compat)
  plan?: string;
  status?: string;
}

export interface CalSlot {
  time: string;        // ISO UTC string from Cal.com
  displayTime: string; // "10:00 AM" in IST
}

export interface CalSlotsResponse {
  slots: CalSlot[];
  error?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  meetingUrl?: string;
  calBookingUid?: string;
  bookingId?: string;
  calBookingFailed?: boolean;
  error?: string;
}

// Plan type used in the UI
export interface PlanDefinition {
  id: ConsultationType;
  name: string;
  price: number;       // INR
  paise: number;       // price * 100
  duration: string;
  features: string[];
  popular?: boolean;
  eventTypeId: number; // Cal.com event type ID
  calSlug: string;     // Cal.com slug for display
}

export const CONSULTATION_PLANS: PlanDefinition[] = [
  {
    id: "doubt",
    name: "Legal Doubt Clearance",
    price: 300,
    paise: 30000,
    duration: "10-minute session",
    calSlug: "abiramiadvocate/15min",
    eventTypeId: Number(process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_DOUBT) || 5807967,
    features: [
      "Quick answer to your specific legal question",
      "Understand your rights in a particular situation",
      "No documents required",
      "Ideal for: first-time queries & emergency guidance",
    ],
  },
  {
    id: "quick",
    name: "Quick Legal Consultation",
    price: 500,
    paise: 50000,
    duration: "15-minute session",
    calSlug: "abiramiadvocate/15min",
    eventTypeId: Number(process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_QUICK) || 5807967,
    features: [
      "In-depth review of your legal situation",
      "Case assessment & recommended next steps",
      "Written summary sent to your email after the session",
      "Ideal for: disputes, court notices, family matters",
    ],
    popular: true,
  },
  {
    id: "detailed",
    name: "Detailed Legal Consultation",
    price: 2000,
    paise: 200000,
    duration: "45-minute session",
    calSlug: "abiramiadvocate/30min",
    eventTypeId: Number(process.env.NEXT_PUBLIC_CAL_EVENT_TYPE_DETAILED) || 5807966,
    features: [
      "Comprehensive case analysis and legal strategy",
      "Document review included",
      "Detailed written advice report within 24 hours",
      "Ideal for: property disputes, criminal & complex cases",
    ],
  },
];

export function getPlanByType(type: ConsultationType): PlanDefinition {
  return CONSULTATION_PLANS.find((p) => p.id === type) ?? CONSULTATION_PLANS[1];
}
