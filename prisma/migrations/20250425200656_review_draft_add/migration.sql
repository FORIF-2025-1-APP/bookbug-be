-- CreateTable
CREATE TABLE "ReviewDraft" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReviewDraftToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReviewDraftToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ReviewDraftToTag_B_index" ON "_ReviewDraftToTag"("B");

-- AddForeignKey
ALTER TABLE "ReviewDraft" ADD CONSTRAINT "ReviewDraft_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewDraft" ADD CONSTRAINT "ReviewDraft_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewDraftToTag" ADD CONSTRAINT "_ReviewDraftToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ReviewDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewDraftToTag" ADD CONSTRAINT "_ReviewDraftToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
