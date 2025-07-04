import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const isSignup = session.metadata?.isSignup === 'true'
        const email = session.metadata?.email || session.customer_email

        // Handle regular checkout (existing users)
        if (userId && session.subscription) {
          // Get subscription details
          const subscriptionId = session.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          const updateData: any = {
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            plan_type: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
          }
          
          if ('current_period_end' in subscription && subscription.current_period_end) {
            updateData.subscription_end_date = new Date((subscription as any).current_period_end * 1000).toISOString()
          }
          
          await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
        }
        // Handle signup checkout (new users)
        else if (isSignup && email && session.subscription) {
          // Get subscription details
          const subscriptionId = session.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          const updateData: any = {
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            stripe_customer_id: session.customer,
            plan_type: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
          }
          
          if ('current_period_end' in subscription && subscription.current_period_end) {
            updateData.subscription_end_date = new Date((subscription as any).current_period_end * 1000).toISOString()
          }
          
          // Update by email since we don't have the user ID yet
          await supabase
            .from('profiles')
            .update(updateData)
            .eq('email', email)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if ('metadata' in customer && customer.metadata?.userId) {
          const updateData: any = {
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            plan_type: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
          }
          
          if ('current_period_end' in subscription && subscription.current_period_end) {
            updateData.subscription_end_date = new Date((subscription as any).current_period_end * 1000).toISOString()
          }
          
          await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', customer.metadata.userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if ('metadata' in customer && customer.metadata?.userId) {
          const updateData: any = {
            subscription_status: 'canceled',
          }
          
          if ('current_period_end' in subscription && subscription.current_period_end) {
            updateData.subscription_end_date = new Date((subscription as any).current_period_end * 1000).toISOString()
          }
          
          await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', customer.metadata.userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customer = await stripe.customers.retrieve(invoice.customer as string)
        
        if ('metadata' in customer && customer.metadata?.userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
            })
            .eq('id', customer.metadata.userId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}