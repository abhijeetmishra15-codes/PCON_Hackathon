-- ==========================================
-- MIGRATION: UPDATE REFERRAL REQUESTS
-- ==========================================

-- 1. Alter referral_requests table
ALTER TABLE public.referral_requests 
  ADD COLUMN IF NOT EXISTS alumni_id UUID REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS company_name VARCHAR,
  ADD COLUMN IF NOT EXISTS job_title VARCHAR,
  ADD COLUMN IF NOT EXISTS job_url TEXT;

-- Make opportunity_id optional if it was previously NOT NULL
ALTER TABLE public.referral_requests ALTER COLUMN opportunity_id DROP NOT NULL;

-- 2. Update RLS policies on referral_requests
DROP POLICY IF EXISTS "Users can view relevant referrals" ON public.referral_requests;
CREATE POLICY "Users can view relevant referrals" ON public.referral_requests FOR SELECT USING (
    auth.uid() = student_id OR 
    auth.uid() = alumni_id OR
    EXISTS (SELECT 1 FROM public.opportunities WHERE id = referral_requests.opportunity_id AND author_id = auth.uid())
);

DROP POLICY IF EXISTS "Alumni can update referral status" ON public.referral_requests;
CREATE POLICY "Alumni can update referral status" ON public.referral_requests FOR UPDATE USING (
    auth.uid() = alumni_id OR
    EXISTS (SELECT 1 FROM public.opportunities WHERE id = referral_requests.opportunity_id AND author_id = auth.uid())
);

-- 3. Update the notification generator for referrals
CREATE OR REPLACE FUNCTION public.notify_on_referral_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_author_id UUID;
BEGIN
  IF NEW.status = 'pending' THEN
      IF NEW.alumni_id IS NOT NULL THEN
        target_author_id := NEW.alumni_id;
      ELSE
        SELECT author_id INTO target_author_id FROM public.opportunities WHERE id = NEW.opportunity_id;
      END IF;
      
      IF target_author_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, actor_id, action_type, entity_type, entity_id, content)
        VALUES (
          target_author_id,
          NEW.student_id,
          'referral_request',
          'referral',
          NEW.id,
          'You have a new referral request'
        );
      END IF;
  END IF;
  RETURN NEW;
END;
$$;
