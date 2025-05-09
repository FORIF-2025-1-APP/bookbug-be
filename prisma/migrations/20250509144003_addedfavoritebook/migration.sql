-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteBookId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteBookId_fkey" FOREIGN KEY ("favoriteBookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
