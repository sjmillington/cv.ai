/*
  Warnings:

  - You are about to drop the column `institute` on the `EducationEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EducationEntry" DROP COLUMN "institute",
ADD COLUMN     "institution" TEXT;
