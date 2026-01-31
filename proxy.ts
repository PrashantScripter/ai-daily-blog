import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/blogs(.*)", "/profile(.*)"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { isAuthenticated, userId } = await auth();

  // 1. Get the current path
  const { pathname } = request.nextUrl;
  
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/blogs", request.url));
  }

  if (!isAuthenticated && isProtectedRoute(request) && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
