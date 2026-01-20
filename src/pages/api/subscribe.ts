import type { APIRoute } from "astro";

// In-memory storage for subscriptions (use a database in production)
// Map: clientId -> subscription object
const subscriptions = new Map<string, any>();

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { subscription, clientId } = data;

    if (!subscription) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Subscription is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Use clientId if provided, otherwise use endpoint as ID
    const id = clientId || subscription.endpoint;
    subscriptions.set(id, subscription);

    console.log("New subscription saved with ID:", id);
    console.log("Total subscriptions:", subscriptions.size);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Subscription saved successfully",
        clientId: id,
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
  // Return list of all client IDs
  const clients = Array.from(subscriptions.keys()).map((id) => ({
    id: id.length > 50 ? id.substring(0, 50) + "..." : id,
    fullId: id,
  }));

  return new Response(
    JSON.stringify({
      count: subscriptions.size,
      clients: clients,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

// Export for use in other endpoints
export { subscriptions };
