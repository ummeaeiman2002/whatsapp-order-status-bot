# Frontend Specification

## Source
CONSTITUTION.md §3, §5, §18; FR-001, FR-008

## Stack
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI components

## Pages

### /chat (src/app/chat/)
| Element | Description |
|---|---|
| Message list | Scrollable, auto-scroll to latest, agent messages left-aligned, user right-aligned |
| Input field | Text input + send button, disabled while loading |
| Order card | When order is identified, show inline card with order number, status badge, delivery date |
| Tracking timeline | Expandable timeline showing tracking updates chronologically |
| Loading state | Skeleton loader during agent response generation |
| Error state | Error banner with retry option |

States: Empty (no messages), Active (conversation in progress), Error (API failure), Rate Limited (429 feedback)

### /orders (src/app/orders/)
| Element | Description |
|---|---|
| Order list | Table/card list with search bar, filter by status dropdown |
| Order detail | Full order info + tracking timeline + courier name |
| Status badge | Color-coded badge per OrderStatus enum |
| Search | By order_number (ORD-XXXX) |
| Pagination | Server-side paginated list |

States: Loading, Empty (no orders found), List with results, Error

### /dashboard (src/app/dashboard/) — Admin only
| Element | Description |
|---|---|
| Summary cards | Total orders, pending, delayed, today's notifications |
| Recent conversations | Latest 10 agent interactions |
| Recent logs | Latest 10 agent_logs entries |
| Quick actions | Links to orders, notifications, logs |

States: Loading, Data, Empty, Forbidden (non-admin)

### /notifications (src/app/notifications/)
| Element | Description |
|---|---|
| Notification list | Sorted by created_at DESC, paginated |
| Filter tabs | All | Delay Alert | Delivery Confirmation | Tracking Update |
| Notification card | Icon + type label + message + timestamp |

States: Loading, Empty, Filtered Empty, List with results

## User Role Enforcement
- Customer role: access /chat, /orders (own orders only)
- Administrator role: access all pages
- Redirect to login or show forbidden state if unauthorized

## Shared Components
- `AppLayout` — sidebar/nav with role-based menu items
- `OrderStatusBadge` — color-coded badge for each status
- `TrackingTimeline` — vertical timeline component
- `LoadingSkeleton` — reusable skeleton placeholder
- `ErrorBanner` — dismissable error message
