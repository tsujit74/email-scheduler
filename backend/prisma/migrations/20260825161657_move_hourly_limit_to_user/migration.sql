/*
  Warnings:

  - You are about to drop the column `hourlyLimit` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "hourlyLimit";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hourlyEmailLimit" INTEGER NOT NULL DEFAULT 200;
