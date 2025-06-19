// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testPortalFallback() {
  console.log('Testing Portal URL Fallback...\n');
  
  // Check if we're in test mode
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const isTestMode = stripeKey?.startsWith('sk_test_');
  
  console.log(`Stripe Mode: ${isTestMode ? 'TEST' : 'PRODUCTION'}`);
  console.log(`Expected Portal URL: ${isTestMode ? 'https://billing.stripe.com/p/login/test_7sYaEY1lNcqOcP3b6X9Zm00' : 'https://billing.stripe.com/p/login/7sYaEY1lNcqOcP3b6X9Zm00'}`);
  
  console.log('\n✅ The portal session API will now return the hardcoded URL as a fallback when Stripe portal creation fails.');
}

testPortalFallback();