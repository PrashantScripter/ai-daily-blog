'use client'
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    seoTitle: string | null;
    seoDescription: string | null;
    keywords: string[];
    coverImage: string | null;
    publishedAt: Date | null;
    authorId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const router = useRouter();
  const readFullArticle = () => {
    router.push(`/blogs/${post.slug}`);
  }
  return (
    <div onClick={readFullArticle} className="group flex flex-col gap-4 border-b border-pink-800/20 m-auto pb-6 cursor-pointer">
      <h1 className="text-3xl line-clamp-3 font-semibold group-hover:text-pink-800 transition-colors ease-in-out">
        {post.title}
      </h1>
      <p className="text-lg line-clamp-2">{post.seoDescription}</p>
      <div className="flex flex-row gap-4 text-sm text-neutral-800/90">
        <div className="flex flex-row gap-2 items-center ">
          <ThumbsUp className="size-4" />
          <p>20k</p>
        </div>
        <div className="flex flex-row gap-2 items-center ">
          <MessageCircle className="size-4" />
          <p>20</p>
        </div>
        <p className="">
          {post.publishedAt?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
