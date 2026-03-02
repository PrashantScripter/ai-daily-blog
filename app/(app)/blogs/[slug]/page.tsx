import { CommentSection } from "@/components/blog-page/comment-form";
import { LikeButton } from "@/components/blog-page/Like-button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

// interface AvatarProp {
//   user?: any;
//   time?: string;
// }

// export function AvatarWithName({ user, time }: AvatarProp) {
//   if (!user) return null;

//   return (
//     <div className="flex flex-row gap-2 items-center">
//       {user.image ? (
//         <Image
//           src={user.image}
//           alt={user.username || "User"}
//           width={32}
//           height={32}
//           className="rounded-full"
//         />
//       ) : (
//         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//           <span className="text-gray-600 text-sm">
//             {user.username?.charAt(0) || "U"}
//           </span>
//         </div>
//       )}
//       <div>
//         <p className="text-neutral-800 font-medium">
//           {user.username || "Anonymous"}
//         </p>
//         {time && <p className="text-xs text-gray-500">{time}</p>}
//       </div>
//     </div>
//   );
// }

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: slug },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
        likes: true,
        author: true,
      },
    });

    return post;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch post");
  }
}

export default async function SelectedBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();

  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="flex flex-col gap-10 py-26 pb-20 max-w-[50%] m-auto">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
      </div>
    );
  }

  const initialComments = await prisma.comment.findMany({
    where: { postId: post.id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalComments = await prisma.comment.count({
    where: { postId: post.id },
  });

  // Check if current user has liked this post
  const userLiked = user
    ? await prisma.like.findUnique({
        where: {
          userId_postId: {
            postId: post.id,
            userId: user.id,
          },
        },
      })
    : false;

  return (
    <div className="flex flex-col gap-10 py-26 pb-20 px-4 lg:px-0 w-dvw lg:max-w-[50%] m-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl lg:text-4xl/relaxed font-semibold lg:font-bold -tracking-normal">
          {post?.title}
        </h1>
        <p className="text-lg lg:text-xl">{post?.seoDescription}</p>
        <div className="flex flex-row gap-6 items-center">
          <div className="flex flex-row gap-2 items-center">
            {post?.author?.image ? (
              <Image
                src={post.author.image}
                width={40}
                height={40}
                className="rounded-full"
                alt="author profile picture"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600">
                  {post?.author?.username?.charAt(0) || "A"}
                </span>
              </div>
            )}
            <p>{post?.author?.username}</p>
          </div>
          <p>{`${post?.readTime} min`}</p>
          <p>
            {post?.publishedAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-row gap-4 py-4 border-y">
          <LikeButton
            postId={post.id}
            initialLikes={post.likeCount}
            initialLiked={!!userLiked}
          />
          <CommentSection
            postId={post.id}
            initialComments={initialComments}
            totalComments={totalComments}
            currentUser={user}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-video overflow-hidden border border-border">
            <Image
              src={post?.coverImage as string}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              alt={post?.title || "AI generated cover image"}
              priority={true}
            />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-1">
            ✨ AI Generated
          </p>
        </div>
        <article className="prose prose-lg prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{post?.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
