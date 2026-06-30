# Frontend Testing Guide

## Prerequisites
- Node.js installed
- Terminal open in `C:\Users\ICS\Desktop\example ai proj\frontend`

---

## Step 1: Install Dependencies

```powershell
npm install
```

This installs Next.js, React, TailwindCSS, etc.

---

## Step 2: Start the Dev Server

```powershell
npm run dev
```

Wait until you see something like:

```
▲ Next.js 16.2.9
   Local:        http://localhost:3000
```

The frontend is now running at `http://localhost:3000`.

> **Leave this terminal running.** Open a **new terminal** if you need to run more commands.

---

## Step 3: Open in Browser

Open your browser and go to **http://localhost:3000**

You should see the default **Create Next App** landing page with:
- Next.js logo
- "To get started, edit the page.tsx file." heading
- "Templates" and "Learning" links
- "Deploy Now" button

---

## Step 4: Verify TailwindCSS Works

Open your browser's DevTools (F12) and check the `<html>` tag has classes like `h-full antialiased` applied. The page should have a white background with black text (or dark mode if your OS prefers it).

---

## Step 5: Confirm Hot Reloading Works

While the dev server is running, make a small change to `app/page.tsx` (e.g. change the heading text). Save the file. The browser page should **autoreload** within 1-2 seconds and show your change.

---

## Done

You've tested:
- [x] Frontend compiles without errors
- [x] Dev server starts on port 3000
- [x] Default page renders in browser
- [x] TailwindCSS styles are applied
- [x] Hot reloading works

---

## What's Missing

The frontend is currently just the `create-next-app` boilerplate. When the app pages are built, you'll test:

- `/chat` — Chat page (send messages, see replies)
- `/orders` — Order list (search, filter, paginate)
- `/orders/[id]` — Order detail (status, tracking timeline)
- `/dashboard` — Admin dashboard
- `/notifications` — Notification list

Until then, only the steps above apply.
