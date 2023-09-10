/*
  Warnings:

  - The `start` column on the `WorkEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end` column on the `WorkEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "WorkEntry" DROP COLUMN "start",
ADD COLUMN     "start" DATE,
DROP COLUMN "end",
ADD COLUMN     "end" DATE;
