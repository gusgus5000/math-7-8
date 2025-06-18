import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import InfinitePractice from '../InfinitePractice'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { generateProblem } from '@/lib/problemGenerator'

// Mock dependencies
jest.mock('@/contexts/SubscriptionContext')
jest.mock('@/lib/problemGenerator')
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

const mockGenerateProblem = generateProblem as jest.MockedFunction<typeof generateProblem>
const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription>

describe('InfinitePractice', () => {
  const defaultProps = {
    grade: 7,
    topicId: 'ratios',
    topicTitle: 'Ratios and Proportions'
  }

  const mockProblem = {
    question: 'What is 2 + 2?',
    answer: '4',
    hint: 'Add the numbers',
    solution: 'Step 1: 2 + 2 = 4'
  }

  const mockSubscription = {
    loading: false,
    subscription: null,
    features: null,
    limits: null,
    usage: null,
    error: null,
    refreshSubscription: jest.fn(),
    checkFeatureAccess: jest.fn(),
    canSolveProblem: jest.fn(),
    incrementProblemCount: jest.fn(),
    incrementFeatureAttempt: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGenerateProblem.mockReturnValue(mockProblem)
  })

  describe('Free User Experience', () => {
    it('should display remaining problems count for free users', () => {
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        subscription: { tier: 'free', canAccessPremium: false },
        usage: { 
          problemsSolved: 5, 
          remainingProblems: 15,
          lastProblemAt: null,
          featureAttempts: {},
          date: '2024-01-01'
        },
        canSolveProblem: jest.fn().mockReturnValue(true),
      })

      render(<InfinitePractice {...defaultProps} />)

      expect(screen.getByText('15 problems left today')).toBeInTheDocument()
    })

    it('should show daily limit reached screen when limit exceeded', () => {
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        subscription: { tier: 'free', canAccessPremium: false },
        usage: { 
          problemsSolved: 20, 
          remainingProblems: 0,
          lastProblemAt: null,
          featureAttempts: {},
          date: '2024-01-01'
        },
        canSolveProblem: jest.fn().mockReturnValue(false),
      })

      render(<InfinitePractice {...defaultProps} />)

      expect(screen.getByText('Daily Limit Reached')).toBeInTheDocument()
      expect(screen.getByText(/You've solved all 20 free problems for today!/)).toBeInTheDocument()
      expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument()
    })

    it('should not show solution steps for free users', async () => {
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        subscription: { tier: 'free', canAccessPremium: false },
        canSolveProblem: jest.fn().mockReturnValue(true),
        incrementProblemCount: jest.fn().mockResolvedValue(true),
        checkFeatureAccess: jest.fn().mockReturnValue(false),
      })

      render(<InfinitePractice {...defaultProps} />)

      // Submit answer
      const input = screen.getByPlaceholderText('Enter your answer')
      fireEvent.change(input, { target: { value: '4' } })
      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(screen.getByText('✅ Correct!')).toBeInTheDocument()
      })

      // Should show upgrade prompt instead of solution
      expect(screen.getByText('Premium Feature')).toBeInTheDocument()
      expect(screen.getByText(/Upgrade to see step-by-step solutions/)).toBeInTheDocument()
    })

    it('should prevent submission when daily limit is reached', async () => {
      const canSolveProblem = jest.fn()
        .mockReturnValueOnce(true) // Initial render
        .mockReturnValue(false) // After submission

      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        subscription: { tier: 'free', canAccessPremium: false },
        canSolveProblem,
        incrementProblemCount: jest.fn().mockResolvedValue(false),
      })

      const { rerender } = render(<InfinitePractice {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your answer')
      fireEvent.change(input, { target: { value: '4' } })
      fireEvent.click(screen.getByText('Submit'))

      // Re-render with updated state
      rerender(<InfinitePractice {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Daily Limit Reached')).toBeInTheDocument()
      })
    })
  })

  describe('Premium User Experience', () => {
    beforeEach(() => {
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        subscription: { 
          tier: 'premium', 
          canAccessPremium: true,
          status: 'active',
          isActive: true
        },
        usage: { 
          problemsSolved: 50, 
          remainingProblems: null, // Unlimited
          lastProblemAt: null,
          featureAttempts: {},
          date: '2024-01-01'
        },
        canSolveProblem: jest.fn().mockReturnValue(true),
        incrementProblemCount: jest.fn().mockResolvedValue(true),
        checkFeatureAccess: jest.fn().mockReturnValue(true),
      })
    })

    it('should not show problem limit for premium users', () => {
      render(<InfinitePractice {...defaultProps} />)

      expect(screen.queryByText(/problems left today/)).not.toBeInTheDocument()
    })

    it('should show solution steps for premium users', async () => {
      render(<InfinitePractice {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your answer')
      fireEvent.change(input, { target: { value: '4' } })
      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(screen.getByText('Solution:')).toBeInTheDocument()
        expect(screen.getByText('Step 1: 2 + 2 = 4')).toBeInTheDocument()
      })
    })

    it('should allow unlimited problems for premium users', async () => {
      render(<InfinitePractice {...defaultProps} />)

      // Submit multiple problems
      for (let i = 0; i < 5; i++) {
        const input = screen.getByPlaceholderText('Enter your answer')
        fireEvent.change(input, { target: { value: '4' } })
        fireEvent.click(screen.getByText('Submit'))

        await waitFor(() => {
          expect(screen.getByText('Next Problem →')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('Next Problem →'))
      }

      // Should still be able to continue
      expect(screen.queryByText('Daily Limit Reached')).not.toBeInTheDocument()
    })
  })

  describe('Feature Tracking', () => {
    it('should track hint usage', async () => {
      const incrementFeatureAttempt = jest.fn()
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        canSolveProblem: jest.fn().mockReturnValue(true),
        incrementFeatureAttempt,
      })

      render(<InfinitePractice {...defaultProps} />)

      fireEvent.click(screen.getByText('Show Hint'))

      await waitFor(() => {
        expect(incrementFeatureAttempt).toHaveBeenCalledWith('hints')
      })
    })
  })


  describe('Problem Submission Flow', () => {
    it('should increment problem count on submission', async () => {
      const incrementProblemCount = jest.fn().mockResolvedValue(true)
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        canSolveProblem: jest.fn().mockReturnValue(true),
        incrementProblemCount,
      })

      render(<InfinitePractice {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your answer')
      fireEvent.change(input, { target: { value: '4' } })
      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(incrementProblemCount).toHaveBeenCalled()
      })
    })

    it('should update score and streak correctly', async () => {
      mockUseSubscription.mockReturnValue({
        ...mockSubscription,
        canSolveProblem: jest.fn().mockReturnValue(true),
        incrementProblemCount: jest.fn().mockResolvedValue(true),
      })

      render(<InfinitePractice {...defaultProps} />)

      // Submit correct answer
      const input = screen.getByPlaceholderText('Enter your answer')
      fireEvent.change(input, { target: { value: '4' } })
      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(screen.getByText('Score: 1')).toBeInTheDocument()
        expect(screen.getByText('Streak: 1 🔥')).toBeInTheDocument()
      })
    })
  })
})