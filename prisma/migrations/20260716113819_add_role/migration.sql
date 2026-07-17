/*
  Warnings:

  - You are about to drop the column `blind_buy_safe` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `longevity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `projection` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sillage` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `usage_time` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `brand` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(150)`.
  - You are about to alter the column `type` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(100)`.
  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `brand` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_userId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "blind_buy_safe",
DROP COLUMN "longevity",
DROP COLUMN "projection",
DROP COLUMN "sillage",
DROP COLUMN "usage_time",
ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "brand" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET NOT NULL,
DROP COLUMN "stock",
ADD COLUMN     "stock" INTEGER NOT NULL,
ALTER COLUMN "imageUrl" SET DATA TYPE TEXT,
ALTER COLUMN "notes" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "articles";
