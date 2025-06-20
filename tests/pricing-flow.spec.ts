import { test, expect } from '@playwright/test'

test.describe('Pricing Flow', () => {
  test('should redirect to signup with monthly plan parameter', async ({ page }) => {
    // Navigate to pricing page
    await page.goto('/pricing')
    
    // Find and click the monthly plan button
    const monthlyButton = page.locator('button:has-text("Get Started")').first()
    await monthlyButton.click()
    
    // Should redirect to signup with monthly plan parameter
    await expect(page).toHaveURL('/signup?plan=monthly')
  })

  test('should redirect to signup with annual plan parameter', async ({ page }) => {
    // Navigate to pricing page
    await page.goto('/pricing')
    
    // Find and click the annual plan button
    const annualButton = page.locator('button:has-text("Get Started")').nth(1)
    await annualButton.click()
    
    // Should redirect to signup with annual plan parameter
    await expect(page).toHaveURL('/signup?plan=annual')
  })

  test('signup page should maintain plan parameter through form submission', async ({ page }) => {
    // Navigate directly to signup with annual plan
    await page.goto('/signup?plan=annual')
    
    // Fill out the form
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')
    
    // Mock the API response
    await page.route('/api/stripe/create-signup-checkout', async (route) => {
      const request = route.request()
      const postData = await request.postDataJSON()
      
      // Verify the plan parameter is passed correctly
      expect(postData.plan).toBe('annual')
      
      // Return mock response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/test',
          sessionId: 'test-session-id'
        })
      })
    })
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Wait for the API call
    await page.waitForTimeout(1000)
  })
})