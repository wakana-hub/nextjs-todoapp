-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR(100) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'TODO',

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
