import Link from "next/link";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header() {
  return (
    <nav className="fixed w-full border-b border-neutral-800/20 bg-white z-50">
      <div className="flex flex-row justify-between items-center py-4 max-w-[80%] m-auto">
        <Link href="/blogs">
          <h1 className="text-3xl font-semibold text-pink-800">
            Agent Blogger
          </h1>
        </Link>
        <Input placeholder="Search" className="w-1/2" />
        <Link href={"/profile"}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}
