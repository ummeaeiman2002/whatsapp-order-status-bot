import fs from 'fs';
import path from 'path';

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  console.log('Migration SQL:');
  console.log(sql);
  console.log('\nTo run against Neon PostgreSQL:');
  console.log('  psql $DATABASE_URL -f src/db/schema.sql');
  console.log('\nThis file uses an in-memory store for development.');
  console.log('Seed data is auto-generated on server start.');
}

migrate().catch(console.error);
