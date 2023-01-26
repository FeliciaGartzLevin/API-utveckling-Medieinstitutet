/*
  Warnings:

  - You are about to drop the column `isSelfPublished` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `author` MODIFY `birthdate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `isSelfPublished`;
