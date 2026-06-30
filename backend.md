# Backend Testing Guide

## Prerequisites
- Node.js installed
- Terminal open in `C:\Users\ICS\Desktop\example ai proj\backend`

---

## Step 1: Install Dependencies

```powershell
npm install
```

This installs Express, Groq SDK, Zod, etc.

---

## Step 2: Start the Server

```powershell
npm run dev
```

Wait until you see:

```
🚀 Order Status Agent Backend
  ─────────────────────────────
  Port:        4000
  Groq:        Fallback mode (no API key)
  Seed Data:   Loaded
```

The server is now running at `http://localhost:4000`.

> **Note**: The Groq API key is empty, so AI responses will return a fallback message. That's fine for testing.

> **Note**: Leave this terminal running. Open a **new terminal** for Step 3.

---

## Step 3: Test the Endpoints

Run these commands in a **new PowerShell terminal**.

### 3a. Health Check

```powershell
curl.exe -s http://localhost:4000/api/health
```

**Expected output:**
```json
{"status":"ok","timestamp":"..."}
```

---

### 3b. List Orders

```powershell
curl.exe -s "http://localhost:4000/api/orders?page=1&limit=3"
```

**Expected output:** A paginated list of 3 orders (total ~500). Each order has id, order_number, status, courier_name, expected_delivery_date.

---

### 3c. Get Order Detail

Pick an `order_number` from the list above (e.g. `ORD-0001`) and run:

```powershell
curl.exe -s "http://localhost:4000/api/orders/ORD-0001?userId=any-id&userRole=Admin"
```

**Expected output:** Order details + tracking updates array.

Try with `userRole=Customer` too — it should still work.

---

### 3d. Send a Chat Message

```powershell
curl.exe -s -X POST http://localhost:4000/api/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"Where is my order ORD-0001?\",\"sessionId\":\"test-session-1\",\"userId\":\"user-1\"}'
```

**Expected output:** A reply object with `reply`, `order`, and `isDelayed` fields.

Try other messages:
- `"Where is my order ORD-9999?"` — non-existent order
- `"Hello"` — general message (not an order inquiry)
- `"Cancel my order ORD-0001"` — should say it can't do that

---

### 3e. Get Chat History

```powershell
curl.exe -s "http://localhost:4000/api/chat?sessionId=test-session-1"
```

**Expected output:** All messages from that session.

---

### 3f. List Notifications

```powershell
curl.exe -s "http://localhost:4000/api/notifications"
```

**Expected output:** Paginated list of notifications (empty initially unless delays found).

---

### 3g. View Audit Logs

```powershell
curl.exe -s "http://localhost:4000/api/logs"
```

**Expected output:** Every agent action logged (ORDER_FETCHED, RESPONSE_GENERATED, etc.).

---

### 3h. Test Rate Limiting

Send 11 chat messages fast:

```powershell
1..11 | ForEach-Object {
  curl.exe -s -X POST http://localhost:4000/api/chat `
    -H "Content-Type: application/json" `
    -d '{\"message\":\"test\",\"sessionId\":\"rate-test\",\"userId\":\"user-1\"}'
}
```

The 11th request should return a 429 error with `"code": "RATE_LIMITED"`.

---

### 3i. Trigger Delay Scanner

```powershell
curl.exe -s -X POST http://localhost:4000/api/cron/scan-delays
```

**Expected output:** Summary of delayed orders found. Run it, then check notifications:

```powershell
curl.exe -s "http://localhost:4000/api/notifications"
```

---

## Step 4: Test Validation Errors

```powershell
# Missing message
curl.exe -s -X POST http://localhost:4000/api/chat `
  -H "Content-Type: application/json" `
  -d '{\"sessionId\":\"test\"}'

# Invalid status filter
curl.exe -s "http://localhost:4000/api/orders?status=INVALID"

# Invalid page number
curl.exe -s "http://localhost:4000/api/orders?page=0"

# Non-existent order
curl.exe -s "http://localhost:4000/api/orders/ORD-99999"
```

All should return clear error messages with appropriate HTTP status codes.

---

## Done

You've tested:
- [x] Server starts and loads seed data
- [x] Health check
- [x] Order listing (paginated, filtered, searched)
- [x] Order detail with tracking
- [x] Chat message processing (agent pipeline)
- [x] Chat history
- [x] Notifications
- [x] Audit logs
- [x] Rate limiting
- [x] Delay scanner
- [x] Validation errors
