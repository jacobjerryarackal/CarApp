/*
  Warnings:

  - You are about to drop the column `featureId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleTypeIds` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "featureId",
DROP COLUMN "vehicleTypeIds";
