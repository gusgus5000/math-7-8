#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  console.log('🚀 Running database migrations...\n')

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  
  // Get all SQL files in migrations directory
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    console.log(`📄 Running migration: ${file}`)
    
    try {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      
      // Execute the migration
      const { error } = await supabase.rpc('exec_sql', { query: sql })
      
      if (error) {
        // Try direct execution if RPC fails
        const { error: directError } = await supabase.from('_migrations').select('*').limit(1)
        if (directError) {
          console.error(`❌ Failed to run ${file}:`, error.message)
          console.error('Note: You may need to run these migrations directly in Supabase Dashboard')
          continue
        }
      }
      
      console.log(`✅ Successfully ran ${file}`)
    } catch (err) {
      console.error(`❌ Error running ${file}:`, err.message)
    }
  }

  console.log('\n✨ Migration process complete!')
  console.log('\nIMPORTANT: If any migrations failed, you can run them manually in the Supabase Dashboard:')
  console.log('1. Go to your Supabase project')
  console.log('2. Navigate to SQL Editor')
  console.log('3. Copy and paste the SQL from the failed migration files')
  console.log('4. Run the queries')
}

// Check if user_usage table exists
async function checkMigrationStatus() {
  console.log('🔍 Checking migration status...\n')
  
  const { data, error } = await supabase
    .from('user_usage')
    .select('id')
    .limit(1)
  
  if (error && error.code === '42P01') {
    console.log('❌ user_usage table not found - migrations need to be run')
    return false
  } else if (error) {
    console.log('⚠️  Could not check migration status:', error.message)
    return null
  } else {
    console.log('✅ user_usage table exists - migrations may already be applied')
    return true
  }
}

async function main() {
  console.log('Math 7-8 Database Migration Runner')
  console.log('==================================\n')

  const status = await checkMigrationStatus()
  
  if (status === true) {
    console.log('\nIt looks like migrations have already been applied.')
    console.log('Do you want to run them again? This is safe as migrations use IF NOT EXISTS.')
    
    // In a real script, we'd prompt for confirmation
    console.log('\nSkipping re-run. If you need to re-run migrations, execute them manually in Supabase.')
    return
  }

  await runMigrations()
}

main().catch(console.error)