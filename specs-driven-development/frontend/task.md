# Frontend Tasks

## T-FE-001: Project Scaffold
- Initialize Next.js 15 project with TypeScript + TailwindCSS
- Install Shadcn UI: `npx shadcn@latest init`
- Configure `tailwind.config.ts` with shadcn theme
- Set up `src/app/globals.css` with base styles

## T-FE-002: Layout & Navigation
- Create `src/app/layout.tsx` with root layout
- Create `src/components/AppLayout.tsx` with sidebar navigation
- Role-based menu items (Customer vs Admin)
- Responsive: mobile hamburger, desktop sidebar

## T-FE-003: Shared Components
- `src/components/OrderStatusBadge.tsx` — map status → color/variant
- `src/components/TrackingTimeline.tsx` — vertical timeline from Shadcn
- `src/components/LoadingSkeleton.tsx` — reusable skeleton
- `src/components/ErrorBanner.tsx` — dismissable error with retry

## T-FE-004: Chat Page
- Create `src/app/chat/page.tsx`
- Message list with auto-scroll
- Input area with send button
- Loading skeleton during agent response
- Agent response renders order card + tracking timeline inline
- States: empty, loading, error, rate-limited

## T-FE-005: Orders Page
- Create `src/app/orders/page.tsx` — list with search + filter
- Create `src/app/orders/[id]/page.tsx` — detail with tracking timeline
- Server-side pagination
- Status badge rendering
- Search by order_number

## T-FE-006: Dashboard Page
- Create `src/app/dashboard/page.tsx` — admin only
- Summary stat cards
- Recent conversations list
- Recent agent logs list
- Forbidden state for non-admin users

## T-FE-007: Notifications Page
- Create `src/app/notifications/page.tsx`
- Notification list with filter tabs
- Notification card component with type icon
- Empty state per filter

## T-FE-008: API Integration Layer
- Create `src/lib/api-client.ts` with fetch wrappers
- `sendMessage(sessionId, message)` → POST /api/chat
- `getOrders(search, status, page)` → GET /api/orders
- `getOrderById(id)` → GET /api/orders/[id]
- `getNotifications(type, page)` → GET /api/notifications
- `getDashboard()` → GET /api/dashboard (admin)
- `getLogs()` → GET /api/logs (admin)
