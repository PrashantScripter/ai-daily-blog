"use client"

import Link from "next/link";
import { Input } from "../ui/input";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isBlogsRoute = pathname === "/blogs";

  return (
    <nav className="fixed w-full border-b border-neutral-800/20 bg-white z-50">
      <div className="flex flex-row justify-between items-center py-4 px-4 sm:px-0 w-full sm:max-w-[80%] m-auto">
        <Link href="/blogs">
          <h1 className="text-xl sm:text-2xl font-semibold text-pink-800">
            Agent Blogger
          </h1>
        </Link>
        {isBlogsRoute && (
          <Input placeholder="Search" className="hidden sm:flex w-1/2" />
        )}
        <SignedOut>
          <div className="flex flex-row gap-4">
            <Button
              asChild
              className="cursor-pointer rounded-full px-4"
              variant={"secondary"}
              size={"sm"}
            >
              <SignInButton />
            </Button>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
