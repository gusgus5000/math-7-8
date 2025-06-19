// Load environment variables first
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testPortalConfiguration() {
  try {
    console.log('Testing Stripe Portal Configuration...\n');
    
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not configured');
      return;
    }
    
    // List portal configurations
    const configurations = await stripe.billingPortal.configurations.list({
      limit: 10,
    });
    
    console.log(`Found ${configurations.data.length} portal configuration(s):\n`);
    
    configurations.data.forEach((config, index) => {
      console.log(`Configuration ${index + 1}:`);
      console.log(`- ID: ${config.id}`);
      console.log(`- Active: ${config.active}`);
      console.log(`- Is Default: ${config.is_default}`);
      console.log(`- Created: ${new Date(config.created * 1000).toISOString()}`);
      console.log('');
    });
    
    // Check if there's an active configuration
    const activeConfig = configurations.data.find(config => config.active);
    if (!activeConfig) {
      console.error('❌ No active portal configuration found!');
      console.log('\nTo fix this:');
      console.log('1. Go to https://dashboard.stripe.com/test/settings/billing/portal');
      console.log('2. Click "Activate test link" to create a default configuration');
      console.log('3. Configure the portal settings as needed');
    } else {
      console.log('✅ Active portal configuration found!');
    }
    
  } catch (error) {
    console.error('Error testing portal configuration:', error.message);
    if (error.message.includes('No such')) {
      console.log('\nThis error suggests the Stripe Customer Portal is not activated.');
      console.log('Please activate it at: https://dashboard.stripe.com/test/settings/billing/portal');
    }
  }
}

testPortalConfiguration();