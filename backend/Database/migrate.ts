#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🚀 Running migrations…');

    // 1️⃣ Ensure migrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        executed_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 2️⃣ Get already applied migrations
    const { rows } = await client.query<{ id: string }>(
      `SELECT id FROM migrations`
    );
    const applied = new Set(rows.map(r => r.id));

    // 3️⃣ Read migration files
    const files = readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort(); // filename order is migration order

    if (files.length === 0) {
      console.log('⚠️  No migrations found');
      return;
    }

    // 4️⃣ Apply pending migrations
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`↪️  Skipping ${file}`);
        continue;
      }

      console.log(`➡️  Applying ${file}`);

      const sql = readFileSync(
        path.join(MIGRATIONS_DIR, file),
        'utf8'
      );

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          `INSERT INTO migrations (id) VALUES ($1)`,
          [file]
        );
        await client.query('COMMIT');
        console.log(`✅ Applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed ${file}`);
        throw err;
      }
    }

    console.log('🎉 All migrations complete');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(err => {
  console.error('❌ Migration process failed');
  console.error(err);
  process.exit(1);
});
