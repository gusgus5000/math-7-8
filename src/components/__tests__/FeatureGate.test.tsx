import { render, screen } from '@testing-library/react'
import FeatureGate, { InlineFeatureGate } from '../FeatureGate'
import { useSubscription } from '@/contexts/SubscriptionContext'

// Mock the subscription hook
jest.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: jest.fn()
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

describe('FeatureGate', () => {
  const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when loading', () => {
    it('should show loading state', () => {
      mockUseSubscription.mockReturnValue({
        loading: true,
        checkFeatureAccess: jest.fn(),
        subscription: null,
        features: null,
        limits: null,
        usage: null,
        error: null,
        refreshSubscription: jest.fn(),
        canSolveProblem: jest.fn(),
        incrementProblemCount: jest.fn(),
        incrementFeatureAttempt: jest.fn(),
      })

      render(
        <FeatureGate feature="solutionSteps">
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByTestId(/animate-pulse/)).toBeInTheDocument()
      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
    })
  })

  describe('when user has access', () => {
    beforeEach(() => {
      mockUseSubscription.mockReturnValue({
        loading: false,
        checkFeatureAccess: jest.fn().mockReturnValue(true),
        subscription: { tier: 'premium', canAccessPremium: true },
        features: null,
        limits: null,
        usage: null,
        error: null,
        refreshSubscription: jest.fn(),
        canSolveProblem: jest.fn(),
        incrementProblemCount: jest.fn(),
        incrementFeatureAttempt: jest.fn(),
      })
    })

    it('should render children when user has access', () => {
      render(
        <FeatureGate feature="solutionSteps">
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByText('Premium Content')).toBeInTheDocument()
      expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument()
    })

    it('should check the correct feature', () => {
      const checkFeatureAccess = jest.fn().mockReturnValue(true)
      mockUseSubscription.mockReturnValue({
        ...mockUseSubscription(),
        checkFeatureAccess
      })

      render(
        <FeatureGate feature="progressTracking">
          <div>Content</div>
        </FeatureGate>
      )

      expect(checkFeatureAccess).toHaveBeenCalledWith('progressTracking')
    })
  })

  describe('when user does not have access', () => {
    beforeEach(() => {
      mockUseSubscription.mockReturnValue({
        loading: false,
        checkFeatureAccess: jest.fn().mockReturnValue(false),
        subscription: { tier: 'free', canAccessPremium: false },
        features: null,
        limits: null,
        usage: null,
        error: null,
        refreshSubscription: jest.fn(),
        canSolveProblem: jest.fn(),
        incrementProblemCount: jest.fn(),
        incrementFeatureAttempt: jest.fn(),
      })
    })

    it('should show upgrade prompt by default', () => {
      render(
        <FeatureGate feature="solutionSteps">
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.getByText('Premium Feature')).toBeInTheDocument()
      expect(screen.getByText(/Step-by-step solutions is a premium feature/)).toBeInTheDocument()
      expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument()
    })

    it('should show custom message when provided', () => {
      render(
        <FeatureGate 
          feature="solutionSteps"
          customMessage="Get detailed solutions with premium"
        >
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByText('Get detailed solutions with premium')).toBeInTheDocument()
    })

    it('should render fallback when provided', () => {
      render(
        <FeatureGate 
          feature="solutionSteps"
          fallback={<div>Free tier content</div>}
        >
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByText('Free tier content')).toBeInTheDocument()
      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument()
    })

    it('should hide upgrade prompt when showUpgradePrompt is false', () => {
      render(
        <FeatureGate 
          feature="solutionSteps"
          showUpgradePrompt={false}
        >
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument()
    })

    it('should show trial expiration warning for trial users', () => {
      mockUseSubscription.mockReturnValue({
        ...mockUseSubscription(),
        subscription: { 
          tier: 'trial', 
          canAccessPremium: true,
          trialDaysRemaining: 3 
        }
      })

      render(
        <FeatureGate feature="solutionSteps">
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByText('Your trial ends in 3 days')).toBeInTheDocument()
    })
  })
})

describe('InlineFeatureGate', () => {
  const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show children when user has access', () => {
    mockUseSubscription.mockReturnValue({
      loading: false,
      checkFeatureAccess: jest.fn().mockReturnValue(true),
      subscription: null,
      features: null,
      limits: null,
      usage: null,
      error: null,
      refreshSubscription: jest.fn(),
      canSolveProblem: jest.fn(),
      incrementProblemCount: jest.fn(),
      incrementFeatureAttempt: jest.fn(),
    })

    render(
      <InlineFeatureGate feature="solutionSteps">
        <span>Unlock</span>
      </InlineFeatureGate>
    )

    expect(screen.getByText('Unlock')).toBeInTheDocument()
  })

  it('should show lock icon when user lacks access', () => {
    mockUseSubscription.mockReturnValue({
      loading: false,
      checkFeatureAccess: jest.fn().mockReturnValue(false),
      subscription: null,
      features: null,
      limits: null,
      usage: null,
      error: null,
      refreshSubscription: jest.fn(),
      canSolveProblem: jest.fn(),
      incrementProblemCount: jest.fn(),
      incrementFeatureAttempt: jest.fn(),
    })

    const { container } = render(
      <InlineFeatureGate feature="solutionSteps">
        <span>Unlock</span>
      </InlineFeatureGate>
    )

    expect(screen.queryByText('Unlock')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should use custom locked icon when provided', () => {
    mockUseSubscription.mockReturnValue({
      loading: false,
      checkFeatureAccess: jest.fn().mockReturnValue(false),
      subscription: null,
      features: null,
      limits: null,
      usage: null,
      error: null,
      refreshSubscription: jest.fn(),
      canSolveProblem: jest.fn(),
      incrementProblemCount: jest.fn(),
      incrementFeatureAttempt: jest.fn(),
    })

    render(
      <InlineFeatureGate 
        feature="solutionSteps"
        lockedIcon={<span data-testid="custom-icon">🔒</span>}
      >
        <span>Unlock</span>
      </InlineFeatureGate>
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should show tooltip on hover', () => {
    mockUseSubscription.mockReturnValue({
      loading: false,
      checkFeatureAccess: jest.fn().mockReturnValue(false),
      subscription: null,
      features: null,
      limits: null,
      usage: null,
      error: null,
      refreshSubscription: jest.fn(),
      canSolveProblem: jest.fn(),
      incrementProblemCount: jest.fn(),
      incrementFeatureAttempt: jest.fn(),
    })

    const { container } = render(
      <InlineFeatureGate 
        feature="solutionSteps"
        tooltip="Upgrade to see solutions"
      >
        <span>Unlock</span>
      </InlineFeatureGate>
    )

    const wrapper = container.querySelector('span[title]')
    expect(wrapper).toHaveAttribute('title', 'Upgrade to see solutions')
  })
})