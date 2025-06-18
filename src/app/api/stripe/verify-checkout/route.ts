import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Verify this is a signup session
    if (session.metadata?.isSignup !== 'true') {
      return NextResponse.json(
        { error: 'Invalid session type' },
        { status: 400 }
      )
    }

    // Get customer and subscription IDs
    const customerId = session.customer as string
    const subscription = session.subscription as Stripe.Subscription
    const subscriptionId = subscription?.id

    if (!customerId || !subscriptionId) {
      return NextResponse.json(
        { error: 'Missing customer or subscription information' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      customerId,
      subscriptionId,
      email: session.customer_email,
      metadata: session.metadata,
    })
  } catch (error) {
    console.error('Error verifying checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}