/*
  Warnings:

  - You are about to drop the column `name` on the `menu-items` table. All the data in the column will be lost.
  - Added the required column `itemName` to the `menu-items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu-items` DROP COLUMN `name`,
    ADD COLUMN `itemName` VARCHAR(255) NOT NULL;
