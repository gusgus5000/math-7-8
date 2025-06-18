import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, gradeLevel } = await request.json()

    if (!email || !fullName || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the price ID from environment variables based on plan
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
    
    if (!priceId) {
      console.error('Stripe price ID not configured. Expected NEXT_PUBLIC_STRIPE_PRICE_MONTHLY')
      return NextResponse.json(
        { error: 'Payment configuration error. Price ID not found.' },
        { status: 500 }
      )
    }

    console.log('Creating checkout session with price ID:', priceId)

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