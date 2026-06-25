CREATE TABLE bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text,
  phone text,
  plan text,
  amount integer,
  payment_id text UNIQUE,
  order_id text,
  status text DEFAULT 'paid',
  query text,
  created_at timestamptz DEFAULT now()
);

-- Index for dashboard filters
CREATE INDEX bookings_created_at_idx ON bookings (created_at DESC);
CREATE INDEX bookings_plan_idx ON bookings (plan);
