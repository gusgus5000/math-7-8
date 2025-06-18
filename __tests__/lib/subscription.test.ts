import {
  checkSubscriptionStatus,
  getFeatureAccess,
  getUserSubscriptionTier,
  canAccessPremiumFeatures,
  getSubscriptionLimits,
  isTrialExpired,
  calculateTrialEndDate,
  shouldShowUpgradePrompt,
  getSubscriptionBenefits,
} from '@/lib/subscription'

describe('Subscription Logic', () => {
  const mockUser = {
    id: 'user_123',
    email: 'test@example.com',
  }

  describe('checkSubscriptionStatus', () => {
    it('returns free tier for user without subscription', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null }),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'free',
        status: 'active',
        isActive: true,
        canAccessPremium: false,
      })
    })

    it('returns premium tier for active subscription', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  subscription_status: 'active',
                  subscription_end_date: new Date(Date.now() + 86400000).toISOString(),
                },
              }),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'premium',
        status: 'active',
        isActive: true,
        canAccessPremium: true,
        endDate: expect.any(Date),
      })
    })

    it('returns trial tier for trialing subscription', async () => {
      const trialEndDate = new Date(Date.now() + 7 * 86400000)
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  subscription_status: 'trialing',
                  subscription_end_date: trialEndDate.toISOString(),
                },
              }),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'trial',
        status: 'trialing',
        isActive: true,
        canAccessPremium: true,
        endDate: trialEndDate,
        trialDaysRemaining: 7,
      })
    })

    it('handles past_due subscriptions', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  subscription_status: 'past_due',
                  subscription_end_date: new Date(Date.now() + 86400000).toISOString(),
                },
              }),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'premium',
        status: 'past_due',
        isActive: false,
        canAccessPremium: true, // Grace period
        endDate: expect.any(Date),
        requiresPaymentUpdate: true,
      })
    })

    it('handles canceled subscriptions with remaining time', async () => {
      const endDate = new Date(Date.now() + 5 * 86400000) // 5 days left
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  subscription_status: 'canceled',
                  subscription_end_date: endDate.toISOString(),
                },
              }),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'premium',
        status: 'canceled',
        isActive: false,
        canAccessPremium: true, // Until end date
        endDate: endDate,
        daysRemaining: 5,
      })
    })

    it('handles expired subscriptions', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  subscription_status: 'canceled',
                  subscription_end_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                },
              }),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'free',
        status: 'expired',
        isActive: false,
        canAccessPremium: false,
      })
    })

    it('handles database errors gracefully', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockRejectedValue(new Error('Database error')),
            }),
          }),
        }),
      }

      const status = await checkSubscriptionStatus(mockSupabase, 'user_123')
      
      expect(status).toEqual({
        tier: 'free',
        status: 'error',
        isActive: false,
        canAccessPremium: false,
        error: 'Failed to check subscription status',
      })
    })
  })

  describe('getFeatureAccess', () => {
    it('returns correct features for free tier', () => {
      const features = getFeatureAccess('free')
      
      expect(features).toEqual({
        practiceProblems: true,
        practiceLimit: 20,
        solutionSteps: false,
        progressTracking: false,
        downloadWorksheets: false,
        customDifficulty: false,
        unlimitedPractice: false,
        advancedAnalytics: false,
        prioritySupport: false,
      })
    })

    it('returns correct features for premium tier', () => {
      const features = getFeatureAccess('premium')
      
      expect(features).toEqual({
        practiceProblems: true,
        practiceLimit: null,
        solutionSteps: true,
        progressTracking: true,
        downloadWorksheets: true,
        customDifficulty: true,
        unlimitedPractice: true,
        advancedAnalytics: true,
        prioritySupport: true,
      })
    })

    it('returns correct features for trial tier', () => {
      const features = getFeatureAccess('trial')
      
      expect(features).toEqual({
        practiceProblems: true,
        practiceLimit: null,
        solutionSteps: true,
        progressTracking: true,
        downloadWorksheets: true,
        customDifficulty: true,
        unlimitedPractice: true,
        advancedAnalytics: true,
        prioritySupport: false, // Not included in trial
      })
    })
  })

  describe('getUserSubscriptionTier', () => {
    it('extracts tier from subscription status', () => {
      expect(getUserSubscriptionTier({ tier: 'premium' })).toBe('premium')
      expect(getUserSubscriptionTier({ tier: 'free' })).toBe('free')
      expect(getUserSubscriptionTier({ tier: 'trial' })).toBe('trial')
    })

    it('defaults to free for missing tier', () => {
      expect(getUserSubscriptionTier({})).toBe('free')
      expect(getUserSubscriptionTier(null)).toBe('free')
      expect(getUserSubscriptionTier(undefined)).toBe('free')
    })
  })

  describe('canAccessPremiumFeatures', () => {
    it('returns true for premium features access', () => {
      expect(canAccessPremiumFeatures({ canAccessPremium: true })).toBe(true)
      expect(canAccessPremiumFeatures({ tier: 'premium', canAccessPremium: true })).toBe(true)
      expect(canAccessPremiumFeatures({ tier: 'trial', canAccessPremium: true })).toBe(true)
    })

    it('returns false for no premium access', () => {
      expect(canAccessPremiumFeatures({ canAccessPremium: false })).toBe(false)
      expect(canAccessPremiumFeatures({ tier: 'free', canAccessPremium: false })).toBe(false)
    })

    it('defaults to false for missing data', () => {
      expect(canAccessPremiumFeatures({})).toBe(false)
      expect(canAccessPremiumFeatures(null)).toBe(false)
      expect(canAccessPremiumFeatures(undefined)).toBe(false)
    })
  })

  describe('getSubscriptionLimits', () => {
    it('returns limits for free tier', () => {
      const limits = getSubscriptionLimits('free')
      
      expect(limits).toEqual({
        dailyProblems: 20,
        savedProgress: 7, // days
        worksheetsPerMonth: 0,
        customProblemsPerDay: 0,
      })
    })

    it('returns unlimited for premium tier', () => {
      const limits = getSubscriptionLimits('premium')
      
      expect(limits).toEqual({
        dailyProblems: Infinity,
        savedProgress: Infinity,
        worksheetsPerMonth: Infinity,
        customProblemsPerDay: Infinity,
      })
    })

    it('returns trial limits', () => {
      const limits = getSubscriptionLimits('trial')
      
      expect(limits).toEqual({
        dailyProblems: Infinity,
        savedProgress: 30, // days
        worksheetsPerMonth: 10,
        customProblemsPerDay: 50,
      })
    })
  })

  describe('isTrialExpired', () => {
    it('returns false for active trial', () => {
      const status = {
        tier: 'trial' as const,
        endDate: new Date(Date.now() + 86400000), // 1 day future
      }
      
      expect(isTrialExpired(status)).toBe(false)
    })

    it('returns true for expired trial', () => {
      const status = {
        tier: 'trial' as const,
        endDate: new Date(Date.now() - 86400000), // 1 day past
      }
      
      expect(isTrialExpired(status)).toBe(true)
    })

    it('returns false for non-trial tiers', () => {
      expect(isTrialExpired({ tier: 'free' as const })).toBe(false)
      expect(isTrialExpired({ tier: 'premium' as const })).toBe(false)
    })

    it('returns true for trial without end date', () => {
      expect(isTrialExpired({ tier: 'trial' as const })).toBe(true)
    })
  })

  describe('calculateTrialEndDate', () => {
    it('calculates 14-day trial from start date', () => {
      const startDate = new Date('2024-01-01')
      const endDate = calculateTrialEndDate(startDate)
      
      expect(endDate).toEqual(new Date('2024-01-15'))
    })

    it('calculates from current date if not provided', () => {
      const endDate = calculateTrialEndDate()
      const expectedEnd = new Date()
      expectedEnd.setDate(expectedEnd.getDate() + 14)
      
      expect(endDate.toDateString()).toEqual(expectedEnd.toDateString())
    })

    it('supports custom trial duration', () => {
      const startDate = new Date('2024-01-01')
      const endDate = calculateTrialEndDate(startDate, 7)
      
      expect(endDate).toEqual(new Date('2024-01-08'))
    })
  })

  describe('shouldShowUpgradePrompt', () => {
    it('shows prompt for free users after usage threshold', () => {
      const freeUser = { tier: 'free' as const, canAccessPremium: false }
      
      expect(shouldShowUpgradePrompt(freeUser, { problemsSolved: 15 })).toBe(true)
      expect(shouldShowUpgradePrompt(freeUser, { daysActive: 5 })).toBe(true)
      expect(shouldShowUpgradePrompt(freeUser, { featureAttempts: 3 })).toBe(true)
    })

    it('shows prompt for expiring trials', () => {
      const trialUser = {
        tier: 'trial' as const,
        endDate: new Date(Date.now() + 2 * 86400000), // 2 days left
        trialDaysRemaining: 2,
      }
      
      expect(shouldShowUpgradePrompt(trialUser)).toBe(true)
    })

    it('does not show prompt for premium users', () => {
      const premiumUser = { tier: 'premium' as const, canAccessPremium: true }
      
      expect(shouldShowUpgradePrompt(premiumUser, { problemsSolved: 100 })).toBe(false)
    })

    it('does not show prompt below thresholds', () => {
      const freeUser = { tier: 'free' as const, canAccessPremium: false }
      
      expect(shouldShowUpgradePrompt(freeUser, { problemsSolved: 5 })).toBe(false)
      expect(shouldShowUpgradePrompt(freeUser, { daysActive: 1 })).toBe(false)
    })
  })

  describe('getSubscriptionBenefits', () => {
    it('returns benefits list for each tier', () => {
      const freeBenefits = getSubscriptionBenefits('free')
      expect(freeBenefits).toContain('20 practice problems per day')
      expect(freeBenefits).toContain('Basic problem types')
      
      const premiumBenefits = getSubscriptionBenefits('premium')
      expect(premiumBenefits).toContain('Unlimited practice problems')
      expect(premiumBenefits).toContain('Step-by-step solutions')
      expect(premiumBenefits).toContain('Download worksheets')
      
      const trialBenefits = getSubscriptionBenefits('trial')
      expect(trialBenefits).toContain('All premium features for 14 days')
    })

    it('returns comparison benefits for upgrade prompts', () => {
      const comparison = getSubscriptionBenefits('free', true)
      
      expect(comparison.current).toContain('20 practice problems per day')
      expect(comparison.premium).toContain('Unlimited practice problems')
      expect(comparison.upgrade).toContain('Unlock unlimited problems')
    })
  })
})