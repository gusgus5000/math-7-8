import { test, expect } from '@playwright/test'

test.describe('Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase auth to simulate logged-in user
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          access_token: 'mock-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }
      }))
    })
  })

  test.describe('Free User Limits', () => {
    test('should enforce daily problem limit', async ({ page }) => {
      // Mock API responses for free user
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: {
              tier: 'free',
              status: 'active',
              canAccessPremium: false
            },
            usage: {
              problemsSolved: 19,
              remainingProblems: 1
            },
            features: {
              solutionSteps: false,
              unlimitedPractice: false
            }
          })
        })
      })

      // Navigate to practice page
      await page.goto('/practice/infinite')
      
      // Should see limit warning
      await expect(page.locator('text=/1 problems left today/')).toBeVisible()
      
      // Submit an answer
      await page.fill('input[placeholder="Enter your answer"]', '42')
      await page.click('button:has-text("Submit")')
      
      // Should show limit reached
      await expect(page.locator('text=/Daily Limit Reached/')).toBeVisible()
      await expect(page.locator('text=/Upgrade to Premium/')).toBeVisible()
    })

    test('should not show solutions for free users', async ({ page }) => {
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: {
              tier: 'free',
              status: 'active',
              canAccessPremium: false
            },
            features: {
              solutionSteps: false
            }
          })
        })
      })

      await page.goto('/practice/infinite')
      
      // Submit answer
      await page.fill('input[placeholder="Enter your answer"]', '42')
      await page.click('button:has-text("Submit")')
      
      // Should show upgrade prompt instead of solution
      await expect(page.locator('text=/Premium Feature/')).toBeVisible()
      await expect(page.locator('text=/Upgrade to see step-by-step solutions/')).toBeVisible()
    })
  })

  test.describe('Premium User Access', () => {
    test('should have unlimited practice for premium users', async ({ page }) => {
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: {
              tier: 'premium',
              status: 'active',
              canAccessPremium: true
            },
            usage: {
              problemsSolved: 100,
              remainingProblems: null
            },
            features: {
              solutionSteps: true,
              unlimitedPractice: true
            }
          })
        })
      })

      await page.goto('/practice/infinite')
      
      // Should not see any limit warnings
      await expect(page.locator('text=/problems left today/')).not.toBeVisible()
      
      // Submit multiple problems
      for (let i = 0; i < 3; i++) {
        await page.fill('input[placeholder="Enter your answer"]', '42')
        await page.click('button:has-text("Submit")')
        
        // Should see solution
        await expect(page.locator('text=/Solution:/')).toBeVisible()
        
        await page.click('button:has-text("Next Problem")')
      }
      
      // Should still be able to continue
      await expect(page.locator('text=/Daily Limit Reached/')).not.toBeVisible()
    })
  })

  test.describe('Dashboard Subscription Display', () => {
    test('should show subscription status on dashboard', async ({ page }) => {
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: {
              tier: 'free',
              status: 'active'
            },
            usage: {
              problemsSolved: 15,
              remainingProblems: 5
            },
            features: {
              solutionSteps: false,
              unlimitedPractice: false
            }
          })
        })
      })

      await page.goto('/dashboard')
      
      // Should see subscription status
      await expect(page.locator('text=/Free Plan/')).toBeVisible()
      await expect(page.locator('text=/15.*\/20/')).toBeVisible() // 15/20 problems
      await expect(page.locator('text=/Step-by-step solutions/').locator('..')).toHaveClass(/text-gray-400/)
    })

    test('should show upgrade button for free users', async ({ page }) => {
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: { tier: 'free' }
          })
        })
      })

      await page.goto('/dashboard')
      
      const upgradeButton = page.locator('a:has-text("Upgrade")')
      await expect(upgradeButton).toBeVisible()
      await expect(upgradeButton).toHaveAttribute('href', '/pricing')
    })
  })

  test.describe('Trial User Experience', () => {
    test('should show trial expiration warning', async ({ page }) => {
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: {
              tier: 'trial',
              status: 'trialing',
              canAccessPremium: true,
              trialDaysRemaining: 3
            },
            features: {
              solutionSteps: true,
              unlimitedPractice: true
            }
          })
        })
      })

      await page.goto('/dashboard')
      
      await expect(page.locator('text=/Trial Plan/')).toBeVisible()
      await expect(page.locator('text=/3 days remaining/')).toBeVisible()
    })
  })

  test.describe('Middleware Protection', () => {
    test('should redirect to pricing for premium routes', async ({ page }) => {
      await page.route('**/api/subscription/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscription: {
              tier: 'free',
              status: 'active',
              canAccessPremium: false
            }
          })
        })
      })

      // Try to access premium route
      await page.goto('/practice/infinite')
      
      // Should be redirected to pricing with upgrade param
      await expect(page).toHaveURL(/\/pricing\?upgrade=true/)
    })
  })
})