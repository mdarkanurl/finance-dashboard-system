-- CreateEnum
CREATE TYPE "Role" AS ENUM ('viewer', 'analyst', 'Admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_id_email_idx" ON "user"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_email_key" ON "user"("id", "email");
