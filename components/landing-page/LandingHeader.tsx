"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Github } from "lucide-react";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <nav className="w-dvw border-b border-neutral-800/20 z-50">
      <div className="flex flex-row justify-between items-center py-4 px-4 xl:px-0 w-dvw lg:max-w-[80%] m-auto">
        <div>
          <Link href="/">
            <h1 className="text-xl sm:text-2xl font-semibold text-pink-800">
              Agent Blogger
            </h1>
          </Link>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Link href="https://github.com/PrashantScripter/ai-daily-blog">
            <Github className="hover:text-pink-800" size={20} />
          </Link>
          <Link href={"/blogs"} className="cursor-pointer hidden sm:flex">
            Start reading
          </Link>
          <Button
            asChild
            size={"sm"}
            className="cursor-pointer rounded-full px-4 bg-pink-800 hover:bg-neutral-800 transition-all ease-in-out"
          >
            <SignInButton />
          </Button>
        </div>
      </div>
    </nav>
  );
}
