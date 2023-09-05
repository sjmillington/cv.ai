/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hobbies" TEXT[],
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "WorkEntry" (
    "id" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "start" TEXT,
    "end" TEXT,
    "prompt" TEXT NOT NULL,
    "result" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WorkEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" TEXT NOT NULL,
    "course" TEXT,
    "institute" TEXT,
    "start" TEXT,
    "end" TEXT,
    "prompt" TEXT NOT NULL,
    "result" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkEntry" ADD CONSTRAINT "WorkEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
