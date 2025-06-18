-- Add Stripe fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Create subscription history table
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  status TEXT,
  plan_name TEXT,
  amount INTEGER,
  currency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook events table for idempotency
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_history
CREATE POLICY "Users can view their own subscription history" 
  ON public.subscription_history FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policies for webhook_events (admin only)
CREATE POLICY "Only service role can manage webhook events" 
  ON public.webhook_events FOR ALL 
  USING (false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON public.subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);

-- Update the trigger for subscription_history
CREATE OR REPLACE FUNCTION public.handle_subscription_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_subscription_history_updated_at
  BEFORE UPDATE ON public.subscription_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_subscription_history_updated_at();

-- Function to log subscription changes
CREATE OR REPLACE FUNCTION public.log_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if subscription_status or subscription_id changed
  IF (OLD.subscription_status IS DISTINCT FROM NEW.subscription_status) OR 
     (OLD.subscription_id IS DISTINCT FROM NEW.subscription_id) THEN
    INSERT INTO public.subscription_history (
      user_id,
      stripe_subscription_id,
      status,
      plan_name,
      created_at
    ) VALUES (
      NEW.id,
      NEW.subscription_id,
      NEW.subscription_status,
      CASE 
        WHEN NEW.subscription_status IN ('active', 'trialing', 'past_due') THEN 'premium'
        ELSE 'free'
      END,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log subscription changes
CREATE TRIGGER on_subscription_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_subscription_change();