#!/usr/bin/env node
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { Pool } from 'pg';
async function migrate() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is missing');
    }
    const schemaPath = './schema.sql';
    if (!existsSync(schemaPath)) {
        throw new Error('schema.sql not found');
    }
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
    try {
        // ensure migrations table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
        // check if already applied
        const { rows } = await pool.query(`SELECT 1 FROM migrations WHERE id = '001_initial'`);
        if (rows.length > 0) {
            console.log('✅ Initial schema already applied');
            return;
        }
        // read + execute schema
        const sql = readFileSync(schemaPath, 'utf8');
        await pool.query(sql);
        // record migration
        await pool.query(`INSERT INTO migrations (id, name) VALUES ($1, $2)`, ['001_initial', 'Initial Schema']);
        console.log('✅ Database migrated successfully');
    }
    finally {
        await pool.end();
    }
}
// run immediately (ESM-safe)
migrate().catch(err => {
    console.error('❌ Migration failed');
    console.error(err);
    process.exit(1);
});
