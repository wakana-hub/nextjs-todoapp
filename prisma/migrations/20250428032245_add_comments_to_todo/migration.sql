/*
  Warnings:

  - The `comments` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "comments",
ADD COLUMN     "comments" TEXT[] DEFAULT ARRAY[]::TEXT[];
