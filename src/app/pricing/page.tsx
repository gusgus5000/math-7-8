'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { createCheckoutSession, redirectToCheckout } from '@/lib/stripe/client'
import { formatCurrency } from '@/lib/stripe/utils'
import { STRIPE_CONFIG } from '@/config/stripe'
import Link from 'next/link'

const plans = [
  {
    name: 'Monthly',
    price: 100, // $1.00 in cents
    priceId: STRIPE_CONFIG.prices.monthly,
    description: 'Full access with monthly billing',
    features: [
      'Unlimited practice problems',
      'Step-by-step solutions',
      'Advanced problem types',
      'Full progress tracking',
      'Download worksheets',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Annual',
    price: 1000, // $10.00 in cents
    priceId: STRIPE_CONFIG.prices.annual,
    description: 'Best value with annual billing',
    features: [
      'Everything in Monthly',
      'Save $2 per year',
      'Priority support',
      'Early access to new features',
    ],
    savings: 'Save 17%',
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { subscription, canAccessPremium, isLoading: subscriptionLoading } = useSubscription()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if Stripe is configured
  const isStripeConfigured = !!(STRIPE_CONFIG.prices.monthly && STRIPE_CONFIG.prices.annual)

  const handleSelectPlan = async (priceId: string) => {
    if (!user) {
      router.push('/signup')
      return
    }

    setLoading(priceId)
    setError(null)

    try {
      const sessionId = await createCheckoutSession(priceId)
      await redirectToCheckout(sessionId)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
                <span className="text-2xl">🧠</span>
                <span>MathMinds</span>
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <Link href="/settings" className="text-gray-700 hover:text-blue-600">
                  Settings
                </Link>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Unlock your full math potential with our premium features
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!isStripeConfigured && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-yellow-800 font-semibold mb-2">Stripe Configuration Required</h3>
            <p className="text-yellow-700 text-sm mb-3">
              To enable payments, please configure your Stripe price IDs in your environment variables:
            </p>
            <pre className="bg-yellow-100 p-3 rounded text-xs overflow-x-auto">
              <code>{`NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_xxxxx`}</code>
            </pre>
            <p className="text-yellow-700 text-sm mt-3">
              1. Create products in your Stripe Dashboard<br />
              2. Copy the price IDs<br />
              3. Add them to your .env.local file<br />
              4. Restart your development server
            </p>
            <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
              <p>Current values:</p>
              <p>Monthly: {STRIPE_CONFIG.prices.monthly || 'Not set'}</p>
              <p>Annual: {STRIPE_CONFIG.prices.annual || 'Not set'}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-lg shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    /{plan.name.toLowerCase() === 'annual' ? 'year' : 'month'}
                  </span>
                </div>
                {plan.savings && (
                  <p className="mt-2 text-green-600 font-semibold">
                    {plan.savings}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
                {'limitations' in plan && plan.limitations?.map((limitation, index) => (
                  <li key={`limit-${index}`} className="flex items-start">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  console.log('Button clicked for plan:', plan.name)
                  console.log('Button state:', {
                    isStripeConfigured,
                    loading,
                    subscriptionLoading,
                    subscription,
                    priceId: plan.priceId
                  })
                  handleSelectPlan(plan.priceId!)
                }}
                disabled={!isStripeConfigured || loading !== null || subscriptionLoading || (subscription?.tier === 'premium' && !subscription.cancelAtPeriodEnd)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.priceId ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : subscription?.tier === 'premium' && !subscription.cancelAtPeriodEnd ? (
                  'Current Plan'
                ) : !isStripeConfigured ? (
                  'Configure Stripe'
                ) : (
                  user ? 'Get Started' : 'Sign Up to Start'
                )}
              </button>
            </div>
          ))}
        </div>

        {canAccessPremium && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need to update your subscription?
            </p>
            <Link
              href="/settings"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage Subscription in Settings →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}