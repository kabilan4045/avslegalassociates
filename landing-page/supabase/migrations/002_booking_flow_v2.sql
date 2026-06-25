-- Migration 002: Booking Flow v2 — additive changes only
-- Safe to run against existing table; no rows deleted.

-- Add new columns
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS legal_query        TEXT,
  ADD COLUMN IF NOT EXISTS consultation_type  TEXT,
  ADD COLUMN IF NOT EXISTS selected_date      DATE,
  ADD COLUMN IF NOT EXISTS selected_time      TEXT,
  ADD COLUMN IF NOT EXISTS payment_status     TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS booking_status     TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS email_sent         BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS webhook_verified   BOOLEAN DEFAULT FALSE;

-- Back-fill consultation_type from old plan column
UPDATE bookings
SET consultation_type =
  CASE
    WHEN plan ILIKE '%detailed%'  THEN 'detailed'
    WHEN plan ILIKE '%quick%'     THEN 'quick'
    ELSE 'doubt'
  END
WHERE consultation_type IS NULL AND plan IS NOT NULL;

-- Back-fill payment_status from old status column
UPDATE bookings
SET payment_status = status
WHERE payment_status = 'pending' AND status IS NOT NULL;

-- Back-fill booking_status
UPDATE bookings
SET booking_status = CASE WHEN status = 'paid' THEN 'confirmed' ELSE 'pending' END
WHERE booking_status = 'pending' AND status IS NOT NULL;

-- Back-fill selected_date / selected_time
UPDATE bookings
SET
  selected_date = date::date,
  selected_time = time
WHERE selected_date IS NULL AND date IS NOT NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status     ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status     ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_selected_date      ON bookings(selected_date);
CREATE INDEX IF NOT EXISTS idx_bookings_consultation_type  ON bookings(consultation_type);
CREATE INDEX IF NOT EXISTS idx_bookings_email              ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at         ON bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Deny all anon/authenticated client-side access
-- All reads/writes go through Next.js API routes using service role key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'bookings' AND policyname = 'deny_anon_all'
  ) THEN
    CREATE POLICY deny_anon_all ON bookings
      FOR ALL TO anon USING (false) WITH CHECK (false);
  END IF;
END $$;
