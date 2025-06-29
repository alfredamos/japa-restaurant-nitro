-- CreateTable
CREATE TABLE `order-details` (
    `id` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `menuItemId` VARCHAR(255) NULL,
    `orderId` VARCHAR(255) NULL,
    `image` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `gender` ENUM('Female', 'Male') NOT NULL DEFAULT 'Male',
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('User', 'Staff', 'Admin') NOT NULL DEFAULT 'User',
    `address` TEXT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(255) NOT NULL DEFAULT 'wyhjuu4785ndndrnv89',
    `orderDate` DATETIME(3) NOT NULL,
    `totalQuantity` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `status` ENUM('Cancelled', 'Completed', 'Confirmed', 'Pickup') NOT NULL DEFAULT 'Confirmed',

    UNIQUE INDEX `orders_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu-items` (
    `id` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(255) NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `specialTag` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order-details` ADD CONSTRAINT `order-details_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menu-items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order-details` ADD CONSTRAINT `order-details_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu-items` ADD CONSTRAINT `menu-items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
