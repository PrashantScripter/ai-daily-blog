// lib/services/comment.service.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CommentWithAuthor } from "@/types/type";



export class CommentService {
  static async create(
    postId: string,
    content: string,
  ): Promise<{
    success: boolean;
    comment?: CommentWithAuthor;
    error?: string;
    redirectToSignIn?: boolean;
  }> {
    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        return {
          success: false,
          error: "Please sign in to comment",
          redirectToSignIn: true,
        };
      }

      if (!content.trim()) {
        return { success: false, error: "Comment cannot be empty" };
      }

      const result = await prisma.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            comment: content.trim(),
            postId,
            userId: user.id,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        });

        await tx.post.update({
          where: { id: postId },
          data: { commentCount: { increment: 1 } },
        });

        return comment;
      });

      return {
        success: true,
        comment: result,
      };
    } catch (error) {
      console.error("Comment service error:", error);
      return { success: false, error: "Failed to post comment" };
    }
  }

  static async getForPost(
    postId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    comments: CommentWithAuthor[];
    hasMore: boolean;
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
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
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { postId } }),
    ]);

    return {
      comments,
      hasMore: skip + comments.length < total,
      total,
    };
  }
}
