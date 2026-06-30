# Frontend Implementation Plan

## Phase 1: Foundation (T-FE-001, T-FE-002)
1. Scaffold Next.js 15 project with TypeScript
2. Install and configure Shadcn UI (button, card, input, badge, skeleton, tabs, table)
3. Set up Tailwind theme and globals.css
4. Build AppLayout with role-based sidebar navigation
5. Add placeholder pages for all routes

## Phase 2: Shared Components (T-FE-003)
1. OrderStatusBadge — map all 9 statuses to colors
2. TrackingTimeline — vertical event list
3. LoadingSkeleton — generic skeleton
4. ErrorBanner — dismissable with retry callback

## Phase 3: Chat Page (T-FE-004, T-FE-008)
1. Build API client layer (all endpoints)
2. Implement chat page with message list + input
3. Wire POST /api/chat for message submission
4. Render agent responses with inline order card + tracking timeline
5. Handle loading, error, and rate-limit states

## Phase 4: Orders Page (T-FE-005)
1. Build order list page with search + status filter
2. Build order detail page with full tracking timeline
3. Implement pagination
4. Test with seed data (500 orders)

## Phase 5: Dashboard + Notifications (T-FE-006, T-FE-007)
1. Build admin dashboard with summary cards and recent lists
2. Build notifications page with type filter
3. Add role-based access control to dashboard
4. Test both customer and admin flows
