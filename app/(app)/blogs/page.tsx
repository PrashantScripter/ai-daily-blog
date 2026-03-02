import BlogCard from "@/components/blog-page/BlogCard";
import { prisma } from "@/lib/prisma";


export const revalidate = 60;

export default async function Blogs() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      likes: true,
      comments: true,
    }
  });

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-indigo-400 dark:text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2"
            />
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
          No blogs yet
        </h2>
        <p className="max-w-md text-lg text-gray-500 dark:text-gray-400">
          We haven't published any posts yet. <br className="hidden sm:block" />
          Come back soon — something awesome is coming!
        </p>

        {/* Optional subtle hint */}
        <div className="mt-10 text-sm text-gray-400 dark:text-gray-500">
          Tip: The first blog is always the hardest to write ✨
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-10 pt-24 px-4 sm:px-0 w-full sm:max-w-[80%] m-auto">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
