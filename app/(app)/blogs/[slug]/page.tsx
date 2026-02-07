import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { prisma } from "@/lib/prisma";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

const mockAiContent = `
As we navigate the final quarters of 2026, the artificial intelligence landscape has shifted from the era of 'generative chatter' to the era of 'agentic action.' The transition has not been seamless. While 2025 was defined by the release of massive large language models (LLMs), 2026 is being defined by orchestration: the ability of AI to step out of the chat box and into our browsers, our codebases, and our corporate infrastructures. \n\nFrom OpenAI’s launch of the Atlas browser to the unsettling 'structural' security risks of prompt injection, the tech world is grappling with a paradox: AI is more capable than ever, yet the market remains more skeptical than it has been in years. This deep dive explores the state of AI in 2026, the technical breakthroughs in agentic parsing, and the financial volatility that threatens the sector’s momentum.\n\n## The Great Browser War: OpenAI Atlas vs. Google Chrome\n\nIn October 2025, the tech world witnessed a tectonic shift. OpenAI officially moved from being a software provider to a platform provider with the launch of **Atlas**, an AI-native web browser. Unlike traditional browsers that merely render HTML, Atlas is built from the ground up on a new iteration of OpenAI’s core model, designed specifically for autonomous navigation.\n\nAtlas isn’t just a tool for viewing the web; it is a tool for *operating* the web. It integrates a state-of-the-art AI assistant capable of:\n*   **Multi-step Research:** Navigating multiple tabs, cross-referencing sources, and summarizing complex information into actionable briefs.\n*   **Online Automation:** Performing tasks like booking travel, managing SaaS dashboards, and conducting document audits without human intervention.\n\nGoogle has not sat idly by. The tech giant responded by deepening Gemini’s integration within Chrome, adding 'agentic' features that allow for autonomous task execution. This competition represents a fundamental pivot in SEO and web discovery. We are moving away from a 'search-and-click' economy toward a 'task-and-verify' model, where the browser acts as a proxy for the user.\n\n## The Architecture of Agency: Agentic Parsing and Multi-Agent Orchestration\n\nOne of the most significant technical breakthroughs of 2026 is the transition from monolithic document processing to **Agentic Parsing**. As Brian Raymond, CEO of Unstructured, noted, the industry is moving toward a 'flexible reconstruction layer.' \n\nTraditionally, AI struggled with unstructured data in PDFs and complex documents. In 2026, we see a team-based approach to data. Instead of one model reading a file, a 'team' of domain-expert AI agents scans a corpus, building deep semantic profiles and indexing data across multidimensional graphs. This allows for search capabilities that operate across intent, structure, and metadata simultaneously.\n\n### The Rise of the 'Super Agent'\n\nWe are also seeing the emergence of **cooperative model routing**. In this architecture, smaller, highly efficient models handle routine tasks and 'delegate' to massive, high-compute models (like GPT-5 or Claude 4) only when necessary. This 'agent control plane' allows users to kick off complex workflows from a single dashboard—orchestrating agents across their browser, code editor, and inbox.\n\nAs Kevin Chung of Writer suggests, the 'front door to the super agent' is the new prize. Whoever controls the interface where these agents are orchestrated will control the market, effectively making every user an 'AI composer' rather than just a prompter.\n\n## The Security Crisis: The 'Unpatchable' Prompt Injection\n\nWith great autonomy comes great vulnerability. In early 2026, OpenAI officially acknowledged a sobering reality: **indirect prompt injection** is a structural risk that cannot be fully patched. \n\nAs AI agents like those in the Atlas browser gain the power to scan live web content and private documents, they become susceptible to hidden instructions. A malicious actor could hide 'invisible' text on a webpage that, when scanned by an AI agent, instructs that agent to exfiltrate user data or perform unauthorized transactions. \n\nTo combat this, the industry is seeing a rise in 'AI-on-AI' warfare:\n1.  **Automated Attacker Bots:** OpenAI and others are deploying bots specifically designed to proactively find weaknesses in their own agentic loops.\n2.  **Human-in-the-Loop Mandates:** There is a growing push for strict human oversight, especially for agents granted access to financial or sensitive corporate data.\n3.  **Data Sandboxing:** Limiting the scope of what an autonomous agent can 'see' at any given time to prevent cross-contamination of instructions.\n\n## Market Volatility: The $50 Billion Gamble vs. The AI Bubble\n\nDespite the technical brilliance of these systems, the financial markets are nervous. On December 17, 2025, tech stocks tumbled as investor anxiety regarding an 'AI bubble' reached a fever pitch. The Dow Jones and S&P 500 saw significant declines as the massive capital expenditures required for AI infrastructure—running into the hundreds of billions—have yet to show a proportional impact on corporate earnings.\n\nYet, the giants remain undeterred. Reports indicate that **Amazon is in talks to invest $50 billion in OpenAI**, while Nvidia’s CEO has pushed back against claims that their massive OpenAI investments have stalled. We are seeing a divergence: retail investors and broader market indices are showing 'AI fatigue,' while the largest tech conglomerates are doubling down, fearing that missing the 'Agentic Era' would be a fatal strategic error.\n\n### Geopolitics and Monetization Struggles\n\nMonetization remains a thorny issue. WhatsApp has recently begun charging AI chatbots to operate in Italy, and Apple CEO Tim Cook has faced criticism for a perceived lack of a clear AI monetization strategy. \n\nOn the geopolitical front, the race to lure AI workloads has reached a new intensity. India has offered a zero-tax incentive through 2047 to attract global AI data centers, while Elon Musk is reportedly discussing a merger between SpaceX, Tesla, and xAI to create a vertically integrated AI powerhouse.\n\n## AI in Software Development: DevOps and Beyond\n\nFor the developer community, 2026 has been a year of professional transformation. According to BLS data, AI/ML engineers are now earning 10% more than traditional developers. The integration of AI into **DevOps and CI/CD pipelines** has moved beyond simple code completion.\n\nToday’s autonomous coding assistants are capable of:\n*   **Infrastructure Manipulation:** Writing and deploying Terraform or Kubernetes configurations based on high-level intent.\n*   **Intelligent Monitoring:** Predicting system failures before they occur and suggesting 'self-healing' patches.\n*   **Quantum and Blockchain Integration:** We are seeing the first deep-machine applications that combine AI with quantum computing for optimization and blockchain for verifiable data lineage.\n\nHowever, even the legal system is feeling the friction. The Alaska Court System recently limited the use of AI chatbots after 'technical difficulties,' highlighting that in high-stakes environments, the technology still lacks the necessary reliability for autonomous deployment.\n\n## Conclusion: The Road to 2027\n\nAs we look toward the end of 2026, the 'AI hype' has been replaced by a gritty, technical reality. We have the tools to build agents that can manage our lives and our businesses, but we are still discovering the costs—both in terms of security and capital. \n\nThe 'Super Agent' is coming, and it will likely live in your browser. But whether it will be the productivity savior promised by OpenAI and Google, or a security nightmare that keeps CISOs up at night, remains to be seen. In the current market, the winners will not be those who build the biggest models, but those who master the **orchestration** of those models into a secure, profitable, and agentic ecosystem.
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

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: slug },
    });

    return post;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch post");
  }
}

export default async function SelectedBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = await getPost(slug);
  return (
    <div className="flex flex-col gap-10 py-26 pb-20 max-w-[50%] m-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl/relaxed font-bold -tracking-normal">
          {post?.title}
        </h1>
        <p className="text-xl">{post?.seoDescription}</p>
        <div className="flex flex-row gap-6 items-center">
          <AvatarWithName />
          <p>7 min read</p>
          <p>
            {post?.publishedAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-video overflow-hidden border border-border">
            <Image
              src={post?.coverImage as string}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              alt={post?.title || "AI generated cover image"}
              priority={true}
            />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-1">
            ✨ AI Generated
          </p>
        </div>
        <article className="prose prose-lg prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{post?.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
