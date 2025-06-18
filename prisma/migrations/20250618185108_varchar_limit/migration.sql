-- DropForeignKey
ALTER TABLE `menu-items` DROP FOREIGN KEY `menu-items_userId_fkey`;

-- DropForeignKey
ALTER TABLE `order-details` DROP FOREIGN KEY `order-details_menuItemId_fkey`;

-- DropForeignKey
ALTER TABLE `order-details` DROP FOREIGN KEY `order-details_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- DropIndex
DROP INDEX `menu-items_userId_fkey` ON `menu-items`;

-- DropIndex
DROP INDEX `order-details_menuItemId_fkey` ON `order-details`;

-- DropIndex
DROP INDEX `order-details_orderId_fkey` ON `order-details`;

-- DropIndex
DROP INDEX `orders_userId_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `menu-items` MODIFY `userId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `order-details` MODIFY `itemName` VARCHAR(255) NOT NULL,
    MODIFY `menuItemId` VARCHAR(255) NULL,
    MODIFY `orderId` VARCHAR(255) NULL,
    MODIFY `image` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `userId` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `order-details` ADD CONSTRAINT `order-details_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menu-items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order-details` ADD CONSTRAINT `order-details_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu-items` ADD CONSTRAINT `menu-items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
