-- CreateTable
CREATE TABLE "user_group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroupMembers" (
    "user_id" TEXT NOT NULL,
    "user_group_id" INTEGER NOT NULL,

    CONSTRAINT "UserGroupMembers_pkey" PRIMARY KEY ("user_id","user_group_id")
);

-- AddForeignKey
ALTER TABLE "UserGroupMembers" ADD CONSTRAINT "UserGroupMembers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupMembers" ADD CONSTRAINT "UserGroupMembers_user_group_id_fkey" FOREIGN KEY ("user_group_id") REFERENCES "user_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
