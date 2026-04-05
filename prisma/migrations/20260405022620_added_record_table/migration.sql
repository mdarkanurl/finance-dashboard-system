-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('income', 'expense');

-- CreateTable
CREATE TABLE "record" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "RecordType" NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "record_id_idx" ON "record"("id");
