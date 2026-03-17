import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { uploadImageBuffer } from "./cloudinary";
import { jsonrepair } from "jsonrepair";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. Research Phase (unchanged)
export async function performResearch() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const query = `must-know trending global news events innovations last 7 days as of ${today} in AI/tech, politics, economy, science, health, environment, education, business + India breakthroughs; include reddit viral, hacker news, product hunt, x controversies for students & professionals`;

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      include_answer: true,
      max_results: 10,
      include_images: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API Error: ${response.statusText}`);
  }

  const data = await response.json();

  return (
    (data.answer ? `SUMMARY: ${data.answer}\n\n` : "") +
    data.results
      .map(
        (r: any) => `Source: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`,
      )
      .join("\n\n")
  );
}

// NEW: Tavily Tool Helper
async function tavilyToolCall(
  searchQuery: string,
  numDays = 7,
): Promise<string> {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: `${searchQuery} last ${numDays} days as of ${today}`,
      include_answer: true,
      max_results: 5,
      include_images: false,
    }),
  });

  if (!response.ok)
    throw new Error(`Tavily tool error: ${response.statusText}`);

  const data = await response.json();
  return (
    (data.answer ? `SUMMARY: ${data.answer}\n\n` : "") +
    data.results
      .map(
        (r: any) => `Source: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`,
      )
      .join("\n\n")
  );
}

// 2. Drafting Phase (FIXED - now compiles perfectly)
export async function generateBlogPost(researchContext: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    tools: [
      {
        functionDeclarations: [
          {
            name: "tavily_search",
            description:
              "Search Tavily for ONE critical missing fact ONLY if the initial research context is insufficient. Use at most once.",
            parameters: {
              type: SchemaType.OBJECT, // ← This was the error (string "object" is invalid)
              properties: {
                query: {
                  type: SchemaType.STRING,
                  description:
                    "Precise search query for latest verified news/facts",
                },
                num_days: {
                  type: SchemaType.INTEGER,
                  description: "Days back (default 7)",
                },
              },
              required: ["query"],
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 12000,
    },
  });

  const chat = model.startChat();

  const fullPrompt = `
You are a battle-hardened senior tech journalist in 2026 — think Ben Thompson mixed with Casey Newton and a little spite. You’ve covered AI since GPT-3 and you hate hype.

Write a long-form blog post (exactly 1600–2200 words) that feels 100% human: raw, conversational, sarcastic, like you’re venting to a smart friend over drinks at 1 a.m.

RESEARCH CONTEXT — THIS IS YOUR PRIMARY SOURCE OF TRUTH:
${researchContext}

TRUTH & TRUST RULES (NON-NEGOTIABLE):
- Every claim must be grounded in the RESEARCH CONTEXT above OR in fresh data you pull via the tavily_search tool.
- You may call the tool ONLY if the initial context is missing a critical, verifiable fact you need for a strong claim. Use it at most ONCE.
- After getting the tool result, incorporate ONLY the new verified facts. Cite naturally. Never invent, extrapolate, or add “probably/likely/experts say”.
- This blog must remain 100% trustable — every reader must be able to verify every claim.

TOOL AVAILABLE:
You have access to "tavily_search". Call it only when absolutely necessary.

HUMAN-WRITING RULES (follow religiously):
- Tone: raw, slightly pissed-off, funny. Use contractions, occasional “fuck”, “this shit”, “honestly”, “look”, “anyway”. Mix one-sentence zingers with longer rants.
- Vary rhythm wildly. Throw in random asides and one tiny personal tangent.
- One big contrarian hot take + one “mark my words” prediction (only if grounded).
- Never use LLM red flags.
- End with strong CTA + discussion question.

When you have everything you need and are ready to write the final blog, output ONLY the JSON object below. Nothing else.

READ TIME: Calculate "readTime" = Math.ceil(total words in content / 225)

STRICT JSON ONLY:

{
  "title": "...",
  "slug": "...",
  "content": "Full Markdown blog post...",
  "excerpt": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "coverImage": "EXTREMELY detailed image prompt...",
  "keywords": ["...", "..."],
  "readTime": <number>
}
`;

  let result = await chat.sendMessage(fullPrompt);
  let finalText = "";

  // Tool-calling loop
  while (true) {
    const functionCalls = result.response.functionCalls?.() || [];

    if (functionCalls.length > 0) {
      const toolResponses: any[] = [];

      for (const call of functionCalls) {
        if (call.name === "tavily_search") {
          const args = call.args as { query: string; num_days?: number };
          const extraInfo = await tavilyToolCall(
            args.query,
            args.num_days || 7,
          );

          toolResponses.push({
            functionResponse: {
              name: call.name,
              response: { result: extraInfo },
            },
          });
        }
      }

      result = await chat.sendMessage(toolResponses);
    } else {
      finalText = result.response.text();
      break;
    }
  }

  // Clean JSON
  const cleanJson = finalText.replace(/```json|```/g, "").trim();
  const resultJson = await JSON.parse(jsonrepair(cleanJson));

  // Generate & upload cover image
  const uploadedImageUrl = await generateImage(resultJson.coverImage);
  resultJson.coverImage = uploadedImageUrl;

  // Safety strip
  resultJson.content = resultJson.content
    .replace(/✨ AI Generated|AI Generated/gi, "")
    .trim();

  return resultJson;
}

export async function generateImage(prompt: string): Promise<string> {
  const enhancedPrompt = `${prompt}. Style: bold viral tech blog thumbnail, dramatic lighting, high contrast, modern sans-serif text overlay, futuristic or cinematic vibe, 1:1 square, professional, no blurry, no text errors`;

  const options = {
    method: "POST",
    headers: {
      "x-freepik-api-key": process.env.FREEPIK_API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      negative_prompt:
        "blurry, low quality, watermark, text errors, deformed, ugly, cartoonish",
      num_images: 1,
      image: { size: "square_1_1" },
      filter_nsfw: true,
    }),
  };

  try {
    const response = await fetch(
      "https://api.freepik.com/v1/ai/text-to-image",
      options,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Freepik API Error: ${errorData.message || response.statusText}`,
      );
    }

    const result = await response.json();

    const base64Image = result.data[0].base64;

    if (!base64Image) {
      throw new Error("No base64 data received from Freepik");
    }

    const imageBuffer = Buffer.from(base64Image, "base64");

    const imageUrl = await uploadImageBuffer(imageBuffer, {
      folder: "freepik-generations",
      tags: ["ai", "freepik"],
    });

    console.log("Uploaded successfully! URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Workflow failed:", error);
    throw error;
  }
}
