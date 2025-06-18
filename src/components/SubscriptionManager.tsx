'use client'

import { useState } from 'react'
import { useSubscription } from '@/hooks/useSubscription'
import { formatCurrency } from '@/lib/stripe/utils'

export function SubscriptionManager() {
  const { subscription, isLoading, error, refresh } = useSubscription()
  const [isManaging, setIsManaging] = useState(false)

  const handleManageSubscription = async () => {
    setIsManaging(true)
    
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error managing subscription:', error)
      alert(error instanceof Error ? error.message : 'Failed to open billing portal')
    } finally {
      setIsManaging(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error loading subscription: {error}</p>
        <button
          onClick={refresh}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!subscription) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Subscription</h2>
      
      <div className="space-y-4">
        {/* Current Plan */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
          <p className="text-lg font-semibold capitalize">
            {subscription.tier === 'free' ? 'Free' : 
             subscription.tier === 'trial' ? 'Premium (Trial)' : 'Premium'}
          </p>
        </div>

        {/* Status */}
        {subscription.tier !== 'free' && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                subscription.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                subscription.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                subscription.status === 'canceled' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {subscription.status === 'active' ? 'Active' :
                 subscription.status === 'trialing' ? 'Trial' :
                 subscription.status === 'past_due' ? 'Past Due' :
                 subscription.status === 'canceled' ? 'Canceled' :
                 'Expired'}
              </span>
              
              {subscription.requiresPaymentUpdate && (
                <span className="text-sm text-red-600">
                  Payment update required
                </span>
              )}
            </div>
          </div>
        )}

        {/* Trial Days Remaining */}
        {subscription.trialDaysRemaining !== undefined && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Trial Ends</h3>
            <p className="text-lg">
              {subscription.trialDaysRemaining} days remaining
            </p>
          </div>
        )}

        {/* Subscription End Date */}
        {subscription.endDate && subscription.status === 'canceled' && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Access Until</h3>
            <p className="text-lg">
              {subscription.endDate.toLocaleDateString()}
              {subscription.daysRemaining !== undefined && (
                <span className="text-sm text-gray-600 ml-2">
                  ({subscription.daysRemaining} days remaining)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 space-y-2">
          {subscription.tier === 'free' ? (
            <a
              href="/pricing"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Upgrade to Premium
            </a>
          ) : subscription.tier === 'trial' ? (
            <>
              <a
                href="/pricing"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe Now
              </a>
              <p className="text-sm text-gray-600 text-center">
                Subscribe before your trial ends to keep access
              </p>
            </>
          ) : (
            <button
              onClick={handleManageSubscription}
              disabled={isManaging}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isManaging ? 'Loading...' : 'Manage Subscription'}
            </button>
          )}
        </div>

        {/* Features */}
        {subscription.canAccessPremium && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Premium Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Unlimited practice problems</li>
              <li>✓ Step-by-step solutions</li>
              <li>✓ Full progress tracking</li>
              <li>✓ Download worksheets</li>
              {subscription.tier === 'premium' && <li>✓ Priority support</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}