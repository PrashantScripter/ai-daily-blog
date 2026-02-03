import { GoogleGenerativeAI } from "@google/generative-ai";

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
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  // console.log(responseText);

  // Clean potential markdown code fences from JSON response
  const cleanJson = responseText.replace(/```json|```/g, "").trim();

  return JSON.parse(cleanJson);
}
