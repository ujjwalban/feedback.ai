-- Helper functions for analytics

CREATE OR REPLACE FUNCTION public.increment_request_views(request_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.testimonial_requests
  SET view_count = view_count + 1
  WHERE id = request_id;
  
  -- Also record an event
  INSERT INTO public.analytics_events (user_id, event_type, metadata)
  SELECT user_id, 'link_open', jsonb_build_object('request_id', request_id)
  FROM public.testimonial_requests
  WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_request_submissions(request_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.testimonial_requests
  SET submission_count = submission_count + 1
  WHERE id = request_id;
  
  -- Also record an event
  INSERT INTO public.analytics_events (user_id, event_type, metadata)
  SELECT user_id, 'submission', jsonb_build_object('request_id', request_id)
  FROM public.testimonial_requests
  WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
