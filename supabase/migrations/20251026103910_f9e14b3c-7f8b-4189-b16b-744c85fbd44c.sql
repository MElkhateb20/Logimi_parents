-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'parent');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policy for user_roles (users can view their own roles)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- UPDATE STUDENTS TABLE POLICIES
-- ============================================

-- Drop existing public/permissive policies
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;
DROP POLICY IF EXISTS "Allow authenticated insert students" ON public.students;
DROP POLICY IF EXISTS "Allow authenticated update students" ON public.students;
DROP POLICY IF EXISTS "Allow authenticated delete students" ON public.students;

-- Create new role-based policies
CREATE POLICY "Authenticated users can read students" ON public.students
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert students" ON public.students
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students" ON public.students
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students" ON public.students
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- UPDATE EXAMS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to exams" ON public.exams;
DROP POLICY IF EXISTS "Allow authenticated insert exams" ON public.exams;
DROP POLICY IF EXISTS "Allow authenticated update exams" ON public.exams;
DROP POLICY IF EXISTS "Allow authenticated delete exams" ON public.exams;

CREATE POLICY "Authenticated users can read exams" ON public.exams
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert exams" ON public.exams
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update exams" ON public.exams
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete exams" ON public.exams
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- UPDATE LESSONS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow authenticated insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow authenticated update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow authenticated delete lessons" ON public.lessons;

CREATE POLICY "Authenticated users can read lessons" ON public.lessons
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert lessons" ON public.lessons
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lessons" ON public.lessons
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons" ON public.lessons
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- UPDATE TEACHER_NOTES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to teacher_notes" ON public.teacher_notes;
DROP POLICY IF EXISTS "Allow authenticated insert teacher_notes" ON public.teacher_notes;
DROP POLICY IF EXISTS "Allow authenticated update teacher_notes" ON public.teacher_notes;
DROP POLICY IF EXISTS "Allow authenticated delete teacher_notes" ON public.teacher_notes;

CREATE POLICY "Authenticated users can read notes" ON public.teacher_notes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert notes" ON public.teacher_notes
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notes" ON public.teacher_notes
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete notes" ON public.teacher_notes
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- UPDATE STUDENT_PROGRESS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to student_progress" ON public.student_progress;
DROP POLICY IF EXISTS "Allow authenticated insert student_progress" ON public.student_progress;
DROP POLICY IF EXISTS "Allow authenticated update student_progress" ON public.student_progress;

CREATE POLICY "Authenticated users can read progress" ON public.student_progress
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert progress" ON public.student_progress
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update progress" ON public.student_progress
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- UPDATE LEVELS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to levels" ON public.levels;
DROP POLICY IF EXISTS "Allow authenticated insert levels" ON public.levels;
DROP POLICY IF EXISTS "Allow authenticated update levels" ON public.levels;

CREATE POLICY "Authenticated users can read levels" ON public.levels
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert levels" ON public.levels
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update levels" ON public.levels
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- ADD DATABASE CONSTRAINTS FOR INPUT VALIDATION
-- ============================================

-- Students table constraints
ALTER TABLE public.students
  ADD CONSTRAINT students_name_length CHECK (length(trim(name)) > 0 AND length(name) <= 100),
  ADD CONSTRAINT students_code_length CHECK (length(trim(student_code)) > 0 AND length(student_code) <= 50);

-- Exams table constraints
ALTER TABLE public.exams
  ADD CONSTRAINT exams_name_length CHECK (length(trim(exam_name)) > 0 AND length(exam_name) <= 200),
  ADD CONSTRAINT exams_score_positive CHECK (score >= 0),
  ADD CONSTRAINT exams_max_score_positive CHECK (max_score > 0),
  ADD CONSTRAINT exams_score_valid CHECK (score <= max_score);

-- Lessons table constraints
ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_name_length CHECK (length(trim(lesson_name)) > 0 AND length(lesson_name) <= 200),
  ADD CONSTRAINT lessons_number_positive CHECK (lesson_number > 0);

-- Teacher notes constraints
ALTER TABLE public.teacher_notes
  ADD CONSTRAINT teacher_notes_text_length CHECK (length(trim(note_text)) > 0 AND length(note_text) <= 2000),
  ADD CONSTRAINT teacher_notes_teacher_name_length CHECK (length(trim(teacher_name)) > 0 AND length(teacher_name) <= 100);

-- Levels constraints
ALTER TABLE public.levels
  ADD CONSTRAINT levels_name_length CHECK (length(trim(level_name)) > 0 AND length(level_name) <= 100),
  ADD CONSTRAINT levels_number_positive CHECK (level_number > 0);