-- Migration 001: Security fixes, indexes, constraints, and testimonial status column
-- Run this against your Supabase database

-- ============================================================
-- 1. FIX OVERLY PERMISSIVE RLS POLICIES
-- ============================================================

-- Fix testimonials INSERT policy: only allow inserts where request_id belongs to a valid request
-- and the user_id matches the request owner (prevents inserting testimonials for arbitrary users)
DROP POLICY IF EXISTS "Public can submit testimonials via requests." ON public.testimonials;
DROP POLICY IF EXISTS "Public can submit testimonials" ON public.testimonials;

CREATE POLICY "Public can submit testimonials via valid requests"
  ON public.testimonials FOR INSERT
  WITH CHECK (
    request_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.testimonial_requests tr
      WHERE tr.id = request_id
      AND tr.user_id = testimonials.user_id
    )
  );

-- Fix analytics_events INSERT policy: only allow inserts where user_id matches
-- a valid user (prevents inserting fake analytics for nonexistent users)
DROP POLICY IF EXISTS "Public can insert analytics events" ON public.analytics_events;

CREATE POLICY "Public can insert analytics events for valid users"
  ON public.analytics_events FOR INSERT
  WITH CHECK (
    user_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = user_id
    )
  );

-- ============================================================
-- 2. ADD TESTIMONIAL STATUS COLUMN (for approval workflow)
-- ============================================================

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- ============================================================
-- 3. ADD DATABASE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON public.testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_request_id ON public.testimonials(request_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);

CREATE INDEX IF NOT EXISTS idx_testimonial_requests_user_id ON public.testimonial_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonial_requests_slug ON public.testimonial_requests(slug);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- ============================================================
-- 4. ADD CHECK CONSTRAINTS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'testimonial_requests_view_count_non_negative'
  ) THEN
    ALTER TABLE public.testimonial_requests
      ADD CONSTRAINT testimonial_requests_view_count_non_negative CHECK (view_count >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'testimonial_requests_submission_count_non_negative'
  ) THEN
    ALTER TABLE public.testimonial_requests
      ADD CONSTRAINT testimonial_requests_submission_count_non_negative CHECK (submission_count >= 0);
  END IF;
END $$;

-- ============================================================
-- 5. SUBSCRIPTIONS TABLE RLS POLICIES (needed for webhook writes)
-- ============================================================

-- Allow service role to insert/update subscriptions (webhooks use service role key)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- Since service role bypasses RLS, we just need to ensure the table has RLS enabled
-- and that regular users can only read their own subscriptions (already exists)
-- The webhook handler will use the service role key which bypasses RLS.

-- Allow users to view their own subscriptions (policy may already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own subscription' AND tablename = 'subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscription"
      ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
