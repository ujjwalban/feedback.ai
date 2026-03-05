-- Feedback.ai Supabase SQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." 
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.users FOR SELECT USING (true); -- needed for public portfolio

CREATE POLICY "Users can update their own profile." 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Testimonial Requests Table
CREATE TABLE public.testimonial_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for testimonial requests
ALTER TABLE public.testimonial_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own requests."
  ON public.testimonial_requests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view valid request slugs."
  ON public.testimonial_requests FOR SELECT USING (true);


-- 3. Testimonials Table
CREATE TABLE public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  request_id UUID REFERENCES public.testimonial_requests(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'audio', 'video')),
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their collected testimonials."
  ON public.testimonials FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view testimonials of users."
  ON public.testimonials FOR SELECT USING (true);

CREATE POLICY "Public can submit testimonials via requests."
  ON public.testimonials FOR INSERT WITH CHECK (true); -- Realistically might need more restrictive checks based on request_id

-- 4. Storage Buckets (Assume using Supabase dashboard to create them, but rules here)
-- Bucket: testimonials-media
-- Public access: true
-- Allowed MIME types: audio/*, video/*
-- File size limit: e.g. 50MB
