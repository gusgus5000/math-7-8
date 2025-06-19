import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import PricingPage from '@/app/pricing/page'
import { useAuth } from '@/components/AuthProvider'
import { useSubscription } from '@/contexts/SubscriptionContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock auth provider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: jest.fn(),
}))

// Mock subscription context
jest.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: jest.fn(),
}))

// Mock Stripe client
jest.mock('@/lib/stripe/client', () => ({
  createCheckoutSession: jest.fn(),
  redirectToCheckout: jest.fn(),
}))

describe('PricingPage', () => {
  const mockPush = jest.fn()
  const mockSessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useAuth as jest.Mock).mockReturnValue({ user: null })
    ;(useSubscription as jest.Mock).mockReturnValue({
      subscription: null,
      canAccessPremium: false,
      isLoading: false,
    })
    
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    })
  })

  it('stores monthly plan type in sessionStorage when unauthenticated user selects monthly', async () => {
    render(<PricingPage />)
    
    // Find and click the monthly plan button
    const monthlyButton = screen.getAllByText(/Get Started|Sign Up to Start/i)[0]
    fireEvent.click(monthlyButton)

    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('selectedPlanType', 'monthly')
      expect(mockPush).toHaveBeenCalledWith('/signup')
    })
  })

  it('stores annual plan type in sessionStorage when unauthenticated user selects annual', async () => {
    render(<PricingPage />)
    
    // Find and click the annual plan button (second button)
    const annualButton = screen.getAllByText(/Get Started|Sign Up to Start/i)[1]
    fireEvent.click(annualButton)

    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('selectedPlanType', 'annual')
      expect(mockPush).toHaveBeenCalledWith('/signup')
    })
  })

  it('does not store plan type for authenticated users', async () => {
    // Mock authenticated user
    ;(useAuth as jest.Mock).mockReturnValue({ 
      user: { id: 'user123', email: 'test@example.com' } 
    })

    const { createCheckoutSession } = require('@/lib/stripe/client')
    createCheckoutSession.mockResolvedValue('cs_test_123')

    render(<PricingPage />)
    
    // Find and click a plan button
    const button = screen.getAllByText(/Get Started/i)[0]
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalledWith('/signup')
      expect(createCheckoutSession).toHaveBeenCalled()
    })
  })
})