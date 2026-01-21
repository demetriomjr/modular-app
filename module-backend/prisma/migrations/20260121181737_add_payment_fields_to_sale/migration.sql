-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "installments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethod" TEXT;
