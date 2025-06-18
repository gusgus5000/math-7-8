# Subscription System Documentation

## Overview

The Math 7-8 app implements a comprehensive subscription system that tracks user access levels and enforces feature restrictions based on subscription tiers.

## Subscription Tiers

### Free Tier
- **Daily Limit**: 20 practice problems per day
- **Features**: Basic problem types only
- **No Access To**: 
  - Step-by-step solutions
  - Progress tracking
  - Downloadable worksheets
  - Custom difficulty settings
  - Advanced analytics

### Premium Tier
- **Daily Limit**: Unlimited practice problems
- **Features**: 
  - All problem types
  - Step-by-step solutions
  - Full progress tracking
  - Downloadable worksheets
  - Custom difficulty settings
  - Advanced analytics
  - Priority support

### Trial Tier
- **Duration**: 14 days
- **Features**: All premium features during trial period
- **Automatic**: Converts to free tier after expiration

## Implementation Details

### Database Schema

#### Tables Created

1. **user_usage**
   - Tracks daily problem solving
   - Records feature usage attempts
   - Resets daily at midnight

```sql
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  feature_attempts JSONB DEFAULT '{}',
  last_problem_at TIMESTAMP WITH TIME ZONE
);
```

2. **profiles** (extended)
   - Added subscription_status field
   - Added stripe_customer_id field
   - Added subscription_end_date field

### Core Components

#### 1. SubscriptionContext (`/src/contexts/SubscriptionContext.tsx`)
- Provides subscription state throughout the app
- Tracks usage in real-time
- Handles feature access checks
- Methods:
  - `checkFeatureAccess(feature)` - Check if user can access a feature
  - `canSolveProblem()` - Check if user can solve more problems
  - `incrementProblemCount()` - Track problem solving
  - `incrementFeatureAttempt(feature)` - Track feature usage

#### 2. FeatureGate Component (`/src/components/FeatureGate.tsx`)
- Wraps premium features
- Shows upgrade prompts for free users
- Two variants:
  - `<FeatureGate>` - Block-level gating
  - `<InlineFeatureGate>` - Inline lock icons

#### 3. Subscription Utilities (`/src/lib/subscription.ts`)
- `checkSubscriptionStatus()` - Get user's subscription state
- `getFeatureAccess()` - Get feature permissions by tier
- `getSubscriptionLimits()` - Get numerical limits by tier

### Integration Points

#### Stripe Webhook (`/src/app/api/stripe/webhook/route.ts`)
Updates user subscription status when:
- Checkout completed
- Subscription created/updated
- Subscription cancelled
- Payment failed

#### Middleware (`/src/middleware.ts`)
- Protects premium routes (`/practice/infinite`, `/practice/custom`)
- Redirects free users to pricing page
- Checks subscription status server-side

#### API Endpoint (`/src/app/api/subscription/status/route.ts`)
- Returns current subscription status
- Includes usage data when requested
- Cached for 1 minute for performance

## Usage Examples

### Basic Feature Gating

```tsx
<FeatureGate feature="solutionSteps">
  <div>Premium content here</div>
</FeatureGate>
```

### Checking Access in Components

```tsx
const { checkFeatureAccess, canSolveProblem } = useSubscription()

if (!canSolveProblem()) {
  return <DailyLimitReached />
}

if (checkFeatureAccess('solutionSteps')) {
  showSolution()
}
```

### Tracking Problem Solving

```tsx
const handleSubmit = async () => {
  const success = await incrementProblemCount()
  if (!success) {
    // User has reached daily limit
    showUpgradePrompt()
  }
}
```

## Testing

### Unit Tests
- `SubscriptionContext.test.tsx` - Context and hook testing
- `FeatureGate.test.tsx` - Component gating tests
- `InfinitePractice.test.tsx` - Integration with practice components

### E2E Tests
- `subscription-flow.e2e.ts` - Full user journey testing
  - Free user limits
  - Premium user access
  - Trial expiration
  - Middleware protection

## Monitoring & Analytics

The system tracks:
- Problems solved per day
- Feature access attempts
- Upgrade prompt impressions
- Subscription conversions

Usage data is stored in `user_usage.feature_attempts` as JSON for flexible analytics.

## Security Considerations

1. **Server-side Validation**: All access checks are validated server-side
2. **Middleware Protection**: Premium routes are protected at the middleware level
3. **Database RLS**: Row Level Security ensures users can only access their own data
4. **Webhook Security**: Stripe webhooks are verified with signatures

## Future Enhancements

1. **Grace Period**: Allow past_due subscriptions limited access
2. **Usage Analytics Dashboard**: Show users their learning patterns
3. **Referral System**: Free users earn extra problems by referring friends
4. **Tiered Pricing**: Multiple premium tiers with different limits
5. **Bulk Education Pricing**: Special rates for schools/classrooms