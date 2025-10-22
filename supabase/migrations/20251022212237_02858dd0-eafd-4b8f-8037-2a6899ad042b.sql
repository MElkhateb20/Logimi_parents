-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  student_code TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create levels table
CREATE TABLE public.levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number INTEGER NOT NULL UNIQUE,
  level_name TEXT NOT NULL
);

-- Create lesson status enum
CREATE TYPE lesson_status AS ENUM ('completed', 'in_progress', 'locked');

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  lesson_name TEXT NOT NULL,
  lesson_status lesson_status DEFAULT 'locked'
);

-- Create student_progress table
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status lesson_status DEFAULT 'locked',
  UNIQUE(student_id, lesson_id)
);

-- Create exams table
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  exam_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teacher_notes table
CREATE TABLE public.teacher_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (for parent dashboard)
CREATE POLICY "Allow public read access to students"
  ON public.students FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to levels"
  ON public.levels FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to lessons"
  ON public.lessons FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to student_progress"
  ON public.student_progress FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to exams"
  ON public.exams FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to teacher_notes"
  ON public.teacher_notes FOR SELECT
  USING (true);

-- RLS Policies for authenticated users (admin) write access
CREATE POLICY "Allow authenticated insert students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete students"
  ON public.students FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert levels"
  ON public.levels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update levels"
  ON public.levels FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update lessons"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete lessons"
  ON public.lessons FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert student_progress"
  ON public.student_progress FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update student_progress"
  ON public.student_progress FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert exams"
  ON public.exams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update exams"
  ON public.exams FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete exams"
  ON public.exams FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert teacher_notes"
  ON public.teacher_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update teacher_notes"
  ON public.teacher_notes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete teacher_notes"
  ON public.teacher_notes FOR DELETE
  TO authenticated
  USING (true);

-- Insert default levels (5 levels)
INSERT INTO public.levels (level_number, level_name) VALUES
  (1, 'المستوى الأول'),
  (2, 'المستوى الثاني'),
  (3, 'المستوى الثالث'),
  (4, 'المستوى الرابع'),
  (5, 'المستوى الخامس');