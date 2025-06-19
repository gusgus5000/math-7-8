import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    // Check if we're in test mode by looking at the Stripe key
    const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
    
    // For now, use hardcoded URLs since portal configuration is not set up
    // TODO: Remove this once Stripe Customer Portal is properly configured
    let portalUrl: string
    
    if (isTestMode) {
      // Test mode URL
      portalUrl = 'https://billing.stripe.com/p/login/test_7sYaEY1lNcqOcP3b6X9Zm00'
    } else {
      // Production URL
      portalUrl = 'https://billing.stripe.com/p/login/7sYaEY1lNcqOcP3b6X9Zm00'
    }
    
    // Try to create a proper portal session first
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${request.headers.get('origin')}/settings`,
      })
      
      return NextResponse.json({ url: session.url })
    } catch (portalError: any) {
      console.error('Portal session creation failed, using fallback URL:', portalError.message)
      
      // Return the hardcoded URL as fallback
      return NextResponse.json({ url: portalUrl })
    }
  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}