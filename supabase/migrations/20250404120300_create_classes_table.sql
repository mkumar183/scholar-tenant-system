
-- Create classes/courses table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  grade_level TEXT,
  school_year TEXT,
  teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_school
    FOREIGN KEY(school_id)
    REFERENCES schools(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_teacher
    FOREIGN KEY(teacher_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX classes_school_id_idx ON public.classes(school_id);
CREATE INDEX classes_teacher_id_idx ON public.classes(teacher_id);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admins can see all classes
CREATE POLICY "Admins can see all classes" ON public.classes
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- School admins can see classes in their tenant's schools
CREATE POLICY "School admins can see classes in their schools" ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'school_admin' AND 
    school_id IN (SELECT id FROM public.schools WHERE tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID)
  );

-- Teachers can see classes in their school
CREATE POLICY "Teachers can see classes in their school" ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'teacher' AND 
    school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
  );

-- Students can see classes they're enrolled in
CREATE POLICY "Students can see their enrolled classes" ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'student' AND 
    id IN (
      SELECT class_id FROM public.enrollments WHERE student_id = auth.uid()
    )
  );

-- Only admins, school admins, and assigned teachers can modify classes
CREATE POLICY "Admins and teachers can insert classes" ON public.classes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'school_admin' OR
    (auth.jwt() ->> 'role' = 'teacher' AND teacher_id = auth.uid())
  );

CREATE POLICY "Admins and teachers can update classes" ON public.classes
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'school_admin' OR
    (auth.jwt() ->> 'role' = 'teacher' AND teacher_id = auth.uid())
  );

CREATE POLICY "Admins and school admins can delete classes" ON public.classes
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'school_admin'
  );
