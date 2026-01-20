import type { APIRoute } from "astro";

// In-memory storage for subscriptions (use a database in production)
// Map: clientId -> { subscription, connectedAt, lastSeen, metadata }
const subscriptions = new Map<string, any>();

// Maintain a list of connected clients with metadata
const connectedClients = new Map<
  string,
  {
    clientId: string;
    subscription: any;
    connectedAt: Date;
    lastSeen: Date;
    userAgent?: string;
  }
>();

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

    // Update connected clients list
    const existingClient = connectedClients.get(id);
    const now = new Date();

    connectedClients.set(id, {
      clientId: id,
      subscription: subscription,
      connectedAt: existingClient?.connectedAt || now,
      lastSeen: now,
      userAgent: request.headers.get("user-agent") || undefined,
    });

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
  // Return list of all connected clients with metadata
  const clients = Array.from(connectedClients.values()).map((client) => ({
    id:
      client.clientId.length > 50
        ? client.clientId.substring(0, 50) + "..."
        : client.clientId,
    fullId: client.clientId,
    connectedAt: client.connectedAt.toISOString(),
    lastSeen: client.lastSeen.toISOString(),
    userAgent: client.userAgent,
  }));

  return new Response(
    JSON.stringify({
      count: clients.length,
      clients: clients,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

// Export for use in other endpoints
export { subscriptions, connectedClients };
