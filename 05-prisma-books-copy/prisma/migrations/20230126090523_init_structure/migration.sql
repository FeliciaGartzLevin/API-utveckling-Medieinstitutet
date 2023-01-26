/*
  Warnings:

  - Added the required column `birthdate` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `author` ADD COLUMN `birthdate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `book` ADD COLUMN `isSelfPublished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isbn` VARCHAR(191) NULL;
