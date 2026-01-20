# Push Notification System

This project implements **Web Push Notifications** using the Push API and Service Workers.

## How It Works

### 1. **Service Worker (`/public/sw.js`)**

- Registers with the browser to handle push events
- Receives push notifications even when the page is closed
- Displays native browser notifications

### 2. **Client-Side (`/src/pages/index.astro`)**

- Registers the service worker
- Subscribes to push notifications using the Push API
- Sends the subscription to the server

### 3. **Server-Side Endpoints**

- **`GET /api/vapid-public-key`** - Returns the VAPID public key for client-side subscription
- **`POST /api/subscribe`** - Saves push subscriptions from clients
- **`GET /notification?text=<message>`** - **THE WEBHOOK** - Triggers push notifications to all subscribed clients

## Usage

### Step 1: Enable Push Notifications

1. Open http://localhost:4321/
2. Click "Enable Notifications"
3. Grant permission when prompted by the browser

### Step 2: Test the Webhook

**Option A: Use the UI**

- Click "Test Webhook" button
- Enter a message
- You'll receive a push notification

**Option B: Call the webhook externally**

```bash
curl "http://localhost:4321/notification?idk=Hello%20from%20webhook"
```

Or open in your browser:

```
http://localhost:4321/notification?idk=Your%20message%20here
```

### Real-World Usage

In production, any service can call your webhook to trigger push notifications:

- External APIs
- Cron jobs
- Other applications
- Third-party services

## How Web Push Works

1. **Client subscribes**: Browser creates a unique endpoint for this user + generates a unique client ID
2. **Server stores subscription**: Your server saves the push subscription with the client ID
3. **Webhook triggered**: Someone calls `/notification?idk=message` (broadcast) or `/notification?idk=message&clientId=xyz` (individual)
4. **Server sends push**: Server uses `web-push` library to send notification to all or specific subscriber(s)
5. **Service Worker receives**: Service worker catches the push event
6. **Notification displayed**: Native browser notification appears

## API Endpoints

### `GET /notification?text=<message>&id=<optional>`

Trigger push notifications.

**Parameters:**

- `text` (required) - The notification message
- `id` (optional) - Specific client ID to send to. If omitted, broadcasts to ALL clients.

**Examples:**

```
# Broadcast to all
GET /notification?text=Hello%20everyone

# Send to specific client
GET /notification?text=Private%20message&id=client-abc123
```

### `GET /api/subscribe`

Get list of all connected clients.

### `POST /api/subscribe`

Subscribe a client to push notifications (called automatically by the UI).

### `GET /clients`

Web UI to view all connected clients and send individual notifications.

## Environment Variables

The `.env` file contains your VAPID keys (for push notification authentication):

- `VAPID_PUBLIC_KEY` - Public key (safe to expose to clients)
- `VAPID_PRIVATE_KEY` - Private key (keep secret on server)
- `VAPID_SUBJECT` - Your email or website URL

## Features

✅ Real Web Push API (not polling!)
✅ Works even when the page is closed
✅ Native browser notifications
✅ Service Worker based
✅ **Individual client targeting with unique IDs**
✅ **Broadcast to all clients OR send to specific client**
✅ Multiple subscribers supported
✅ Webhook endpoint for external triggers
✅ Shows notifications in HTML list as well
✅ Client management UI at `/clients`

## Browser Support

Works in all modern browsers that support:

- Service Workers
- Push API
- Notifications API

(Chrome, Firefox, Edge, Safari 16+, etc.)
