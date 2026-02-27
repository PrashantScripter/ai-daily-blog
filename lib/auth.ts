// lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Get or create user in your database
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // If user doesn't exist in DB yet (webhook might be delayed), create them
  if (!user) {
    const clerkUser = await currentUser();
    if (clerkUser) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          username:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            "Anonymous",
          image: clerkUser.imageUrl,
        },
      });
    }
  }

  return user;
}

// For server components that need the raw Clerk user
export { auth, currentUser } from "@clerk/nextjs/server";
