'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { Subscription, SubscriptionTier, getSubscriptionStatus } from '@/lib/subscription'
import { createClient } from '@/lib/supabase/client'

interface SubscriptionContextType {
  subscription: Subscription | null
  tier: SubscriptionTier
  canAccessPremium: boolean
  isLoading: boolean
  refresh: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  tier: 'free',
  canAccessPremium: false,
  isLoading: true,
  refresh: async () => {},
})

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

interface SubscriptionProviderProps {
  children: React.ReactNode
  user: User | null
}

export function SubscriptionProvider({ children, user }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [tier, setTier] = useState<SubscriptionTier>('free')
  const [canAccessPremium, setCanAccessPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    console.log('[SubscriptionContext] fetchSubscription called with user:', user?.id)
    
    if (!user) {
      setSubscription(null)
      setTier('free')
      setCanAccessPremium(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await getSubscriptionStatus(user.id)
      
      console.log('[SubscriptionContext] Got data:', data)
      
      setSubscription(data.subscription)
      setTier(data.tier)
      setCanAccessPremium(data.canAccessPremium)
      console.log('[SubscriptionContext] State updated - tier:', data.tier, 'premium:', data.canAccessPremium)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      setSubscription(null)
      setTier('free')
      setCanAccessPremium(false)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  // Listen for subscription changes
  useEffect(() => {
    if (!user) return

    const supabase = createClient()
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh subscription when profile is updated
          if (payload.new.subscription_status !== payload.old.subscription_status) {
            fetchSubscription()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchSubscription])

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        tier,
        canAccessPremium,
        isLoading,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}