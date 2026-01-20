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
  // Get the 'idk' parameter from query string
  const message = url.searchParams.get("idk") || "New notification!";

  console.log("Webhook called with message:", message);
  console.log("Active subscriptions:", subscriptions.size);

  // Send push notifications to all subscribed clients
  const notificationPayload = JSON.stringify({
    title: "Push Notification",
    message: message,
    timestamp: new Date().toISOString(),
  });

  const sendPromises: Promise<any>[] = [];

  for (const [endpoint, subscription] of subscriptions.entries()) {
    console.log("Sending push to:", endpoint);

    const promise = webpush
      .sendNotification(subscription, notificationPayload)
      .then(() => {
        console.log("Push sent successfully to:", endpoint);
      })
      .catch((error) => {
        console.error("Error sending push to:", endpoint, error);

        // Remove invalid subscriptions
        if (error.statusCode === 410) {
          console.log("Removing expired subscription:", endpoint);
          subscriptions.delete(endpoint);
        }
      });

    sendPromises.push(promise);
  }

  // Wait for all push notifications to be sent
  await Promise.allSettled(sendPromises);

  return new Response(
    JSON.stringify({
      success: true,
      message: message,
      timestamp: new Date().toISOString(),
      sentTo: subscriptions.size,
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
