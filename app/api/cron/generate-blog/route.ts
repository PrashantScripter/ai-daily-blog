import { NextRequest, NextResponse } from "next/server";
import { performResearch, generateBlogPost } from "@/lib/agent";
import { prisma } from "@/lib/prisma"; // Assumes you have a singleton prisma client setup
import { revalidatePath } from "next/cache";

export const maxDuration = 60; // Set max execution time for Vercel (Pro plan allows more)

export async function GET(req: NextRequest) {
  // 1. Security Check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 2. Research
    console.log("Starting Research...");
    const researchData = await performResearch(
      "Artificial Intelligence and Web Development",
    );

    if (!researchData || researchData.length < 100) {
      console.warn("Insufficient research data found.");
      return NextResponse.json(
        { error: "Research failed to yield results" },
        { status: 500 },
      );
    }

    // 3. Draft Content
    console.log("Drafting Content...");
    const blogPostData = await generateBlogPost(researchData);

    // 4. Database Persistence
    console.log("Saving to NeonDB...");
    const savedPost = await prisma.post.create({
      data: {
        title: blogPostData.title,
        // Append timestamp to slug to guarantee uniqueness if titles repeat
        slug: `${blogPostData.slug}-${Date.now()}`,

        content: blogPostData.content,
        excerpt: blogPostData.excerpt,

        // MAPPING THE NEW FIELDS:
        seoTitle: blogPostData.seoTitle,
        seoDescription: blogPostData.seoDescription,
        keywords: blogPostData.keywords,
      },
    });

    // 5. Revalidate Cache
    revalidatePath("/"); // Update homepage
    revalidatePath("/blog"); // Update blog listing

    return NextResponse.json({ success: true, post: savedPost.id });
  } catch (error) {
    console.error("Agent Failure:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 },
    );
  }
}
