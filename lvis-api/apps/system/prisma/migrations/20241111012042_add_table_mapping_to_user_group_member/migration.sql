/*
  Warnings:

  - You are about to drop the `UserGroupMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGroupMembers" DROP CONSTRAINT "UserGroupMembers_user_group_id_fkey";

-- DropForeignKey
ALTER TABLE "UserGroupMembers" DROP CONSTRAINT "UserGroupMembers_user_id_fkey";

-- DropTable
DROP TABLE "UserGroupMembers";

-- CreateTable
CREATE TABLE "user_group_member" (
    "user_id" TEXT NOT NULL,
    "user_group_id" INTEGER NOT NULL,

    CONSTRAINT "user_group_member_pkey" PRIMARY KEY ("user_id","user_group_id")
);

-- AddForeignKey
ALTER TABLE "user_group_member" ADD CONSTRAINT "user_group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_member" ADD CONSTRAINT "user_group_member_user_group_id_fkey" FOREIGN KEY ("user_group_id") REFERENCES "user_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
