import { getStripeJs } from './utils'

export async function createCheckoutSession(priceId: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function redirectToCheckout(sessionId: string) {
  try {
    const stripe = await getStripeJs()
    if (!stripe) throw new Error('Stripe failed to load')

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    throw error
  }
}

export async function createPortalSession() {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create portal session')
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

export async function getSubscriptionStatus() {
  try {
    const response = await fetch('/api/subscription/status')
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    throw error
  }
}