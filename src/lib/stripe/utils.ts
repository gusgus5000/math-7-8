export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function getStripeJs() {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  
  if (!stripePublishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
  }
  
  return import('@stripe/stripe-js').then(({ loadStripe }) => 
    loadStripe(stripePublishableKey)
  )
}