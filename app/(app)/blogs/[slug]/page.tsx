import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { MessageCircle, ThumbsUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

const mockAiContent = `
We all know that OpenAI actually started the trend of AI tools after releasing ChatGPT. 

## The New Contenders
Here are the tools that are actually worth your time:

1. **Cursor**: An AI code editor.
2. **Perplexity**: For deep research.

### Why use them?
They offer features that standard LLMs don't. For example, look at this code snippet:

\`\`\`js
const ai = "Super Powerful";
console.log(ai);
\`\`\`

> "AI is not just a tool, it's a partner."
`;

interface AvatarProp {
  time?: string;
}

function AvatarWithName({ time }: AvatarProp) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {/* <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar> */}
      <SignedIn>
        <UserButton />
      </SignedIn>
      <div>
        <p className="text-neutral-800">Prshant Thakur</p>
        {time && <p className="text-xs">{time}</p>}
      </div>
    </div>
  );
}

export default function SelectedBlog() {
  return (
    <div className="flex flex-col gap-10 py-26 pb-20 max-w-[50%] m-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl/relaxed font-bold -tracking-normal">
          Forget ChatGPT & Gemini — Here Are New AI Tools That Will Blow Your
          Mind
        </h1>
        <p className="text-xl">
          Here, I’m going to talk about the new AI tools that are actually worth
          your time.
        </p>
        <div className="flex flex-row gap-6 items-center">
          <AvatarWithName />
          <p>7 min read</p>
          <p>23-01-26</p>
        </div>
        <div className="flex flex-row gap-4 py-4 border-y">
          <Toggle className="group cursor-pointer flex flex-row gap-2 items-center">
            <ThumbsUp className="size-6 group-data-[state=on]:fill-foreground transition-all" />
            <span className="">12k</span>
          </Toggle>

          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button
                className="cursor-pointer flex flex-row gap-2 items-center"
                variant={"ghost"}
              >
                <MessageCircle className="size-6 cursor-pointer" />
                <p>22</p>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
              <DrawerHeader className="border-b">
                <DrawerTitle className="text-2xl">
                  Comments {`(${10})`}
                </DrawerTitle>
                <div className="flex flex-col gap-4 mt-4">
                  <AvatarWithName />
                  <form className="flex flex-col gap-2">
                    <Textarea placeholder="Write your thoughts..." />
                    <div className="flex flex-row gap-4 items-center justify-end">
                      <DrawerClose asChild>
                        <Button
                          variant="outline"
                          className="cursor-pointer rounded-full"
                          size={"sm"}
                        >
                          Cancel
                        </Button>
                      </DrawerClose>
                      <Button
                        className="cursor-pointer rounded-full"
                        size={"sm"}
                        type="submit"
                      >
                        Respond
                      </Button>
                    </div>
                  </form>
                </div>
              </DrawerHeader>

              <div className="no-scrollbar overflow-y-auto p-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    className="flex flex-col gap-4 border-b py-4"
                    key={index}
                  >
                    <AvatarWithName time="1 day ago" />
                    <p className="text-md text-neutral-800">
                      What a great topic, i got inspired that i also can do
                      this.
                    </p>
                  </div>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div>
        <article className="prose prose-lg prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{mockAiContent}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
