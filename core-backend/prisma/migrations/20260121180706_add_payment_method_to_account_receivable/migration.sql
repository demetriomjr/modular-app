/*
  Warnings:

  - Added the required column `paymentMethod` to the `AccountReceivable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountReceivable" ADD COLUMN     "paymentMethod" TEXT NOT NULL;
