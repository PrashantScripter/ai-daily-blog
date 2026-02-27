"use client";

import { useState, useRef } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { AvatarWithName } from "./AvatarWithName";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { addComment, loadMoreComments } from "@/app/api/posts/[slug]/action";
import { CommentWithAuthor } from "@/types/type";

interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithAuthor[];
  totalComments: number;
  currentUser: any;
}

export function CommentSection({
  postId,
  initialComments,
  totalComments,
  currentUser,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialComments.length < totalComments,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  const handleAddComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSignedIn) {
      clerk.openSignIn({ redirectUrl: window.location.href });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.append("postId", postId);

    try {
      const result = await addComment(formData);

      if (result.success && result.comment) {
        setComments((prev) => [result.comment!, ...prev]);
        formRef.current?.reset();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await loadMoreComments(postId, nextPage);

      setComments((prev) => [...prev, ...result.comments]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          className="cursor-pointer flex flex-row gap-2 items-center"
          variant={"ghost"}
        >
          <MessageCircle className="size-6 cursor-pointer" />
          <p>{totalComments}</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-2xl">
            Comments ({comments.length})
          </DrawerTitle>
          <div className="flex flex-col gap-4 mt-4">
            <AvatarWithName user={currentUser} />
            <form
              ref={formRef}
              onSubmit={handleAddComment}
              className="flex flex-col gap-2"
            >
              <Textarea
                name="content"
                placeholder="Write your thoughts..."
                required
                disabled={isSubmitting}
              />
              <div className="flex flex-row gap-4 items-center justify-end">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer rounded-full"
                    size={"sm"}
                    type="button"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  className="cursor-pointer rounded-full"
                  size={"sm"}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </div>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto p-4">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                className="flex flex-col gap-4 border-b py-4"
                key={comment.id}
              >
                <AvatarWithName
                  user={comment.user}
                  time={new Date(comment.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                />
                <p className="text-md text-neutral-800">{comment.comment}</p>
              </div>
            ))
          )}

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? "Loading..." : "Load more comments"}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
