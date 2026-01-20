// Service Worker for Push Notifications
self.addEventListener("push", function (event) {
  console.log("Push received:", event);

  let notificationData = {
    title: "Push Notification",
    body: "You have a new notification",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "push-notification",
    data: {
      timestamp: new Date().toISOString(),
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || "Push Notification",
        body: data.message || data.body || "You have a new notification",
        icon: data.icon || "/favicon.svg",
        badge: "/favicon.svg",
        tag: "push-notification",
        data: data,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        tag: notificationData.tag,
        data: notificationData.data,
        requireInteraction: false,
        vibrate: [200, 100, 200],
      }),
      // Send message to all clients to update the list
      self.clients
        .matchAll({ includeUncontrolled: true, type: "window" })
        .then((clients) => {
          console.log("Found clients:", clients.length);
          clients.forEach((client) => {
            console.log("Sending message to client:", client.id);
            client.postMessage({
              type: "PUSH_RECEIVED",
              notification: notificationData,
            });
          });
        }),
    ]),
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked:", event);
  event.notification.close();

  event.waitUntil(clients.openWindow("/"));
});

self.addEventListener("install", function (event) {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});
