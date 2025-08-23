#!/usr/bin/env tsx

import { DatabaseManager } from '../database/manager'
import { config } from 'dotenv'

// Load environment variables
config()

async function runMigrations() {
  console.log('🚀 Starting FlowSync database migrations...')
  
  const dbManager = new DatabaseManager()
  
  try {
    await dbManager.initialize()
    console.log('✅ All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await dbManager.close()
  }
}

if (require.main === module) {
  runMigrations()
}