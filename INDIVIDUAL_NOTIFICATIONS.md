# Individual Client Notifications

## How It Works

Each browser/client gets a unique `clientId` that is:

- Generated automatically when you first visit the page
- Stored in `localStorage` so it persists across page reloads
- Displayed prominently at the top of the page
- Used to identify this specific browser for targeted notifications

## Usage Examples

### 1. Broadcast to ALL Clients

```bash
curl "http://localhost:4321/notification?text=Hello%20everyone"
```

### 2. Send to a SPECIFIC Client

```bash
# Replace 'client-abc123xyz' with the actual client ID
curl "http://localhost:4321/notification?text=Private%20message&id=client-abc123xyz"
```

### 3. View All Connected Clients

Open http://localhost:4321/clients in your browser to see:

- List of all connected clients
- Their client IDs
- Quick buttons to send test notifications to each one

## Get Your Client ID

1. Open http://localhost:4321/
2. Click "Enable Notifications"
3. Your client ID is displayed at the top of the page
4. Copy it for use in targeted notifications

## Example Workflow

**Scenario:** You have 3 browsers open

1. **Browser A** (Chrome) - Client ID: `client-abc123`
2. **Browser B** (Firefox) - Client ID: `client-xyz789`
3. **Browser C** (Edge) - Client ID: `client-def456`

```bash
# Send to everyone
curl "http://localhost:4321/notification?text=Team%20meeting%20in%205%20minutes"
# → All 3 browsers receive the notification

# Send only to Browser B
curl "http://localhost:4321/notification?text=Your%20report%20is%20ready&id=client-xyz789"
# → Only Firefox receives this notification
```

## API Response

The webhook returns information about who received the notification:

```json
{
  "success": true,
  "message": "Your message here",
  "timestamp": "2026-01-20T17:08:57.488Z",
  "sentTo": 1,
  "broadcast": false,
  "clientId": "client-abc123xyz"
}
```

- `sentTo` - Number of clients that received the notification
- `broadcast` - `true` if sent to all, `false` if targeted
- `clientId` - The target client ID (null if broadcast)
