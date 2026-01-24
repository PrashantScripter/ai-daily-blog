import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          <div className="flex flex-row gap-2 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p>Prshant Thakur</p>
          </div>
          <p>7 min read</p>
          <p>23-01-26</p>
        </div>
        <div className="flex flex-row gap-4 py-4 border-y">
          <div className="flex flex-row gap-2 items-center">
            <ThumbsUp className="4 cursor-pointer" />
            <p>12k</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <MessageCircle className="cursor-pointer" />
            <p>22</p>
          </div>
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
