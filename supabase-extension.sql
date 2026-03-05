-- Feedback.ai Schema Extension

-- 0. Ensure public.users exists and has RLS policies for public access
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure username uniqueness if table already existed without it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_username_key') THEN
        ALTER TABLE public.users ADD CONSTRAINT users_username_key UNIQUE (username);
    END IF;
END $$;

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Polices for users
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 1. Profiles Table (linking to users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  headline TEXT, -- "What they do"
  skills TEXT[], -- Array of skills
  website TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Update Testimonials Table
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS client_company TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS original_text TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS improved_text TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Enable RLS for testimonials and allow public viewing
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON public.testimonials;
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own testimonials" ON public.testimonials;
CREATE POLICY "Users can manage their own testimonials" ON public.testimonials FOR ALL USING (auth.uid() = user_id);

-- 3. Update Testimonial Requests Table
ALTER TABLE public.testimonial_requests ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.testimonial_requests ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.testimonial_requests ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.testimonial_requests ADD COLUMN IF NOT EXISTS submission_count INTEGER DEFAULT 0;

-- 4. Analytics Events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'link_open', 'submission', 'page_view'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own analytics" ON public.analytics_events;
CREATE POLICY "Users can view their own analytics" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can insert analytics events" ON public.analytics_events;
CREATE POLICY "Public can insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- 5. Subscriptions Table (for Stripe)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT,
  price_id TEXT,
  quantity INTEGER,
  cancel_at_period_end BOOLEAN,
  created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  current_period_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  current_period_end TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 6. Trigger to create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_with_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Analytics & Counters (Atomic Increments)
CREATE OR REPLACE FUNCTION public.increment_view_count(row_id UUID) 
RETURNS void AS $$
BEGIN
  UPDATE public.testimonial_requests
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_submission_count(row_id UUID) 
RETURNS void AS $$
BEGIN
  UPDATE public.testimonial_requests
  SET submission_count = COALESCE(submission_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Testimonial Requests RLS
ALTER TABLE public.testimonial_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Testimonial requests are viewable by everyone" ON public.testimonial_requests;
CREATE POLICY "Testimonial requests are viewable by everyone" ON public.testimonial_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own requests" ON public.testimonial_requests;
CREATE POLICY "Users can manage their own requests" ON public.testimonial_requests FOR ALL USING (auth.uid() = user_id);

-- Replace existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_with_profile();
