# Backend API Implementation Plan

## Phase 1: Foundation (T-BE-001, T-BE-009)
1. Set up env validation with zod
2. Create standardized API error/response helpers
3. Create error handling middleware pattern for all routes
4. Verify Neon DB connection from route handlers

## Phase 2: Service Layer (T-BE-002)
1. Build orderService (getByNumber, list with filters, getById)
2. Build trackingService (getByOrderId, getLatest)
3. Build conversationService (save, getBySessionId)
4. Build notificationService (create, list)
5. Build logService (save, list)
6. Test each service against seed data

## Phase 3: API Routes (T-BE-003, T-BE-004, T-BE-005, T-BE-006, T-BE-007)
1. Build orders routes (list + detail) — most independent
2. Build notifications route
3. Build logs route
4. Build chat POST route (wire into agent pipeline)
5. Build chat GET route (conversation history)
6. Add auth/role checks to each route

## Phase 4: Cron & Rate Limiting (T-BE-008, T-BE-011)
1. Build delay scanner cron job
2. Test with manually stale orders
3. Verify notifications generated without duplicates
4. Add rate limiting to chat endpoint
5. Test rate limit behavior

## Phase 5: Integration (T-BE-010)
1. Wire audit logging into all service operations
2. End-to-end test: chat → pipeline → DB → logs
3. Verify < 5s response time target
4. Document all routes and services
