#!/usr/bin/env node

import { createTables, checkDatabaseConnection } from '../src/lib/db.js';

async function setupDatabase() {
  console.log('🚀 Setting up Post2x database...');
  
  try {
    // Check connection first
    console.log('📡 Checking database connection...');
    const isConnected = await checkDatabaseConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed!');
      console.error('Please check your DATABASE_URL in .env.local');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful!');
    
    // Create tables
    console.log('📋 Creating database tables...');
    await createTables();
    
    console.log('✅ Database setup completed successfully!');
    console.log('\nTables created:');
    console.log('- users (for storing user data synced with Clerk)');
    console.log('- posts (for storing content analysis results)');
    console.log('- daily_ideas (for storing AI-generated post ideas)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
