import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env",
    );
  }

  // 1. Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // 2. Get raw body as text (REQUIRED for Svix verification accuracy)
  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // 3. Verify signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // 4. Handle sync logic
  const eventType = evt.type;

  // if (eventType === "user.created" || eventType === "user.updated") {
  //   const { id, email_addresses, first_name, last_name, image_url } = evt.data;

  //   // Safety: Extract primary email and handle empty cases
  //   const primaryEmail =
  //     email_addresses && email_addresses.length > 0
  //       ? email_addresses[0].email_address
  //       : null;

  //   if (!primaryEmail) {
  //     return new Response("Error: No email address provided", { status: 400 });
  //   }

  //   // Combine names safely
  //   const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "User";

  //   try {
  //     await prisma.user.upsert({
  //       where: { clerkId: id },
  //       create: {
  //         clerkId: id,
  //         email: primaryEmail,
  //         username: fullName,
  //         image: image_url || "",
  //       },
  //       update: {
  //         email: primaryEmail,
  //         username: fullName,
  //         image: image_url || "",
  //       },
  //     });
  //   } catch (dbError) {
  //     console.error("Database sync error:", dbError);
  //     return new Response("Error: Database sync failed", { status: 500 });
  //   }
  // }


  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // CLERK PAYLOAD FIX:
    // Access the first element of the array, then the email_address string
    const primaryEmail =
      email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : null;

    if (!primaryEmail) {
      console.log("Payload received:", JSON.stringify(evt.data, null, 2));
      return new Response("Error: No email address provided in Clerk payload", {
        status: 400,
      });
    }

    // Combine names safely
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "User";

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: primaryEmail,
          username: fullName,
          image: image_url || "",
        },
        update: {
          email: primaryEmail,
          username: fullName,
          image: image_url || "",
        },
      });
      console.log(`User ${id} synced successfully`);
    } catch (dbError) {
      console.error("Database sync error:", dbError);
      return new Response("Error: Database sync failed", { status: 500 });
    }
  }


  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
