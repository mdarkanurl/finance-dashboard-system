/*
  Warnings:

  - Added the required column `userId` to the `record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "record" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
