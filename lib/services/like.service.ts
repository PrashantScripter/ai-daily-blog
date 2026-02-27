// lib/services/like.service.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export class LikeService {
  static async toggleLike(postId: string) {
    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        return {
          success: false,
          error: "Please sign in to like posts",
          redirectToSignIn: true,
        };
      }

      // Check if like exists
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            postId,
            userId: user.id,
          },
        },
      });

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        if (existingLike) {
          // Unlike
          await tx.like.delete({
            where: {
              userId_postId: {
                postId,
                userId: user.id,
              },
            },
          });

          await tx.post.update({
            where: { id: postId },
            data: { likeCount: { decrement: 1 } },
          });

          return { liked: false };
        } else {
          // Like
          await tx.like.create({
            data: {
              postId,
              userId: user.id,
            },
          });

          await tx.post.update({
            where: { id: postId },
            data: { likeCount: { increment: 1 } },
          });

          return { liked: true };
        }
      });

      // Get updated like count
      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { likeCount: true },
      });

      return {
        success: true,
        liked: result.liked,
        likeCount: updatedPost?.likeCount || 0,
      };
    } catch (error) {
      console.error("Like service error:", error);
      return { success: false, error: "Failed to process like" };
    }
  }
}
