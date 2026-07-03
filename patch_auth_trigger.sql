-- =================================================================
-- MIGRATION PATCH: Fix Supabase Auth Signup 500 Error
-- =================================================================

-- 1. Ensure the visitor role exists safely. 
-- (If you had already run a previous script, the DO block might have skipped adding this)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'visitor';

-- 2. Update the handle_new_user function to use the correct search_path
-- and properly schema-qualify the custom user_role enum.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  extracted_role public.user_role;
  grad_year INTEGER;
  dept VARCHAR;
BEGIN
  -- Safely extract role, default to student
  BEGIN
    extracted_role := CAST(NEW.raw_user_meta_data->>'role' AS public.user_role);
  EXCEPTION WHEN OTHERS THEN
    extracted_role := 'student'::public.user_role;
  END;

  -- Handle graduation year and department (visitors may not have these)
  IF extracted_role = 'visitor' THEN
    grad_year := NULL;
    dept := NULL;
  ELSE
    dept := COALESCE(NULLIF(NEW.raw_user_meta_data->>'department', ''), 'Undeclared');
    BEGIN
      grad_year := NULLIF(NEW.raw_user_meta_data->>'graduation_year', '')::INTEGER;
      IF grad_year IS NULL THEN
          grad_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 4;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      grad_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 4;
    END;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, department, graduation_year)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    extracted_role,
    dept,
    grad_year
  );
  
  IF extracted_role = 'student' THEN
    INSERT INTO public.student_profiles (id) VALUES (NEW.id);
  ELSIF extracted_role = 'alumni' THEN
    INSERT INTO public.alumni_profiles (id, company, job_role, industry, years_of_experience) 
    VALUES (
        NEW.id, 
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'company', ''), 'TBD'),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'job_role', ''), 'TBD'),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'industry', ''), 'TBD'),
        0
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Also update the other triggers to ensure they don't encounter search_path issues in the future
CREATE OR REPLACE FUNCTION notify_on_connection_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'pending' THEN
      INSERT INTO public.notifications (user_id, actor_id, action_type, entity_type, entity_id, content)
      VALUES (
        NEW.addressee_id,
        NEW.requester_id,
        'connection_request',
        'connection',
        NEW.id,
        'You have a new connection request'
      );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION notify_on_referral_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_author_id UUID;
BEGIN
  IF NEW.status = 'pending' THEN
      SELECT author_id INTO target_author_id FROM public.opportunities WHERE id = NEW.opportunity_id;
      
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
  RETURN NEW;
END;
$$;
