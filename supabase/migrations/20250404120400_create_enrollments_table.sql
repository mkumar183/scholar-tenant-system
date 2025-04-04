
-- Create enrollments table to connect students with classes
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_student
    FOREIGN KEY(student_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_class
    FOREIGN KEY(class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE,
    
  -- Ensure a student can only be enrolled in a class once
  CONSTRAINT unique_enrollment UNIQUE (student_id, class_id)
);

-- Create indexes
CREATE INDEX enrollments_student_id_idx ON public.enrollments(student_id);
CREATE INDEX enrollments_class_id_idx ON public.enrollments(class_id);

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admins can see all enrollments
CREATE POLICY "Admins can see all enrollments" ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- School admins can see enrollments for their schools
CREATE POLICY "School admins can see enrollments in their tenant" ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'school_admin' AND 
    class_id IN (
      SELECT c.id FROM public.classes c
      JOIN public.schools s ON c.school_id = s.id
      WHERE s.tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
    )
  );

-- Teachers can see enrollments for their classes
CREATE POLICY "Teachers can see enrollments for their classes" ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'teacher' AND 
    class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
    )
  );

-- Students can see their own enrollments
CREATE POLICY "Students can see their own enrollments" ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'student' AND student_id = auth.uid());

-- Admin and school admins can manage enrollments
CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'school_admin'
  );

CREATE POLICY "Admins and teachers can update enrollments" ON public.enrollments
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'school_admin' OR
    (
      auth.jwt() ->> 'role' = 'teacher' AND 
      class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
    )
  );

CREATE POLICY "Admins can delete enrollments" ON public.enrollments
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'school_admin'
  );
