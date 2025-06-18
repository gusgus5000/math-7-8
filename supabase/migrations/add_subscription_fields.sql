-- Add subscription fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);