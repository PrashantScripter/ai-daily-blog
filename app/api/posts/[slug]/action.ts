"use server";

import { revalidatePath } from "next/cache";
import { LikeService } from "@/lib/services/like.service";
import { CommentService } from "@/lib/services/comment.service";

export async function toggleLike(postId: string) {
  const result = await LikeService.toggleLike(postId);

  if (result.success) {
    revalidatePath(`/posts/${postId}`);
  }

  return result;
}

export async function addComment(formData: FormData) {
  const postId = formData.get("postId") as string;
  const content = formData.get("content") as string;

  const result = await CommentService.create(postId, content);

  if (result.success) {
    revalidatePath(`/posts/${postId}`);
  }

  return result;
}

export async function loadMoreComments(postId: string, page: number) {
  // "use server";
  return CommentService.getForPost(postId, page);
}
