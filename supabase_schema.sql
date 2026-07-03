-- ==========================================
-- ALUMNICONNECT MVP DATABASE SCHEMA (REVIEWED)
-- ==========================================
-- Safe creation for a fresh Supabase project

-- 1. ENUMS (Idempotent creation using DO block for safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'alumni', 'admin', 'visitor');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'connection_status') THEN
        CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_type') THEN
        CREATE TYPE opportunity_type AS ENUM ('internship', 'full_time', 'referral_only');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_mode') THEN
        CREATE TYPE work_mode AS ENUM ('remote', 'hybrid', 'onsite');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_status') THEN
        CREATE TYPE opportunity_status AS ENUM ('open', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_status') THEN
        CREATE TYPE referral_status AS ENUM ('pending', 'reviewing', 'referred', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_mode') THEN
        CREATE TYPE event_mode AS ENUM ('online', 'offline', 'hybrid');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('upcoming', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_registration_status') THEN
        CREATE TYPE event_registration_status AS ENUM ('registered', 'attended');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_room_type') THEN
        CREATE TYPE chat_room_type AS ENUM ('direct', 'group');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_role') THEN
        CREATE TYPE ai_role AS ENUM ('user', 'assistant');
    END IF;
END$$;

-- Safely add 'visitor' to user_role if it was missed in a previous migration
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'visitor';

-- 2. TABLES
-- Using IF NOT EXISTS where appropriate, though a fresh DB won't strictly need it.
-- We drop tables in reverse dependency order if we want a clean wipe, but standard CREATE is fine for a fresh project.

CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    department VARCHAR,
    graduation_year INTEGER,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    github_url TEXT,
    portfolio_url TEXT
);

CREATE TABLE IF NOT EXISTS alumni_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    company VARCHAR NOT NULL,
    job_role VARCHAR NOT NULL,
    industry VARCHAR NOT NULL,
    years_of_experience INTEGER NOT NULL,
    is_verified BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status connection_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (requester_id != addressee_id)
);

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    company VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    type opportunity_type NOT NULL,
    work_mode work_mode NOT NULL,
    description TEXT NOT NULL,
    application_url TEXT,
    status opportunity_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunity_skills (
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (opportunity_id, skill_id)
);

CREATE TABLE IF NOT EXISTS referral_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    status referral_status DEFAULT 'pending',
    pitch_message TEXT NOT NULL,
    resume_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    mode event_mode NOT NULL,
    location_or_link TEXT NOT NULL,
    organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status event_status DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status event_registration_status DEFAULT 'registered',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type chat_room_type DEFAULT 'direct',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action_type VARCHAR NOT NULL,
    entity_type VARCHAR NOT NULL,
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE UNIQUE,
    overall_score INTEGER NOT NULL,
    feedback_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ai_sessions(id) ON DELETE CASCADE,
    role ai_role NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES (Added missing FK indexes to optimize queries and cascading deletes)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_connections_req ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_addr ON connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_author ON opportunities(author_id);
CREATE INDEX IF NOT EXISTS idx_referral_requests_opp ON referral_requests(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_referral_requests_student ON referral_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = false;

-- 4. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true) ON CONFLICT DO NOTHING;

-- 5. TRIGGERS & FUNCTIONS

-- A. Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_modtime ON profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connections_modtime ON connections;
CREATE TRIGGER update_connections_modtime BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_modtime ON opportunities;
CREATE TRIGGER update_opportunities_modtime BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_referral_requests_modtime ON referral_requests;
CREATE TRIGGER update_referral_requests_modtime BEFORE UPDATE ON referral_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_modtime ON events;
CREATE TRIGGER update_events_modtime BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_messages_modtime ON chat_messages;
CREATE TRIGGER update_chat_messages_modtime BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_modtime ON resumes;
CREATE TRIGGER update_resumes_modtime BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- B. Auto-create Profile (Hooked to Supabase Auth)
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
    INSERT INTO public.alumni_profiles (id, company, job_role, industry, years_of_experience, is_verified) 
    VALUES (
        NEW.id, 
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'company', ''), 'TBD'),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'job_role', ''), 'TBD'),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'industry', ''), 'TBD'),
        0,
        true
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- C. Notification Generator for Connections
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

