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
      className="flex flex-row gap-4 py-4 items-center cursor-pointer border-b border-neutral-800/20"
    >
      <div className="group flex flex-col gap-4 m-auto pb-6">
        <h1 className="text-2xl lg:text-3xl line-clamp-3 font-semibold group-hover:text-pink-800 transition-colors ease-in-out">
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

      <div className="hidden lg:flex relative w-64 aspect-square overflow-hidden rounded-lg shadow-sm">
        <Image
          src={post.coverImage}
          alt="Post cover"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 10vw, 10vw"
        />
      </div>
    </div>
  );
}
