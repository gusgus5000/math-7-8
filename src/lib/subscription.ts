import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export type SubscriptionTier = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired'

export interface SubscriptionInfo {
  tier: SubscriptionTier
  status: string
  isActive: boolean
  canAccessPremium: boolean
  endDate?: Date
  daysRemaining?: number
  requiresPaymentUpdate?: boolean
  error?: string
}

export interface FeatureAccess {
  solutionSteps: boolean
  unlimitedPractice: boolean
  downloadWorksheets: boolean
  prioritySupport: boolean
}

export interface Subscription {
  id: string
  status: SubscriptionStatus
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  tier: SubscriptionTier
}

export interface SubscriptionState {
  isLoading: boolean
  subscription: Subscription | null
  error: Error | null
}

export async function getSubscriptionStatus(userId: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  try {
    const { data, error } = await client
      .from('profiles')
      .select('subscription_status, subscription_end_date, stripe_subscription_id')
      .eq('id', userId)
      .single()

    if (error) throw error

    if (!data || !data.subscription_status) {
      return {
        subscription: null,
        tier: 'free' as SubscriptionTier,
        canAccessPremium: false
      }
    }

    const endDate = data.subscription_end_date ? new Date(data.subscription_end_date) : null
    const now = new Date()
    
    // Check if subscription is expired
    if (endDate && endDate < now && data.subscription_status !== 'active') {
      return {
        subscription: null,
        tier: 'free' as SubscriptionTier,
        canAccessPremium: false
      }
    }

    // Determine tier based on status
    let tier: SubscriptionTier = 'free'
    let canAccessPremium = false

    switch (data.subscription_status) {
      case 'active':
        tier = 'premium'
        canAccessPremium = true
        break
      case 'past_due':
        // Give grace period for past due
        tier = 'premium'
        canAccessPremium = true
        break
      case 'canceled':
        // If canceled but not expired, still give access
        if (endDate && endDate > now) {
          tier = 'premium'
          canAccessPremium = true
        }
        break
    }

    return {
      subscription: {
        id: data.stripe_subscription_id,
        status: data.subscription_status,
        currentPeriodEnd: endDate,
        cancelAtPeriodEnd: data.subscription_status === 'canceled',
        tier
      },
      tier,
      canAccessPremium
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return {
      subscription: null,
      tier: 'free' as SubscriptionTier,
      canAccessPremium: false
    }
  }
}

export function canAccessPremiumFeature(subscription: Subscription | null): boolean {
  if (!subscription) return false
  
  const premiumStatuses: SubscriptionStatus[] = ['active', 'past_due']
  if (!premiumStatuses.includes(subscription.status)) return false
  
  // Check if subscription is expired
  if (subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd) < new Date()) {
    return false
  }
  
  return true
}

export function formatSubscriptionEndDate(date: Date | string | null): string {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}