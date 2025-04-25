/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_reviewId_fkey";

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "reviewId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Rating_reviewId_key" ON "Rating"("reviewId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