DROP TRIGGER IF EXISTS on_connection_request ON connections;
CREATE TRIGGER on_connection_request
  AFTER INSERT OR UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_connection_request();


-- D. Notification Generator for Referrals
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

DROP TRIGGER IF EXISTS on_referral_request ON referral_requests;
CREATE TRIGGER on_referral_request
  AFTER INSERT OR UPDATE ON referral_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_referral_request();


-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- 7. COMPREHENSIVE RLS POLICIES FOR MVP

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Student & Alumni Sub-profiles
CREATE POLICY "Student profiles are viewable by everyone" ON student_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own student profile" ON student_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Alumni profiles are viewable by everyone" ON alumni_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own alumni profile" ON alumni_profiles FOR UPDATE USING (auth.uid() = id);

-- Skills (Static data, readable by all, insertable by authenticated users during profile creation)
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);

-- User Skills
CREATE POLICY "User skills are viewable by everyone" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- Connections
CREATE POLICY "Users can view own connections" ON connections FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can insert connection requests" ON connections FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update own connections" ON connections FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can delete own connections" ON connections FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Opportunities
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Only alumni can insert opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own opportunities" ON opportunities FOR DELETE USING (auth.uid() = author_id);

-- Opportunity Skills
CREATE POLICY "Opportunity skills are public" ON opportunity_skills FOR SELECT USING (true);
CREATE POLICY "Authors can manage opportunity skills" ON opportunity_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_skills.opportunity_id AND author_id = auth.uid())
);

-- Referral Requests
CREATE POLICY "Users can view relevant referrals" ON referral_requests FOR SELECT USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM opportunities WHERE id = referral_requests.opportunity_id AND author_id = auth.uid())
);
CREATE POLICY "Students can insert referral requests" ON referral_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Alumni can update referral status" ON referral_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = referral_requests.opportunity_id AND author_id = auth.uid())
);

-- Events
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own events" ON events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete own events" ON events FOR DELETE USING (auth.uid() = organizer_id);

-- Event Registrations
CREATE POLICY "Event registrations are public" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "Users can manage own registrations" ON event_registrations FOR ALL USING (auth.uid() = user_id);

-- Chat System
CREATE POLICY "Users can view rooms they are in" ON chat_rooms FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_participants WHERE room_id = chat_rooms.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create chat rooms" ON chat_rooms FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view participants of their rooms" ON chat_participants FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_participants cp WHERE cp.room_id = chat_participants.room_id AND cp.user_id = auth.uid())
);
CREATE POLICY "Users can join rooms" ON chat_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their rooms" ON chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_participants WHERE room_id = chat_messages.room_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM chat_participants WHERE room_id = chat_messages.room_id AND user_id = auth.uid())
);

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System generates notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Resumes & AI
CREATE POLICY "Users can manage own resumes" ON resumes FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Users can view own resume analysis" ON resume_analysis FOR SELECT USING (
    EXISTS (SELECT 1 FROM resumes WHERE id = resume_analysis.resume_id AND student_id = auth.uid())
);
CREATE POLICY "Users can insert own resume analysis" ON resume_analysis FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM resumes WHERE id = resume_analysis.resume_id AND student_id = auth.uid())
);

CREATE POLICY "Users can manage own AI sessions" ON ai_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI messages" ON ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM ai_sessions WHERE id = ai_messages.session_id AND user_id = auth.uid())
);

-- STORAGE BUCKETS RLS (Required for uploads to work)
-- Note: These policies assume the storage extension is active. They affect `storage.objects`

-- Avatars (Public read, authenticated user can upload their own)
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Resumes (Private read, authenticated user can upload their own)
CREATE POLICY "Users can read own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own resumes" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Event Images (Public read, authenticated user can upload)
CREATE POLICY "Event images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Users can upload event images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update event images" ON storage.objects FOR UPDATE USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');
