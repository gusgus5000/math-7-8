import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSubscriptionStatus } from '@/lib/subscription'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    // Get subscription status
    const subscriptionData = await getSubscriptionStatus(user.id, supabase)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile || null,
      profileError: profileError?.message || null,
      subscriptionStatus: subscriptionData,
      debug: {
        hasProfile: !!profile,
        profileId: profile?.id || null,
        subscriptionStatus: profile?.subscription_status || null,
        stripeCustomerId: profile?.stripe_customer_id || null,
        stripeSubscriptionId: profile?.stripe_subscription_id || null,
        subscriptionEndDate: profile?.subscription_end_date || null,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error', 
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}