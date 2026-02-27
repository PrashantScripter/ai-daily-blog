"use client";
import { MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlogCardProps } from "@/types/type";

export default function BlogCard({ post }: BlogCardProps) {
  const router = useRouter();
  const readFullArticle = () => {
    router.push(`/blogs/${post.slug}`);
  };
  return (
    <div
      onClick={readFullArticle}
      className="flex flex-row gap-4 py-4 items-center cursor-pointer border-b border-pink-800/20"
    >
      <div className="group flex flex-col gap-4  m-auto pb-6">
        <h1 className="text-3xl line-clamp-3 font-semibold group-hover:text-pink-800 transition-colors ease-in-out">
          {post.title}
        </h1>
        <p className="text-lg line-clamp-2">{post.seoDescription}</p>
        <div className="flex flex-row gap-4 text-sm text-neutral-800/90">
          <div className="flex flex-row gap-2 items-center ">
            <ThumbsUp className="size-4" />
            <p>{post?.likes.length}</p>
          </div>
          <div className="flex flex-row gap-2 items-center ">
            <MessageCircle className="size-4" />
            <p>{post?.comments.length}</p>
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

      <div className="relative w-64 h-full overflow-hidden rounded">
        <Image
          src={`${post.coverImage}`}
          fill
          className="object-cover"
          alt="Post related image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
