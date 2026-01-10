-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "readAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;
