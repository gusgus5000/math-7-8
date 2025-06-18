// Re-export from context to maintain backwards compatibility
export { useSubscription } from '@/contexts/SubscriptionContext'

// Alternative hook name for direct usage without context
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import type { SubscriptionInfo, FeatureAccess } from '@/lib/subscription'

export function useSubscriptionDirect() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [features, setFeatures] = useState<FeatureAccess | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function fetchSubscriptionStatus() {
      if (!user) {
        setSubscription(null)
        setFeatures(null)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/subscription/status', {
          headers: {
            'X-Include-Features': 'true',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch subscription status')
        }

        const data = await response.json()
        
        if (!isCancelled) {
          setSubscription({
            tier: data.tier,
            status: data.status,
            isActive: data.isActive,
            canAccessPremium: data.canAccessPremium,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            daysRemaining: data.daysRemaining,
            requiresPaymentUpdate: data.requiresPaymentUpdate,
            error: data.error,
          })
          
          if (data.features) {
            setFeatures(data.features)
          }
          
          setError(null)
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching subscription:', err)
          setError(err instanceof Error ? err.message : 'Unknown error')
          
          // Set default free tier on error
          setSubscription({
            tier: 'free',
            status: 'error',
            isActive: false,
            canAccessPremium: false,
          })
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchSubscriptionStatus()

    return () => {
      isCancelled = true
    }
  }, [user])

  const refresh = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/subscription/status', {
        headers: {
          'X-Include-Features': 'true',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }

      const data = await response.json()
      
      setSubscription({
        tier: data.tier,
        status: data.status,
        isActive: data.isActive,
        canAccessPremium: data.canAccessPremium,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        daysRemaining: data.daysRemaining,
        requiresPaymentUpdate: data.requiresPaymentUpdate,
        error: data.error,
      })
      
      if (data.features) {
        setFeatures(data.features)
      }
    } catch (err) {
      console.error('Error refreshing subscription:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    subscription,
    features,
    isLoading,
    error,
    refresh,
    // Convenience methods
    isPremium: subscription?.tier === 'premium',
    isFree: subscription?.tier === 'free',
    canAccessPremium: subscription?.canAccessPremium || false,
  }
}