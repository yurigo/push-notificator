# Admin Panel

## Admin - Send Messages

The admin panel provides a user-friendly interface to send push notifications to connected clients.

**URL:** http://localhost:4321/admin/send

### Features

1. **Client Selection Dropdown**
   - View all connected clients in a dropdown
   - Select individual client by ID
   - Option to broadcast to ALL clients
   - Shows connection time for each client

2. **Message Composition**
   - Large textarea for composing messages
   - Support for multi-line messages
   - Keyboard shortcut: `Ctrl + Enter` to send

3. **Client Information Display**
   - Shows selected client details:
     - Client ID
     - Connection time
     - Last seen time
     - User agent (browser info)
   - Broadcast mode indicator showing how many clients will receive the message

4. **Send History**
   - View last 10 sent notifications
   - Shows timestamp, target client, and message content
   - Distinguishes between broadcast and individual messages

5. **Real-time Status Updates**
   - Success/error messages with auto-dismiss
   - Confirmation of delivery with recipient count

### Connected Clients List

The system now maintains a persistent list of connected clients with metadata:

- **Client ID** - Unique identifier for each browser
- **Connected At** - When the client first subscribed
- **Last Seen** - Most recent activity timestamp
- **User Agent** - Browser and OS information

This metadata is available via the `/api/subscribe` endpoint:

```json
{
  "count": 2,
  "clients": [
    {
      "id": "client-abc123...",
      "fullId": "client-abc123xyz",
      "connectedAt": "2026-01-20T17:00:00.000Z",
      "lastSeen": "2026-01-20T17:30:00.000Z",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

### Navigation

- **Home** (`/`) - Main page to enable notifications
- **Clients** (`/clients`) - View all connected clients with quick send buttons
- **Admin Send** (`/admin/send`) - Full-featured admin interface

### Usage Workflow

1. Open http://localhost:4321/admin/send
2. The client dropdown will load automatically
3. Select a client (or choose "BROADCAST TO ALL")
4. Type your message in the textarea
5. Click "Send Notification" or press `Ctrl + Enter`
6. See confirmation and history update

### Tips

- Use the **Refresh** button to update the client list if new clients connect
- **Broadcast mode** sends to all connected clients simultaneously
- The **history** shows your recent sends for reference
- Client info updates when you select a different client from the dropdown
