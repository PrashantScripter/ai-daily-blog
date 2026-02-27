"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/app/api/posts/[slug]/action";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Toggle } from "@/components/ui/toggle";
import { useRouter } from "next/navigation";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export function LikeButton({
  postId,
  initialLikes,
  initialLiked,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState({
    liked: initialLiked,
    likes: initialLikes,
  });
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const router = useRouter();

  const handleLike = async (pressed: boolean) => {
    if (!isSignedIn) {
      // Open Clerk sign-in modal
      clerk.openSignIn({
        redirectUrl: window.location.href,
      });
      return;
    }

    // Optimistic update
    setOptimisticState({
      liked: pressed,
      likes: pressed ? optimisticState.likes + 1 : optimisticState.likes - 1,
    });

    startTransition(async () => {
      const result = await toggleLike(postId);

      if (!result.success) {
        // Revert on error
        setOptimisticState({
          liked: initialLiked,
          likes: initialLikes,
        });

        // Show error (you can use a toast library here)
        alert(result.error);
      }
    });
  };

  return (
    <Toggle
      pressed={optimisticState.liked}
      onPressedChange={handleLike}
      disabled={isPending}
      className="group cursor-pointer flex flex-row gap-2 items-center"
    >
      <ThumbsUp className="size-6 group-data-[state=on]:fill-foreground transition-all" />
      <span className="">{optimisticState.likes}</span>
    </Toggle>
  );
}
