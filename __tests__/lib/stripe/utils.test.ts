import {
  formatCurrency,
  calculateTax,
  validateWebhookSignature,
  createStripeCustomer,
  handleSubscriptionChange,
  getPriceAmount,
  isValidPriceId,
  getSubscriptionStatus,
  calculateProration,
} from '@/lib/stripe/utils'

describe('Stripe Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(999, 'usd')).toBe('$9.99')
      expect(formatCurrency(1000, 'usd')).toBe('$10.00')
      expect(formatCurrency(1050, 'usd')).toBe('$10.50')
    })

    it('formats EUR currency correctly', () => {
      expect(formatCurrency(999, 'eur')).toBe('€9.99')
      expect(formatCurrency(1000, 'eur')).toBe('€10.00')
    })

    it('formats GBP currency correctly', () => {
      expect(formatCurrency(999, 'gbp')).toBe('£9.99')
      expect(formatCurrency(1000, 'gbp')).toBe('£10.00')
    })

    it('handles zero amounts', () => {
      expect(formatCurrency(0, 'usd')).toBe('$0.00')
    })

    it('handles negative amounts', () => {
      expect(formatCurrency(-1000, 'usd')).toBe('-$10.00')
    })

    it('handles very large amounts', () => {
      expect(formatCurrency(999999999, 'usd')).toBe('$9,999,999.99')
    })

    it('throws error for invalid currency', () => {
      expect(() => formatCurrency(1000, 'invalid' as any)).toThrow('Invalid currency code')
    })
  })

  describe('calculateTax', () => {
    it('calculates US sales tax correctly', () => {
      expect(calculateTax(1000, 'US', 'CA')).toBe(73) // 7.25% CA tax
      expect(calculateTax(1000, 'US', 'TX')).toBe(63) // 6.25% TX tax
      expect(calculateTax(1000, 'US', 'NY')).toBe(80) // 8% NY tax
    })

    it('calculates EU VAT correctly', () => {
      expect(calculateTax(1000, 'DE')).toBe(190) // 19% German VAT
      expect(calculateTax(1000, 'FR')).toBe(200) // 20% French VAT
      expect(calculateTax(1000, 'GB')).toBe(200) // 20% UK VAT
    })

    it('returns 0 for tax-exempt regions', () => {
      expect(calculateTax(1000, 'US', 'OR')).toBe(0) // Oregon has no sales tax
      expect(calculateTax(1000, 'US', 'MT')).toBe(0) // Montana has no sales tax
    })

    it('handles invalid regions gracefully', () => {
      expect(calculateTax(1000, 'INVALID')).toBe(0)
    })

    it('rounds tax to nearest cent', () => {
      expect(calculateTax(999, 'US', 'CA')).toBe(72) // 999 * 0.0725 = 72.4275 -> 72
    })
  })

  describe('validateWebhookSignature', () => {
    const secret = 'whsec_test_secret'
    const validPayload = JSON.stringify({ id: 'evt_test' })
    const validTimestamp = Math.floor(Date.now() / 1000)
    
    it('validates correct signature', () => {
      const signature = generateTestSignature(validPayload, validTimestamp, secret)
      
      expect(validateWebhookSignature(
        validPayload,
        signature,
        secret
      )).toBe(true)
    })

    it('rejects invalid signature', () => {
      expect(validateWebhookSignature(
        validPayload,
        'invalid_signature',
        secret
      )).toBe(false)
    })

    it('rejects expired timestamp (older than 5 minutes)', () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 301 // 5 min + 1 sec old
      const signature = generateTestSignature(validPayload, oldTimestamp, secret)
      
      expect(validateWebhookSignature(
        validPayload,
        signature,
        secret
      )).toBe(false)
    })

    it('rejects future timestamp', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 60 // 1 minute in future
      const signature = generateTestSignature(validPayload, futureTimestamp, secret)
      
      expect(validateWebhookSignature(
        validPayload,
        signature,
        secret
      )).toBe(false)
    })

    it('rejects modified payload', () => {
      const signature = generateTestSignature(validPayload, validTimestamp, secret)
      const modifiedPayload = JSON.stringify({ id: 'evt_modified' })
      
      expect(validateWebhookSignature(
        modifiedPayload,
        signature,
        secret
      )).toBe(false)
    })

    it('throws error for missing parameters', () => {
      expect(() => validateWebhookSignature('', '', secret)).toThrow()
      expect(() => validateWebhookSignature(validPayload, '', '')).toThrow()
    })
  })

  describe('createStripeCustomer', () => {
    const mockStripe = {
      customers: {
        create: jest.fn(),
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('creates customer with email and metadata', async () => {
      const mockCustomer = {
        id: 'cus_test123',
        email: 'test@example.com',
        metadata: { userId: 'user_123' },
      }
      
      mockStripe.customers.create.mockResolvedValue(mockCustomer)
      
      const result = await createStripeCustomer(mockStripe as any, {
        email: 'test@example.com',
        userId: 'user_123',
      })
      
      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        metadata: { userId: 'user_123' },
      })
      expect(result).toEqual(mockCustomer)
    })

    it('creates customer with additional metadata', async () => {
      const mockCustomer = {
        id: 'cus_test123',
        email: 'test@example.com',
        metadata: { userId: 'user_123', grade: '7' },
      }
      
      mockStripe.customers.create.mockResolvedValue(mockCustomer)
      
      const result = await createStripeCustomer(mockStripe as any, {
        email: 'test@example.com',
        userId: 'user_123',
        metadata: { grade: '7' },
      })
      
      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        metadata: { userId: 'user_123', grade: '7' },
      })
    })

    it('handles Stripe API errors gracefully', async () => {
      const stripeError = new Error('Invalid API key')
      stripeError.name = 'StripeAuthenticationError'
      
      mockStripe.customers.create.mockRejectedValue(stripeError)
      
      await expect(createStripeCustomer(mockStripe as any, {
        email: 'test@example.com',
        userId: 'user_123',
      })).rejects.toThrow('Failed to create Stripe customer')
    })

    it('validates email format', async () => {
      await expect(createStripeCustomer(mockStripe as any, {
        email: 'invalid-email',
        userId: 'user_123',
      })).rejects.toThrow('Invalid email format')
    })

    it('requires userId', async () => {
      await expect(createStripeCustomer(mockStripe as any, {
        email: 'test@example.com',
        userId: '',
      })).rejects.toThrow('userId is required')
    })
  })

  describe('handleSubscriptionChange', () => {
    it('handles new subscription creation', () => {
      const event = {
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_123',
            status: 'active',
            customer: 'cus_123',
            items: {
              data: [{
                price: { id: 'price_monthly' },
              }],
            },
            current_period_end: 1234567890,
          },
        },
      }
      
      const result = handleSubscriptionChange(event as any)
      
      expect(result).toEqual({
        subscriptionId: 'sub_123',
        customerId: 'cus_123',
        status: 'active',
        priceId: 'price_monthly',
        periodEnd: new Date(1234567890 * 1000),
        action: 'created',
      })
    })

    it('handles subscription updates', () => {
      const event = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_123',
            status: 'past_due',
            customer: 'cus_123',
            items: {
              data: [{
                price: { id: 'price_monthly' },
              }],
            },
            current_period_end: 1234567890,
          },
          previous_attributes: {
            status: 'active',
          },
        },
      }
      
      const result = handleSubscriptionChange(event as any)
      
      expect(result).toEqual({
        subscriptionId: 'sub_123',
        customerId: 'cus_123',
        status: 'past_due',
        previousStatus: 'active',
        priceId: 'price_monthly',
        periodEnd: new Date(1234567890 * 1000),
        action: 'updated',
      })
    })

    it('handles subscription deletion', () => {
      const event = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123',
            status: 'canceled',
            customer: 'cus_123',
            items: {
              data: [{
                price: { id: 'price_monthly' },
              }],
            },
            current_period_end: 1234567890,
          },
        },
      }
      
      const result = handleSubscriptionChange(event as any)
      
      expect(result).toEqual({
        subscriptionId: 'sub_123',
        customerId: 'cus_123',
        status: 'canceled',
        priceId: 'price_monthly',
        periodEnd: new Date(1234567890 * 1000),
        action: 'deleted',
      })
    })

    it('throws error for unsupported event type', () => {
      const event = {
        type: 'invoice.payment_failed',
        data: { object: {} },
      }
      
      expect(() => handleSubscriptionChange(event as any)).toThrow('Unsupported subscription event')
    })
  })

  describe('getPriceAmount', () => {
    it('returns correct amount for valid price IDs', () => {
      expect(getPriceAmount('price_monthly')).toBe(999) // $9.99
      expect(getPriceAmount('price_annual')).toBe(9900) // $99.00
    })

    it('throws error for invalid price ID', () => {
      expect(() => getPriceAmount('invalid_price')).toThrow('Unknown price ID')
    })
  })

  describe('isValidPriceId', () => {
    it('validates known price IDs', () => {
      expect(isValidPriceId('price_monthly')).toBe(true)
      expect(isValidPriceId('price_annual')).toBe(true)
    })

    it('rejects unknown price IDs', () => {
      expect(isValidPriceId('price_unknown')).toBe(false)
      expect(isValidPriceId('')).toBe(false)
      expect(isValidPriceId(null as any)).toBe(false)
    })
  })

  describe('getSubscriptionStatus', () => {
    it('returns active for valid subscription', () => {
      const subscription = {
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 86400, // 1 day future
      }
      
      expect(getSubscriptionStatus(subscription as any)).toBe('active')
    })

    it('returns expired for past period end', () => {
      const subscription = {
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) - 86400, // 1 day past
      }
      
      expect(getSubscriptionStatus(subscription as any)).toBe('expired')
    })

    it('returns status as-is for non-active statuses', () => {
      expect(getSubscriptionStatus({ status: 'canceled' } as any)).toBe('canceled')
      expect(getSubscriptionStatus({ status: 'past_due' } as any)).toBe('past_due')
      expect(getSubscriptionStatus({ status: 'trialing' } as any)).toBe('trialing')
    })
  })

  describe('calculateProration', () => {
    it('calculates proration for upgrade mid-cycle', () => {
      const currentPrice = 999 // $9.99
      const newPrice = 1999 // $19.99
      const daysRemaining = 15
      const daysInPeriod = 30
      
      const proration = calculateProration(
        currentPrice,
        newPrice,
        daysRemaining,
        daysInPeriod
      )
      
      // Expected: (19.99 - 9.99) * (15/30) = 10 * 0.5 = 5.00 = 500 cents
      expect(proration).toBe(500)
    })

    it('calculates negative proration for downgrade', () => {
      const currentPrice = 1999 // $19.99
      const newPrice = 999 // $9.99
      const daysRemaining = 15
      const daysInPeriod = 30
      
      const proration = calculateProration(
        currentPrice,
        newPrice,
        daysRemaining,
        daysInPeriod
      )
      
      // Expected: (9.99 - 19.99) * (15/30) = -10 * 0.5 = -5.00 = -500 cents
      expect(proration).toBe(-500)
    })

    it('returns 0 for no price change', () => {
      const proration = calculateProration(999, 999, 15, 30)
      expect(proration).toBe(0)
    })

    it('returns 0 for no days remaining', () => {
      const proration = calculateProration(999, 1999, 0, 30)
      expect(proration).toBe(0)
    })

    it('handles annual to monthly conversion', () => {
      const annualMonthly = 9900 / 12 // $99/year = $8.25/month = 825 cents
      const monthlyPrice = 999 // $9.99
      const daysRemaining = 180 // 6 months
      const daysInPeriod = 365
      
      const proration = calculateProration(
        annualMonthly,
        monthlyPrice,
        daysRemaining,
        daysInPeriod
      )
      
      expect(proration).toBeGreaterThan(0)
    })
  })
})

// Helper function for webhook signature testing
function generateTestSignature(payload: string, timestamp: number, secret: string): string {
  const crypto = require('crypto')
  const signedPayload = `${timestamp}.${payload}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')
  return `t=${timestamp},v1=${signature}`
}