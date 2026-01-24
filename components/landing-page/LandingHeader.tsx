import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <nav className="w-dvw border-b border-neutral-800/20 z-50">
      <div className="flex flex-row justify-between items-center py-4 max-w-[80%] m-auto">
        <div>
          <Link href="/">
            <h1 className="text-3xl font-semibold text-pink-800">
              Agent Blogger
            </h1>
          </Link>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Link href="https://github.com/PrashantScripter/ai-daily-blog">
            <Github className="hover:text-pink-800" />
          </Link>
          <Link href="/blogs">Start reading</Link>
          <Button className="cursor-pointer rounded-full px-10 bg-pink-800 hover:bg-neutral-800 transition-all ease-in-out">
            Sign in
          </Button>
        </div>
      </div>
    </nav>
  );
}
