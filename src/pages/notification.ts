import type { APIRoute } from "astro";
import webpush from "web-push";

// Import subscriptions from the subscribe endpoint
import { subscriptions } from "./api/subscribe";

// Configure web-push with VAPID keys
const vapidPublicKey = import.meta.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = import.meta.env.VAPID_PRIVATE_KEY;
const vapidSubject = import.meta.env.VAPID_SUBJECT || "mailto:test@example.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export const GET: APIRoute = async ({ request, url }) => {
  // Get parameters from query string
  const message = url.searchParams.get("text") || "New notification!";
  const clientId = url.searchParams.get("id"); // Optional: specific client ID

  console.log("Webhook called with message:", message);
  console.log("Target clientId:", clientId || "ALL (broadcast)");
  console.log("Active subscriptions:", subscriptions.size);

  // Send push notifications to all subscribed clients OR specific client
  const notificationPayload = JSON.stringify({
    title: "Push Notification",
    message: message,
    timestamp: new Date().toISOString(),
  });

  const sendPromises: Promise<any>[] = [];
  let targetCount = 0;

  // If clientId specified, send only to that client
  if (clientId) {
    const subscription = subscriptions.get(clientId);
    if (subscription) {
      console.log("Sending push to specific client:", clientId);
      targetCount = 1;

      const promise = webpush
        .sendNotification(subscription, notificationPayload)
        .then(() => {
          console.log("Push sent successfully to:", clientId);
        })
        .catch((error) => {
          console.error("Error sending push to:", clientId, error);

          // Remove invalid subscriptions
          if (error.statusCode === 410) {
            console.log("Removing expired subscription:", clientId);
            subscriptions.delete(clientId);
          }
        });

      sendPromises.push(promise);
    } else {
      console.log("Client ID not found:", clientId);
    }
  } else {
    // Broadcast to all clients
    for (const [id, subscription] of subscriptions.entries()) {
      console.log("Sending push to:", id);
      targetCount++;

      const promise = webpush
        .sendNotification(subscription, notificationPayload)
        .then(() => {
          console.log("Push sent successfully to:", id);
        })
        .catch((error) => {
          console.error("Error sending push to:", id, error);

          // Remove invalid subscriptions
          if (error.statusCode === 410) {
            console.log("Removing expired subscription:", id);
            subscriptions.delete(id);
          }
        });

      sendPromises.push(promise);
    }
  }

  // Wait for all push notifications to be sent
  await Promise.allSettled(sendPromises);

  return new Response(
    JSON.stringify({
      success: true,
      message: message,
      timestamp: new Date().toISOString(),
      sentTo: targetCount,
      broadcast: !clientId,
      clientId: clientId || null,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};
