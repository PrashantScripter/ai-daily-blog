import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadImageBuffer } from "./cloudinary";
import { jsonrepair } from "jsonrepair";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. Research Phase
export async function performResearch(topic: string) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: `latest trending news and deep technical analysis in ${topic}`,
      search_depth: "advanced",
      include_answer: true,
      max_results: 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results
    .map((r: any) => `Source: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`)
    .join("\n\n");
}

// 2. Drafting Phase (Prompt Engineering)
export async function generateBlogPost(researchContext: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
    You are a Senior Tech Journalist and SEO Expert. 
    Using the provided research context below, write a comprehensive, long-form blog post (1500+ words).
    
    RESEARCH CONTEXT:
    ${researchContext}

    STRICT OUTPUT FORMAT (JSON ONLY):
    {
      "title": "Catchy, click-worthy H1 title",
      "slug": "url-friendly-kebab-case-slug",
      "content": "Full blog post in Markdown format. Use H2, H3, lists, and code blocks where necessary. Do NOT include the title in the body.",
      "excerpt": "A short 150-character summary for the blog card.",
      "seoTitle": "SEO optimized title (under 60 chars)",
      "seoDescription": "SEO meta description (under 160 chars)",
      "coverImage" : "A perfect detailed prompt to generate a perfect image for this blog (under 500 chars)"
      "keywords": ["keyword1", "keyword2", "keyword3"]
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
  const options = {
    method: "POST",
    headers: {
      "x-freepik-api-key": process.env.FREEPIK_API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      negative_prompt: "blurry, ugly, watermark",
      num_images: 1,
      image: {
        size: "square_1_1",
      },
      // Note: 'guidance_scale' and 'styling' are often the cause of 422 validation errors
      // on the cheapest models. Try removing them first to confirm.
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
