-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "comments_postId_userId_idx" ON "comments"("postId", "userId");
