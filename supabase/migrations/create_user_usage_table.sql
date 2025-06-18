-- Create user usage tracking table
CREATE TABLE IF NOT EXISTS public.user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  problems_solved INTEGER DEFAULT 0,
  feature_attempts JSONB DEFAULT '{}',
  last_problem_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage" 
  ON public.user_usage FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
  ON public.user_usage FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
  ON public.user_usage FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_usage_user_date ON public.user_usage(user_id, date);
CREATE INDEX idx_user_usage_date ON public.user_usage(date);

-- Update trigger
CREATE TRIGGER set_user_usage_updated_at
  BEFORE UPDATE ON public.user_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to get or create today's usage record
CREATE OR REPLACE FUNCTION public.get_or_create_usage_record(p_user_id UUID)
RETURNS public.user_usage AS $$
DECLARE
  v_record public.user_usage;
BEGIN
  -- Try to get existing record
  SELECT * INTO v_record
  FROM public.user_usage
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  -- If not found, create new record
  IF NOT FOUND THEN
    INSERT INTO public.user_usage (user_id, date)
    VALUES (p_user_id, CURRENT_DATE)
    RETURNING * INTO v_record;
  END IF;
  
  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment problems solved
CREATE OR REPLACE FUNCTION public.increment_problems_solved(p_user_id UUID)
RETURNS public.user_usage AS $$
DECLARE
  v_record public.user_usage;
BEGIN
  -- Get or create today's record
  v_record := public.get_or_create_usage_record(p_user_id);
  
  -- Update the record
  UPDATE public.user_usage
  SET 
    problems_solved = problems_solved + 1,
    last_problem_at = NOW()
  WHERE id = v_record.id
  RETURNING * INTO v_record;
  
  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;