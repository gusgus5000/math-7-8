export const STRIPE_CONFIG = {
  prices: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || '',
    annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || '',
  },
  trial: {
    days: 0,
    requiresPaymentMethod: true,
  },
  products: {
    premium: {
      name: 'MathMinds Premium',
      description: 'Unlimited access to all math practice problems and features',
      features: [
        'Unlimited practice problems',
        'Step-by-step solutions',
        'Advanced problem types',
        'Progress tracking & analytics',
        'Download practice worksheets',
        'Priority support',
      ],
    },
  },
  webhookEvents: [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_failed',
  ],
} as const