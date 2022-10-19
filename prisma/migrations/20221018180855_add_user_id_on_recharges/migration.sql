/*
  Warnings:

  - Added the required column `userId` to the `Recharges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recharges" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Recharges" ADD CONSTRAINT "Recharges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
