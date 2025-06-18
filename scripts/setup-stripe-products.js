#!/usr/bin/env node

const Stripe = require('stripe');

async function createProducts() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey || stripeSecretKey === 'sk_test_...') {
    console.error('❌ Error: STRIPE_SECRET_KEY is not set in your environment variables.');
    console.log('\nPlease follow these steps:');
    console.log('1. Go to https://dashboard.stripe.com/apikeys');
    console.log('2. Copy your secret key (starts with sk_test_ for test mode)');
    console.log('3. Add it to your .env.local file:');
    console.log('   STRIPE_SECRET_KEY=sk_test_your_actual_key_here');
    process.exit(1);
  }
  
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-05-28.basil'
  });
  
  try {
    console.log('🚀 Creating Stripe products and prices...\n');
    
    // Create the product
    const product = await stripe.products.create({
      name: 'MathMinds Premium',
      description: 'Unlimited access to all math practice problems with step-by-step solutions',
    });
    
    console.log('✅ Product created:', product.id);
    
    // Create monthly price ($1/month)
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 100, // $1.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Monthly Plan',
    });
    
    console.log('✅ Monthly price created:', monthlyPrice.id);
    
    // Create annual price ($10/year)
    const annualPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1000, // $10.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      nickname: 'Annual Plan',
    });
    
    console.log('✅ Annual price created:', annualPrice.id);
    
    console.log('\n🎉 Success! Add these to your .env.local file:\n');
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=${monthlyPrice.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=${annualPrice.id}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Copy the price IDs above to your .env.local file');
    console.log('2. Make sure you also have your publishable key set:');
    console.log('   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...');
    console.log('3. Set up webhook endpoint (for production):');
    console.log('   - Go to https://dashboard.stripe.com/webhooks');
    console.log('   - Add endpoint: https://your-domain.com/api/stripe/webhook');
    console.log('   - Select events: checkout.session.completed, customer.subscription.*');
    console.log('4. Restart your development server');
    
  } catch (error) {
    console.error('❌ Error creating products:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n🔑 Authentication failed. Please check that your STRIPE_SECRET_KEY is correct.');
    }
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

createProducts();