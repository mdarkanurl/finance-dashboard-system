/*
  Warnings:

  - You are about to drop the column `userId` on the `record` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_userId_fkey";

-- AlterTable
ALTER TABLE "record" DROP COLUMN "userId",
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
