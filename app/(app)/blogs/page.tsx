"use client";

import BlogCard from "@/components/blog-page/BlogCard";

export default function Blogs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 pt-24 max-w-[80%] m-auto">
      <BlogCard />
    </div>
  );
}
