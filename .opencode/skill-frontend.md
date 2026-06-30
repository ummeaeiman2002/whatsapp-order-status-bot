# Frontend Skill — AI Order Status Agent

## Stack
Next.js 15 + TypeScript + TailwindCSS + Shadcn UI

## Pages (under src/app/)

### /chat
- Chat interface for customers to ask about orders
- Message input, message history display
- AI responses rendered inline
- Session-based conversation continuity

### /dashboard
- Admin dashboard
- Overview of orders, conversations, notifications, logs
- Only accessible by Administrator role

### /orders
- Order list with search/filter
- Order detail view with tracking timeline
- Status badges using order state enum

### /notifications
- Notification list
- Filter by type (Delay Alert, Delivery Confirmation, Tracking Update)
- Timestamp display

## User Roles

### Customer
- Chat with AI
- View order status
- View tracking history

### Administrator
- View all orders
- View all conversations
- View notifications
- View system logs

## Design
- Shadcn UI components throughout
- TailwindCSS for styling
- Responsive layout
- Loading states for async operations
- Error boundaries
