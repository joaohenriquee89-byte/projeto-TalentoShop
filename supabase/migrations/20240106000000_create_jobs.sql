
-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Moda', 'Gestão', etc.
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  salary_range TEXT,
  status TEXT DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Fechada', 'Rascunho')),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT, 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Owners can do everything
CREATE POLICY "Users can manage their own jobs" ON public.jobs
  FOR ALL USING (auth.uid() = user_id);

-- 2. Everyone (auth and anon) can read active jobs
CREATE POLICY "Public can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'Ativa');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
