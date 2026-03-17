import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadImageBuffer } from "./cloudinary";
import { jsonrepair } from "jsonrepair";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. Research Phase
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

  // Optional but recommended: return the AI summary first

  return (
    data.results
      .map(
        (r: any) => `Source: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`,
      )
      .join("\n\n")
  );
}

// 2. Drafting Phase (Prompt Engineering)
export async function generateBlogPost(researchContext: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.75,
      maxOutputTokens: 12000,
    },
  });

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
  });

  const prompt = `
      You are a Senior Tech Journalist and Viral Content Strategist in ${today}.
      Write a long-form blog post (1600–2200 words) that feels human, opinionated, and highly shareable.

      RESEARCH CONTEXT:
      ${researchContext}

      Rules for maximum virality:
      - Raw, conversational tone like a smart, slightly pissed-off friend.
      - Strong emotional triggers (FOMO, anger, awe, relatability, controversy).
      - One bold contrarian opinion + one surprising prediction.
      - Use storytelling and concrete examples. Avoid repetition.
      - Markdown: H2/H3, numbered lists, blockquotes, code blocks if needed.
      - End with a strong CTA + open discussion question.
      - Never sound corporate or AI-generated.

      READ TIME CALCULATION:
      - Calculate "readTime" = Math.ceil(total words in "content" / 225)
      - Return as integer only.

      STRICT OUTPUT FORMAT — JSON ONLY (no extra text, no markdown fences):

      {
        "title": "Catchy, curiosity-gap H1 title",
        "slug": "url-friendly-kebab-case-slug",
        "content": "Full blog post in Markdown format. Do NOT repeat the title.",
        "excerpt": "150-character teaser for the blog card",
        "seoTitle": "SEO title under 60 chars",
        "seoDescription": "Meta description under 160 chars",
        "coverImage": "EXTREMELY detailed image generation prompt for a viral tech blog thumbnail (bold typography, cinematic lighting, futuristic/tech aesthetic, high contrast, text overlay ideas). Max 800 characters.",
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
        "readTime": <number>
      }
      `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Clean potential markdown code fences from JSON response
  const cleanJson = responseText.replace(/```json|```/g, "").trim();

  const resultJson = await JSON.parse(jsonrepair(cleanJson));
  const uploadedImageUrl = await generateImage(resultJson.coverImage);
  resultJson.coverImage = uploadedImageUrl;

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

    // Freepik's 'classic-fast' returns an array in 'data'
    // Each object has a 'base64' property
    const base64Image = result.data[0].base64;

    if (!base64Image) {
      throw new Error("No base64 data received from Freepik");
    }

    // Convert Base64 string to Buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Upload to Cloudinary using your existing function
    const imageUrl = await uploadImageBuffer(imageBuffer, {
      folder: "freepik-generations",
      tags: ["ai", "freepik"],
    });

    console.log("Uploaded successfully! URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Workflow failed:", error);
    throw error; // Rethrow so your UI can handle the error state
  }
}
