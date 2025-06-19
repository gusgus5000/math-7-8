import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, gradeLevel, planType = 'monthly' } = await request.json()

    if (!email || !fullName || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate plan type
    if (planType && !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly" or "annual"' },
        { status: 400 }
      )
    }

    // Get the price ID based on plan type
    const priceId = planType === 'annual' 
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL 
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
    
    if (!priceId) {
      console.error(`Stripe price ID not configured for ${planType} plan`)
      return NextResponse.json(
        { error: 'Payment configuration error. Price ID not found.' },
        { status: 500 }
      )
    }

    console.log(`Creating checkout session for ${planType} plan with price ID:`, priceId)

    // Create checkout session with metadata for account creation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/signup/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/signup?canceled=true`,
      customer_email: email,
      metadata: {
        email,
        fullName,
        gradeLevel,
        isSignup: 'true',
      },
      subscription_data: {
        metadata: {
          email,
          fullName,
          gradeLevel,
        },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}