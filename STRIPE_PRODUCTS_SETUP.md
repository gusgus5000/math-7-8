# Stripe Products Setup Guide

## Current Issue
The application is trying to use Stripe price IDs that don't exist in your Stripe account:
- Monthly: `price_1Rb8oPJT5OnqRRQiAoDrSF1p`
- Annual: `price_1Rb8ohJT5OnqRRQi90uHI8AQ`

## How to Fix

### Option 1: Create Products with Specific Price IDs (Recommended for Development)

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Create your Monthly subscription:
   - Name: "Math 7-8 Monthly Subscription"
   - Pricing model: Recurring
   - Price: $1.00
   - Billing period: Monthly
4. Create your Annual subscription:
   - Name: "Math 7-8 Annual Subscription"
   - Pricing model: Recurring
   - Price: $10.00
   - Billing period: Yearly

### Option 2: Update Your Environment Variables

After creating products in Stripe:

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/test/products
2. Click on each product you created
3. Copy the price ID (starts with `price_`)
4. Update your `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_PRICE_ID
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_YOUR_ANNUAL_PRICE_ID
```

5. Restart your Next.js development server

## Testing Your Setup

1. Make sure you're using Stripe test mode (not live mode)
2. Use test card numbers from: https://stripe.com/docs/testing#cards
   - Success: 4242 4242 4242 4242
   - Requires authentication: 4000 0025 0000 3155
3. Use any future date for expiration
4. Use any 3-digit CVC
5. Use any 5-digit ZIP code

## Common Issues

- **"No such price" error**: The price ID in your env doesn't exist in your Stripe account
- **Authentication required**: Make sure you're using the correct secret key (test vs live)
- **Invalid API key**: Check that your `STRIPE_SECRET_KEY` is correctly set in `.env.local`

## Need Help?

Check the Stripe logs for detailed error information:
https://dashboard.stripe.com/test/logs