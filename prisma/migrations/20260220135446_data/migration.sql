/*
  Warnings:

  - Changed the type of `readTime` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "readTime",
ADD COLUMN     "readTime" INTEGER NOT NULL;
