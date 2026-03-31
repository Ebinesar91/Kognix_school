-- =========================================================================================
-- SCHOOL MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- =========================================================================================
-- Copy and paste this entire script into your Supabase SQL Editor and click "Run"
-- =========================================================================================

-- 1. Create the base 'users' table
-- Links to Supabase's built-in auth.users system
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the 'students' table
-- Extends the users table with student-specific information
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  register_no TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the 'teachers' table
-- Extends the users table with teacher-specific information
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  designation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create the 'attendance' table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date) -- Prevents duplicate attendance records for the same student on the same day
);

-- 5. Create the 'tests' table
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create the 'questions' table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,    -- Stores array of strings like ["Option 1", "Option 2", ...]
  correct_answer INTEGER NOT NULL, -- Stores index (0 to 3)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create the 'results' table
CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For a basic setup, we will enable RLS and allow all authenticated users to read/write.
-- If you want stricter security, you can customize these policies later based on roles.
-- =========================================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create policies that allow full access for now (to avoid immediate permission errors)
CREATE POLICY "Allow full access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to tests" ON public.tests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to questions" ON public.questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to results" ON public.results FOR ALL USING (true) WITH CHECK (true);

-- That's it! Your schema is ready!
