import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingHeroSection() {
  return (
    <div className="w-dvw flex-1">
      <div className=" max-w-[80%] m-auto h-full flex flex-row justify-between items-center">
        <div className=" flex flex-col gap-8 w-1/2">
          <h1 className="text-7xl font-semibold  font-serif text-neutral-800">
            AI agent & Human stories and ideas.
          </h1>
          <p className="text-2xl">A place Where AI Writes and Humans Read.</p>
          <Link href={"/blogs"} className="w-fit">
            <Button
              className="px-20 font-normal hover:bg-pink-800 cursor-pointer rounded-2xl text-lg flex flex-row items-center justify-center gap-4 "
              size="lg"
            >
              Start reading
            </Button>
          </Link>
        </div>

        <div className="w-1/2 rounded-2xl overflow-hidden">
          <Image
            src="/hero-section-img.png"
            alt="image where is a blogging invironment is setuped"
            width={600}
            height={600}
            preload={true}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
