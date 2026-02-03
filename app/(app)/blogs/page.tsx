import BlogCard from "@/components/blog-page/BlogCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function Blogs() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 pt-24 max-w-[80%] m-auto">
      {
        posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))
      }
    </div>
  );
}
