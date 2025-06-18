# Stripe Production Setup Guide

This guide will walk you through setting up Stripe for real payments in your Math 7-8 application.

## Prerequisites

- A Stripe account (create one at https://stripe.com if you don't have one)
- Access to your Vercel deployment dashboard
- Your production domain (e.g., https://yourdomain.com)

## Step 1: Enable Live Mode in Stripe

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. In the top-right corner, you'll see a toggle for "Test mode"
3. Click the toggle to switch to **Live mode** (you may need to complete account verification first)

## Step 2: Get Production API Keys

1. In Live mode, go to [Developers → API keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Live keys**:
   - **Publishable key**: starts with `pk_live_`
   - **Secret key**: starts with `sk_live_` (click "Reveal live key" to see it)
3. Keep these safe - you'll need them for Step 6

## Step 3: Create Production Products and Prices

1. Go to [Products](https://dashboard.stripe.com/products) in Live mode
2. Click **"+ Add product"**
3. Create your Monthly subscription:
   - **Name**: "Math 7-8 Monthly Subscription"
   - **Description**: "Access to all Math 7-8 content and features"
   - **Pricing model**: Recurring
   - **Price**: Set your actual monthly price (e.g., $9.99)
   - **Billing period**: Monthly
   - Click **"Save product"**
4. After saving, copy the **Price ID** (starts with `price_`)
5. Repeat for Annual subscription:
   - **Name**: "Math 7-8 Annual Subscription"
   - **Description**: "Access to all Math 7-8 content and features - Save with annual billing!"
   - **Price**: Set your annual price (e.g., $99.99)
   - **Billing period**: Yearly
   - Copy the **Price ID**

## Step 4: Configure Production Webhook

1. Go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"+ Add endpoint"**
3. Configure the webhook:
   - **Endpoint URL**: `https://yourdomain.vercel.app/api/stripe/webhook`
     (Replace `yourdomain` with your actual domain)
   - **Events to send**: Click "receive all events" then search and select:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
4. Click **"Add endpoint"**
5. After creation, copy the **Signing secret** (click "Reveal" under "Signing secret")

## Step 5: Configure Customer Portal (Optional but Recommended)

1. Go to [Settings → Billing → Customer portal](https://dashboard.stripe.com/settings/billing/portal)
2. Click **"Configure portal"**
3. Configure these settings:
   - **Features**:
     - ✅ Allow customers to update payment methods
     - ✅ Allow customers to cancel subscriptions
     - ✅ Allow customers to switch plans (if you want this feature)
   - **Business information**: Add your business name and support email
   - **Branding**: Upload your logo and set brand colors
4. Click **"Save changes"**

## Step 6: Update Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Math 7-8 project
3. Go to **Settings → Environment Variables**
4. Add/Update these variables for **Production** environment:

```bash
# Stripe API Keys (from Step 2)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY

# Webhook Secret (from Step 4)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SIGNING_SECRET

# Product Price IDs (from Step 3)
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_PRICE_ID
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_YOUR_ANNUAL_PRICE_ID
```

5. Make sure each variable is set for the **Production** environment
6. Click **"Save"** for each variable

## Step 7: Deploy to Production

1. In Vercel, trigger a new deployment:
   - Either push a commit to your main branch
   - Or click **"Redeploy"** in the Vercel dashboard
2. Wait for the deployment to complete

## Step 8: Test Production Setup

### Test Webhook Connection
1. In Stripe Dashboard, go to your webhook endpoint
2. Click **"Send test webhook"**
3. Select `checkout.session.completed` and click **"Send test webhook"**
4. Check if it shows as successful

### Test Real Payment (Recommended)
1. Visit your production site
2. Go through the subscription flow
3. Use a real credit card to make a small test purchase
4. Verify:
   - Payment processes successfully
   - User gets proper access in your app
   - Subscription appears in Stripe Dashboard
   - You can access the customer portal

## Step 9: Monitor and Maintain

### Set Up Monitoring
1. In Stripe Dashboard, go to [Developers → Logs](https://dashboard.stripe.com/logs)
2. Monitor for any failed webhook deliveries
3. Set up email alerts for failed payments

### Regular Checks
- Monitor webhook health
- Check for failed payments
- Review subscription metrics
- Keep API versions updated

## Important Security Notes

1. **Never commit API keys to your repository**
2. **Keep production keys separate from test keys**
3. **Regularly rotate your API keys** (recommended every 90 days)
4. **Monitor for suspicious activity** in Stripe Dashboard

## Troubleshooting

### Webhook Failures
- Ensure your domain uses HTTPS
- Check webhook logs in Stripe Dashboard
- Verify the endpoint URL is correct
- Check Vercel function logs for errors

### Payment Failures
- Check customer's payment method
- Review Stripe's decline codes
- Ensure your account is properly verified

### Subscription Issues
- Verify price IDs are correct
- Check webhook processing
- Review Supabase logs for database errors

## Need Help?

- **Stripe Support**: https://support.stripe.com
- **Stripe Documentation**: https://stripe.com/docs
- **Check your implementation**: Review `/api/stripe/` routes in your codebase

## Final Checklist

Before going live, ensure:
- [ ] Live mode is enabled in Stripe
- [ ] Production API keys are in Vercel
- [ ] Real products with correct pricing are created
- [ ] Webhook endpoint is configured and tested
- [ ] Customer portal is configured
- [ ] You've done at least one test transaction
- [ ] Monitoring is set up
- [ ] Your Stripe account is fully verified

Once all steps are complete, your Math 7-8 app will be ready to accept real payments! 🎉