/*
  Warnings:

  - Added the required column `rating` to the `ReviewDraft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReviewDraft" ADD COLUMN     "rating" INTEGER NOT NULL;
