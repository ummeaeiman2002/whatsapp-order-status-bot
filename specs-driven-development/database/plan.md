# Database Implementation Plan

## Phase 1: Foundation (T-DB-001, T-DB-004)
1. Install dependencies: `@neondatabase/serverless`, `dotenv`
2. Create TypeScript types and enums in `src/types/index.ts`
3. Set up Neon connection client in `src/db/client.ts`
4. Validate connection with a simple health query

## Phase 2: Schema (T-DB-002)
1. Write complete DDL in `src/db/schema.sql`
2. Create migration runner `src/db/migrate.ts`
3. Run migration against Neon instance
4. Verify all 6 tables, constraints, and indexes

## Phase 3: Queries (T-DB-003)
1. Implement query layer — start with orders + tracking (hot path)
2. Add conversations + agent_logs queries
3. Add notifications + users queries
4. Test each query function with sample data

## Phase 4: Seeding (T-DB-005)
1. Build seed generator with realistic ecommerce data
2. Insert in dependency order: users → orders → tracking_updates → conversations → notifications → agent_logs
3. Verify row counts match spec minimums
4. Run spot-check queries to validate data integrity

## Phase 5: Optimization (T-DB-006)
1. Profile slow queries with EXPLAIN ANALYZE
2. Add missing indexes
3. Verify order lookup by ORD-XXXX completes < 50ms
