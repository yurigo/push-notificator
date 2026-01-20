import type { APIRoute } from "astro";

// In-memory storage for subscriptions (use a database in production)
const subscriptions = new Map<string, any>();

export const POST: APIRoute = async ({ request }) => {
  try {
    const subscription = await request.json();

    // Store subscription with a unique identifier
    const endpoint = subscription.endpoint;
    subscriptions.set(endpoint, subscription);

    console.log("New subscription saved:", endpoint);
    console.log("Total subscriptions:", subscriptions.size);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Subscription saved successfully",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error saving subscription:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to save subscription",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      count: subscriptions.size,
      subscriptions: Array.from(subscriptions.keys()),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

// Export for use in other endpoints
export { subscriptions };
