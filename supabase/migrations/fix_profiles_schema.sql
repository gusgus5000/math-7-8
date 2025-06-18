-- Ensure all necessary columns exist in profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS plan_type TEXT;

-- Drop the column if it exists (in case it was created by mistake)
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS subscription_tier;

-- Add check constraint for subscription_status
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS valid_subscription_status;

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_subscription_status 
CHECK (subscription_status IN ('free', 'active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'));

-- Update any existing NULL subscription_status to 'free'
UPDATE public.profiles 
SET subscription_status = 'free' 
WHERE subscription_status IS NULL;

-- Make subscription_status NOT NULL after setting defaults
ALTER TABLE public.profiles 
ALTER COLUMN subscription_status SET NOT NULL;

-- Update the handle_new_user function to include subscription_status
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, grade_level, subscription_status, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'grade_level')::INTEGER,
    'free',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();