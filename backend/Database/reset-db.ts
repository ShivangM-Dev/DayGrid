#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function resetDB() {
  console.log('⚠️  RESETTING DATABASE (APP TABLES ONLY)…');

  const sql = `
  BEGIN;

  -- Drop tables (order matters)
  DROP TABLE IF EXISTS task_logs CASCADE;
  DROP TABLE IF EXISTS days CASCADE;
  DROP TABLE IF EXISTS tasks CASCADE;
  DROP TABLE IF EXISTS waitlist CASCADE;
  DROP TABLE IF EXISTS profiles CASCADE;

  -- Drop triggers
  DROP FUNCTION IF EXISTS set_updated_at CASCADE;

  COMMIT;
  `;

  try {
    await pool.query(sql);
    console.log('✅ Database reset complete');
  } catch (err) {
    console.error('❌ Reset failed');
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDB();
