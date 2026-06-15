-- 1. Add UPI-related columns to the payments table if they do not exist
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS upi_ref TEXT,
ADD COLUMN IF NOT EXISTS utr TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 2. Drop old Razorpay columns if they are no longer needed (Optional, keeping them is safe too)
-- ALTER TABLE payments DROP COLUMN IF EXISTS razorpay_order_id;
-- ALTER TABLE payments DROP COLUMN IF EXISTS razorpay_payment_id;

-- 3. Re-enable Row Level Security and setup the correct UPI check policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own pending payments" ON payments;
CREATE POLICY "Users can create own pending payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending' AND plan IN ('pro', 'premium'));

DROP POLICY IF EXISTS "Users can submit proof for own pending payments" ON payments;
CREATE POLICY "Users can submit proof for own pending payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'completed');

-- 4. Re-create the storage bucket policies for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own payment proofs" ON storage.objects;
CREATE POLICY "Users can upload own payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can view own payment proofs" ON storage.objects;
CREATE POLICY "Users can view own payment proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
  );
