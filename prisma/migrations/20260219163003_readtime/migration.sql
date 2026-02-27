/*
  Warnings:

  - Added the required column `readTime` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "readTime" TEXT NOT NULL;
